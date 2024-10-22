"use client"

import React, { useState } from 'react';
import { useFormState } from '@/app/hooks/useFormState'; // Updated import
import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import slugify from 'react-slugify';
import Image from 'next/image';
import Link from 'next/link';
import { JSONContent } from 'novel';
import confetti from 'canvas-confetti';

import { CreatePostAction } from '@/app/actions';
import { PostSchema } from '@/app/utils/zodSchemas';
import TailwindEditor from '@/app/components/dashboard/EditorWrapper';
import { UploadDropzone } from '@/app/utils/uploadthing';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SubmitButton } from '@/app/components/dashboard/SubmitButtons';

import { ArrowLeft, Atom, Clipboard, Sparkles } from 'lucide-react';

export default function ArticleCreationRoute({ params }: { params: { siteId: string } }) {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [value, setValue] = useState<JSONContent | undefined>(undefined);
  const [prompt, setPrompt] = useState('');
  const [slug, setSlugValue] = useState<string | undefined>(undefined);
  const [title, setTitle] = useState<string | undefined>(undefined);
  const [generatedContent, setGeneratedContent] = useState<string | undefined>(undefined);
  const [state, formAction] = useFormState(CreatePostAction, null); // Updated usage
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingText, setGeneratingText] = useState('Generate Article');

  const [form, fields] = useForm({
    lastResult: state,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: PostSchema });
    },
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
  });

  async function handleGenerateArticle() {
    if (!genAI) {
      toast.error('API key not set.');
      return;
    }

    if (!prompt) {
      toast.error('Please enter a prompt for content generation.');
      return;
    }

    setIsGenerating(true);
    const texts = [
      "Wait while AI is doing magic✨",
      "It would take a moment⏳",
      "Crafting your content🎨",
      "Almost there!🚀"
    ];
    let i = 0;

    const interval = setInterval(() => {
      setGeneratingText(texts[i]);
      i = (i + 1) % texts.length;
    }, 2000);

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
      const result = await model.generateContent([
        `Write a detailed article about "${prompt}". Include an introduction, main points, and a conclusion.`,
      ]);
      const generatedText = await result.response.text();

      console.log('Generated Text:', generatedText);

      setGeneratedContent(generatedText);

      const jsonContent: JSONContent = {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: generatedText }],
          },
        ],
      };

      setValue(jsonContent);
      toast.success('Content generated successfully!');
    } catch (error) {
      console.error('Error generating content:', error);
      toast.error('Failed to generate content. Please try again.');
    } finally {
      clearInterval(interval);
      setIsGenerating(false);
      setGeneratingText('Generate Article');
    }
  }

  function handleSlugGeneration() {
    if (!title) {
      return toast.error('Please create a title first');
    }
    setSlugValue(slugify(title));
    toast.success('Slug has been created');
  }

  const copyToClipboard = () => {
    if (generatedContent) {
      navigator.clipboard.writeText(generatedContent)
        .then(() => {
          toast.success('Content copied to clipboard!');
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        })
        .catch((err) => {
          console.error('Failed to copy: ', err);
          toast.error('Failed to copy content.');
        });
    }
  };

  return (
  
      <div className="mx-auto w-11/12 max-w-7xl h-screen">
        <div className="flex items-center mb-8">
          <Button size="icon" variant="outline" className="hover:bg-blue-100 dark:hover:bg-blue-900 mr-3 transition-colors duration-300" asChild>
            <Link href={`/dashboard/sites/${params.siteId}`}>
              <ArrowLeft className="text-blue-600 dark:text-blue-400 size-4" />
            </Link>
          </Button>
          <h1 className="bg-clip-text bg-gradient-to-r from-pink-500 dark:from-pink-300 via-purple-500 dark:via-purple-300 to-blue-500 dark:to-blue-300 font-bold text-4xl text-transparent">Create Article</h1>
        </div>

        <Card className="bg-white dark:bg-gray-800 shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <CardHeader className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 p-6 text-white overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/30 via-purple-400/30 to-pink-400/30 animate-gradient-x"></div>
            <CardTitle className="relative z-10 text-white">Article Details</CardTitle>
            <CardDescription className="relative z-10 text-blue-100">
              Create your article with magical AI✨
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form
              className="flex flex-col gap-8"
              id={form.id}
              action={formAction}
            >
              <input type="hidden" name="siteId" value={params.siteId} />
              
              <div className="space-y-2">
                <Label className="font-semibold text-gray-700 text-lg dark:text-gray-300">Title</Label>
                <Input
                  key={fields.title.key}
                  name={fields.title.name}
                  defaultValue={fields.title.initialValue}
                  placeholder="Nextjs blogging application"
                  onChange={(e) => setTitle(e.target.value)}
                  value={title}
                  className="border-2 border-gray-300 p-3 focus:border-blue-500 rounded-lg text-lg transition-all duration-300"
                />
                <p className="text-red-500 text-sm">{fields.title.errors}</p>
              </div>

              <div className="space-y-2">
                <Label className="font-semibold text-gray-700 text-lg dark:text-gray-300">Slug</Label>
                <div className="flex items-center gap-4">
                  <Input
                    key={fields.slug.key}
                    name={fields.slug.name}
                    defaultValue={fields.slug.initialValue}
                    placeholder="Article Slug"
                    onChange={(e) => setSlugValue(e.target.value)}
                    value={slug}
                    className="flex-grow border-2 border-gray-300 p-3 focus:border-blue-500 rounded-lg text-lg transition-all duration-300"
                  />
                  <Button
                    onClick={handleSlugGeneration}
                    className="relative bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-white transition-all duration-300 overflow-hidden group"
                    type="button"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-pink-400 via-blue-400 to-cyan-400 opacity-0 group-hover:opacity-50 blur-xl w-full h-full transition-opacity duration-1000"></span>
                    <span className="absolute inset-0 bg-gradient-to-r from-pink-500 via-blue-500 to-cyan-500 opacity-0 group-hover:opacity-70 blur-xl w-full h-full transition-opacity duration-1000 filter"></span>
                    <span className="relative z-10 flex items-center">
                      <Atom className="mr-2 size-5" />
                      <span className="font-semibold text-lg">Generate Slug</span>
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-pink-300 via-blue-300 to-purple-300 opacity-0 group-hover:opacity-30 transition-opacity animate-pulse duration-2000"></span>
                  </Button>
                </div>
                <p className="text-red-500 text-sm">{fields.slug.errors}</p>
              </div>

              <div className="space-y-2">
                <Label className="font-semibold text-gray-700 text-lg dark:text-gray-300">Small Description</Label>
                <Textarea
                  key={fields.smallDescription.key}
                  name={fields.smallDescription.name}
                  defaultValue={fields.smallDescription.initialValue}
                  placeholder="Small Description for your blog article..."
                  className="border-2 border-gray-300 p-3 focus:border-blue-500 rounded-lg h-32 text-lg transition-all duration-300"
                />
                <p className="text-red-500 text-sm">
                  {fields.smallDescription.errors}
                </p>
              </div>

              <div className="space-y-4 bg-gradient-to-r from-blue-50 dark:from-blue-900 to-purple-50 dark:to-purple-900 shadow-md p-4 rounded-lg">
                <Label className="bg-clip-text bg-gradient-to-r from-pink-500 via-blue-500 to-purple-500 font-semibold text-lg text-transparent">Let Our Magic AI generate your Article</Label>
                <div className="flex sm:flex-row flex-col items-stretch sm:items-center gap-4">
                  <Input
                    placeholder="Enter a prompt for Article generation With Our Magic AI"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="flex-grow border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-3 focus:border-blue-500 rounded-lg text-lg transition-all duration-300"
                  />
                  <Button 
                    onClick={handleGenerateArticle} 
                    className="relative bg-gradient-to-r from-pink-600 via-blue-700 to-purple-800 shadow-lg px-6 py-3 rounded-lg text-white transform transition-all duration-300 hover:scale-105 overflow-hidden group"
                    type="button"
                    disabled={isGenerating}
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-pink-600 via-blue-700 to-cyan-700 opacity-0 group-hover:opacity-50 blur-xl w-full h-full transition-opacity duration-1000"></span>
                    <span className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-800 to-cyan-700 opacity-0 group-hover:opacity-70 blur-xl w-full h-full transition-opacity duration-1000 filter"></span>
                    <span className="relative z-10 flex items-center">
                      {isGenerating ? (
                        <svg className="mr-3 -ml-1 w-5 h-5 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <Sparkles className="mr-2 text-xs animate-pulse size-3" />
                      )}
                      <span className="text-sm">{generatingText}</span>
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-pink-600 via-blue-700 to-purple-800 opacity-0 group-hover:opacity-30 transition-opacity animate-pulse duration-2000"></span>
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="font-semibold text-gray-800 text-lg dark:text-gray-300">Generated Content</Label>
                <Textarea
                  className="border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-4 focus:border-blue-500 rounded-lg min-h-[200px] text-gray-900 text-lg dark:text-gray-100 transition-all duration-300"
                  value={generatedContent || ''}
                  rows={10}
                  readOnly
                  placeholder="Generated AI content will appear here✨..."
                />
                <Button 
                  onClick={copyToClipboard} 
                  className="relative bg-gradient-to-r from-purple-500 hover:from-purple-600 via-pink-500 hover:via-pink-600 to-red-500 hover:to-red-600 px-6 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 font-bold text-white transform transition-all duration-300 overflow-hidden group hover:scale-105 focus:outline-none"
                  type="button"
                >
                  <span className="top-0 left-0 absolute bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 opacity-0 group-hover:opacity-50 blur-xl w-full h-full transition-opacity duration-300"></span>
                  <span className="top-0 left-0 absolute bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 opacity-0 group-hover:opacity-70 w-full h-full transition-opacity duration-300 filter"></span>
                  <span className="relative z-10 flex justify-center items-center">
                    <Clipboard className="mr-2 text-neon-purple animate-pulse size-5" />
                    <span className="text-lg text-neon-pink">Copy to ClipboardClipboard⚡️</span>
                  </span>
                  <span className="group-hover:scale-x-100 bottom-0 left-0 absolute bg-gradient-to-r from-purple-300 via-pink-300 to-red-300 w-full h-1 transform transition-transform duration-300 scale-x-0"></span>
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-100 shadow-[0_0_15px_rgba(147,51,234,0.5),0_0_15px_rgba(236,72,153,0.5),0_0_15px_rgba(239,68,68,0.5)] rounded-lg transition-opacity duration-300"></span>
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-70 shadow-[0_0_25px_rgba(147,51,234,0.7),0_0_25px_rgba(236,72,153,0.7),0_0_25px_rgba(239,68,68,0.7)] rounded-lg transition-opacity animate-pulse duration-500"></span>
                </Button>
              </div>

              <div className="space-y-4">
                <Label className="font-semibold text-gray-700 text-lg dark:text-gray-300">Now past your Article Content here 👇🏻</Label>
                <input
                  type="hidden"
                  name={fields.articleContent.name}
                  key={fields.articleContent.key}
                  defaultValue={fields.articleContent.initialValue}
                  value={JSON.stringify(value)}
                />
                <div className="border-2 border-blue-800 rounded-lg overflow-hidden">
                  <TailwindEditor onChange={setValue} initialValue={value} />
                </div>
                <p className="text-red-500 text-sm">
                  {fields.articleContent.errors}
                </p>
              </div>

              <div className="space-y-4">
                <Label className="font-semibold text-gray-800 text-lg dark:text-gray-300">Cover Image</Label>
                <input
                  type="hidden"
                  name="coverImage"
                  value={imageUrl}
                />
                {imageUrl ? (
                  <div className="relative rounded-lg w-full h-64 overflow-hidden">
                    <Image
                      src={imageUrl}
                      alt="Uploaded Image"
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="border-2 border-blue-800 p-8 border-dashed rounded-lg text-center">
                    <UploadDropzone
                      onClientUploadComplete={(res: { url: React.SetStateAction<string | undefined>; }[]) => {
                        setImageUrl(res[0].url);
                        toast.success("Image has been uploaded");
                      }}
                      endpoint="imageUploader"
                      onUploadError={() => {
                        toast.error("Something went wrong...");
                      }}
                    />
                  </div>
                )}
              </div>

              <SubmitButton text="Create Article" className="bg-blue-600 hover:bg-blue-700 mt-8 py-4 rounded-lg font-bold text-lg text-white transition-colors duration-300" />
            </form>
          </CardContent>
        </Card>
        {state && <p>Last action result: {JSON.stringify(state)}</p>}
      </div>

  );
}
