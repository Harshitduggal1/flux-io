"use client";

import { UploadDropzone } from "@/app/utils/uploadthing";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Atom } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import TailwindEditor from "../EditorWrapper";
import { useState } from "react";
import { JSONContent } from "novel";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { PostSchema } from "@/app/utils/zodSchemas";
import { EditPostActions } from "@/app/actions";
import slugify from "react-slugify";
import { useFormState } from "@/app/hooks/useFormState";
import { useFormStatus } from 'react-dom';

interface iAppProps {
  data: {
    slug: string;
    title: string;
    smallDescription: string;
    articleContent: any;
    id: string;
    image: string;
  };
  siteId: string;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Submitting...' : 'Edit Article'}
    </Button>
  );
}

export function EditArticleForm({ data, siteId }: iAppProps) {
  const [imageUrl, setImageUrl] = useState<string>(data.image);
  const [value, setValue] = useState<JSONContent>(data.articleContent);
  const [slug, setSlugValue] = useState<string>(data.slug);
  const [title, setTitle] = useState<string>(data.title);

  const [state, formAction] = useFormState(EditPostActions, null);

  const [form, fields] = useForm({
    lastResult: state,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: PostSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  function handleSlugGeneration() {
    if (!title || title.length === 0) {
      return toast.error("Please create a title first");
    }
    setSlugValue(slugify(title));
    return toast.success("Slug has been created");
  }

  return (
    <Card className="mt-5">
      <CardHeader>
        <CardTitle className="bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 font-bold text-transparent">Article Details</CardTitle>
        <CardDescription className="bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent">
          Edit your article details below 
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="flex flex-col gap-6"
          id={form.id}
          action={formAction}
        >
          <input type="hidden" name="articleId" value={data.id} />
          <input type="hidden" name="siteId" value={siteId} />
          <div className="gap-2 grid">
            <Label>Title</Label>
            <Input
              key={fields.title.key}
              name={fields.title.name}
              defaultValue={fields.title.initialValue}
              placeholder="Nextjs blogging application"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            />
            <p className="text-red-500 text-sm">{fields.title.errors}</p>
          </div>

          <div className="gap-2 grid">
            <Label>Slug</Label>
            <Input
              key={fields.slug.key}
              name={fields.slug.name}
              defaultValue={fields.slug.initialValue}
              placeholder="Article Slug"
              onChange={(e) => setSlugValue(e.target.value)}
              value={slug}
            />
            <Button
              onClick={handleSlugGeneration}
              className="w-fit"
              variant="secondary"
              type="button"
            >
              <Atom className="mr-2 size-4" /> Generate Slug
            </Button>
            <p className="text-red-500 text-sm">{fields.slug.errors}</p>
          </div>

          <div className="gap-2 grid">
            <Label>Small Description</Label>
            <Textarea
              key={fields.smallDescription.key}
              name={fields.smallDescription.name}
              defaultValue={data.smallDescription}
              placeholder="Small Description for your blog article..."
              className="h-32"
            />
            <p className="text-red-500 text-sm">
              {fields.smallDescription.errors}
            </p>
          </div>

          <div className="gap-2 grid">
            <Label>Cover Image</Label>
            <input
              type="hidden"
              name={fields.coverImage.name}
              key={fields.coverImage.key}
              defaultValue={fields.coverImage.initialValue}
              value={imageUrl}
            />
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt="Uploaded Image"
                className="rounded-lg w-[200px] h-[200px] object-cover"
                width={200}
                height={200}
              />
            ) : (
              <UploadDropzone
                onClientUploadComplete={(res) => {
                  setImageUrl(res[0].url);
                  toast.success("Image has been uploaded");
                }}
                endpoint="imageUploader"
                onUploadError={() => {
                  toast.error("Something went wrong...");
                }}
              />
            )}
            <p className="text-red-500 text-sm">{fields.coverImage.errors}</p>
          </div>

          <div className="gap-2 grid">
            <Label>Article Content</Label>
            <input
              type="hidden"
              name={fields.articleContent.name}
              key={fields.articleContent.key}
              defaultValue={fields.articleContent.initialValue}
              value={JSON.stringify(value)}
            />
            <TailwindEditor onChange={setValue} initialValue={value} />
            <p className="text-red-500 text-sm">
              {fields.articleContent.errors}
            </p>
          </div>

          <SubmitButton />
        </form>
        {state && <p>Last action result: {JSON.stringify(state)}</p>}
      </CardContent>
    </Card>
  );
}