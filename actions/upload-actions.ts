"use server";
import https from 'https';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from 'next/server';
import prisma from '@/app/utils/db';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import fs from 'fs';
import path from 'path';
import os from 'os';
import axios from 'axios'; // Make sure to install axios: npm install axios
import { v4 as uuidv4 } from 'uuid';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

const API_KEY_ID = process.env.SPEECHFLOW_API_KEY_ID!;
const API_KEY_SECRET = process.env.SPEECHFLOW_API_KEY_SECRET!;
const LANG = "en";
const RESULT_TYPE = 4; // Plain text format

let ffmpeg: FFmpeg | null = null;

async function loadFFmpeg() {
  if (ffmpeg === null) {
    ffmpeg = new FFmpeg();
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.4/dist/umd'
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });
  }
  return ffmpeg;
}

function httpsRequest(options: https.RequestOptions, data?: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => { responseData += chunk; });
      res.on('end', () => resolve(responseData));
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function convertToWav(fileUrl: string): Promise<string> {
  const ffmpeg = await loadFFmpeg();

  const inputFileName = 'input' + path.extname(fileUrl);
  const outputFileName = 'output.wav';

  await ffmpeg.writeFile(inputFileName, await fetchFile(fileUrl));

  // Force conversion to a widely supported WAV format
  await ffmpeg.exec([
    '-i', inputFileName,
    '-acodec', 'pcm_s16le',
    '-ar', '16000',
    '-ac', '1',
    '-f', 'wav',
    outputFileName
  ]);

  const data = await ffmpeg.readFile(outputFileName);
  const tempFilePath = path.join(os.tmpdir(), 'converted_audio.wav');
  fs.writeFileSync(tempFilePath, data);

  return tempFilePath;
}

async function fallbackTranscription(fileUrl: string): Promise<string> {
  // This is a placeholder for a fallback transcription service
  // You might want to use a service like AssemblyAI, Rev.ai, or Google Speech-to-Text
  // For this example, we'll use a mock implementation
  console.log("Using fallback transcription service for file:", fileUrl);
  
  // Simulate transcription process
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  return "This is a fallback transcription. Please implement a real fallback service.";
}

