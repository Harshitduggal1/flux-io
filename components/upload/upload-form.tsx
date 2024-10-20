"use client";

import { useState } from "react";
import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useToast } from "@/hooks/use-toast";
import { useUploadThing } from "@/lib/uploadthing";
import { generateBlogPostAction } from "@/actions/upload-actions";
import { useRouter } from "next/navigation";

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const ACCEPTED_FILE_TYPES = ["audio/mpeg", "audio/wav", "video/mp4", "video/quicktime"];

const schema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, `Max file size is 100MB.`)
    .refine(
      (file) => ACCEPTED_FILE_TYPES.includes(file.type),
      "Only .mp3, .wav, .mp4 and .mov files are accepted."
    ),
});

interface UploadFormProps {
  userId: string;
}

export default function UploadForm({ userId }: UploadFormProps) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const router = useRouter();

  const { startUpload } = useUploadThing("videoOrAudioUploader", {
    onUploadProgress: (progress) => {
      setUploadProgress(progress);
    },
    onClientUploadComplete: () => {
      setIsUploading(false);
      setUploadProgress(0);
      toast({ title: "Upload completed successfully!" });
    },
    onUploadError: (error) => {
      setIsUploading(false);
      setUploadProgress(0);
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: error.message || "An unexpected error occurred during upload.",
        variant: "destructive",
        duration: 5000,
      });
    },
  });

  const handleTranscribe = async (formData: FormData) => {
    try {
      const file = formData.get("file") as File;
      const validatedFields = schema.parse({ file });

      setIsUploading(true);
      toast({
        title: "Upload started",
        description: "Your file is being uploaded. Please wait...",
        duration: 5000,
      });

      const resp = await startUpload([validatedFields.file]);
      console.log("Upload response:", JSON.stringify(resp, null, 2));

      if (!resp || resp.length === 0) {
        throw new Error("No response from upload service");
      }

      toast({
        title: "🎙️ Transcription and blog post generation in progress...",
        description: "Hang tight! Our digital wizards are working their magic! ✨",
        duration: 10000,
      });

      const result = await generateBlogPostAction(resp, userId);

      if (!result.success) {
        throw new Error(result.message || "An unexpected error occurred");
      }

      if (result.success && result.postId) {
        router.push(`/posts/${result.postId}`);
      } else {
        // Handle error
        console.error(result.message);
        // You might want to show an error message to the user here
      }

    } catch (error) {
      console.error("Error in handleTranscribe:", error);
      toast({
        title: "An error occurred",
        description: error instanceof Error ? error.message : "Please try again or contact support if the issue persists.",
        variant: "destructive",
        duration: 10000,
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <form className="flex flex-col gap-6" action={handleTranscribe}>
      <div className="flex justify-end items-center gap-1.5">
        <Input
          id="file"
          name="file"
          type="file"
          accept={ACCEPTED_FILE_TYPES.join(",")}
          required
          disabled={isUploading}
        />
        <Button type="submit" className="bg-purple-600" disabled={isUploading}>
          {isUploading ? "Processing..." : "Transcribe & Generate Blog"}
        </Button>
      </div>
      {isUploading && (
        <div className="bg-gray-200 dark:bg-gray-700 rounded-full w-full h-2.5">
          <div
            className="bg-blue-600 rounded-full h-2.5"
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
      )}
    </form>
  );
}