async function ensureFileAccessible(fileUrl: string): Promise<void> {
  try {
    const response = await axios.head(fileUrl);
    if (response.status !== 200) {
      throw new Error(`File not accessible. Status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error checking file accessibility:", error);
    throw new Error("Unable to access the uploaded file. Please try uploading again.");
  }
}

export async function transcribeUploadedFile(fileUrl: string): Promise<string> {
  console.log("Starting transcription process for file:", fileUrl);

  try {
    await ensureFileAccessible(fileUrl);

    // Always convert the file, regardless of its original format
    console.log("Converting file to WAV format...");
    const wavFilePath = await convertToWav(fileUrl);
    console.log("File converted successfully. WAV file path:", wavFilePath);

    const createData = `lang=${LANG}&remotePath=${wavFilePath}`;
    const createResponse = await httpsRequest({
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': createData.length,
        'keyId': API_KEY_ID,
        'keySecret': API_KEY_SECRET
      },
      hostname: 'api.speechflow.io',
      path: '/asr/file/v1/create'
    }, createData);

    console.log("SpeechFlow create response:", createResponse);

    const createResult = JSON.parse(createResponse);
    if (createResult.code !== 0) {
      throw new Error(`Failed to start transcription: ${createResult.msg}`);
    }

    const { taskId } = createResult;

    while (true) {
      const queryResponse = await httpsRequest({
        method: 'GET',
        headers: { 'keyId': API_KEY_ID, 'keySecret': API_KEY_SECRET },
        hostname: 'api.speechflow.io',
        path: `/asr/file/v1/query?taskId=${taskId}&resultType=${RESULT_TYPE}`
      });

      console.log("SpeechFlow query response:", queryResponse);

      const result = JSON.parse(queryResponse);
      if (result.code === 11000) {
        return result.result; // This is the text transcription of the video
      } else if (result.code === 11001) {
        await new Promise(resolve => setTimeout(resolve, 3000));
      } else {
        throw new Error(`Transcription failed: ${result.msg}`);
      }
    }
  } catch (error) {
    console.error("Error in primary transcription method:", error);
    console.log("Attempting fallback transcription...");
    return fallbackTranscription(fileUrl);
  }
}

async function getUserBlogPosts(userId: string): Promise<string> {
  const posts = await prisma.post.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 3,
    select: { articleContent: true },
  });
  return posts.map((post) => post.articleContent).join("\n\n");
}

async function generateBlogPost(transcription: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `You are a skilled content writer that converts audio transcriptions into well-structured, engaging blog posts in Markdown format. Create a comprehensive blog post with a catchy title, introduction, main body with multiple sections, and a conclusion. Keep the tone casual and professional.

Please convert the following transcription into a well-structured blog post using Markdown formatting. Follow this structure:

1. Start with a SEO friendly catchy title on the first line.
2. Add two newlines after the title.
3. Write an engaging introduction paragraph.
4. Create multiple sections for the main content, using appropriate headings (##, ###).
5. Include relevant subheadings within sections if needed.
6. Use bullet points or numbered lists where appropriate.
7. Add a conclusion paragraph at the end.
8. Ensure the content is informative, well-organized, and easy to read.

Here's the transcription to convert: ${transcription}`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  return response.text();
}

async function saveBlogPost(title: string, content: string, userId: string) {
  try {
    const post = await prisma.posts.create({
      data: {
        title,
        articleContent: JSON.stringify({ content }),
        smallDescription: content.substring(0, 150),
        userId,
        image: "default-image-url.jpg", // Provide a default image URL
        slug: title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
        likes: 0,
        views: 0,
        status: "draft",
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: [],
        metaDescription: content.substring(0, 160),
        featuredImage: null,
      },
    });
    return post.id;
  } catch (error) {
    console.error("Error saving blog post:", error);
    throw error;
  }
}

export async function generateBlogPostAction(uploadResponse: any, userId: string) {
  try {
    console.log("Received upload response:", JSON.stringify(uploadResponse, null, 2));

    if (!uploadResponse) {
      return { success: false, message: "Upload response is null or undefined" };
    }

    let fileUrl: string | undefined;

    if (Array.isArray(uploadResponse) && uploadResponse.length > 0) {
      fileUrl = uploadResponse[0].url;
    } else if (typeof uploadResponse === 'object' && uploadResponse !== null) {
      fileUrl = uploadResponse.url;
    }

    if (!fileUrl) {
      console.log("File URL not found in upload response");
      return { success: false, message: "File URL is missing in the upload response" };
    }

    console.log("File URL found:", fileUrl);

    // Step 1: Transcribe the uploaded file
    let transcription;
    try {
      transcription = await transcribeUploadedFile(fileUrl);
      console.log("Transcription completed");
    } catch (transcriptionError) {
      console.error("Transcription error:", transcriptionError);
      return { 
        success: false, 
        message: "Transcription failed. Please try again or contact support if the issue persists." 
      };
    }

    // Step 2: Generate blog post using Gemini
    const blogPost = await generateBlogPost(transcription);
    console.log("Blog post generated");

    if (!blogPost) {
      return { success: false, message: "Blog post generation failed" };
    }

    // Step 3: Extract title and content
    const [title, ...contentParts] = blogPost.split("\n\n");
    const content = contentParts.join("\n\n");

    // Step 4: Save the blog post
    let postId;
    try {
      postId = await saveBlogPost(title.replace("### ", ""), content, userId);
      console.log("Blog post saved with ID:", postId);
    } catch (saveError) {
      console.error("Error saving blog post:", saveError);
      return { 
        success: false, 
        message: saveError instanceof Error ? saveError.message : "Failed to save blog post" 
      };
    }

    // Step 5: Revalidate the posts page
    revalidatePath('/posts');

    // Return success with postId
    return { success: true, postId };

  } catch (error) {
    console.error("Error in generateBlogPostAction:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
