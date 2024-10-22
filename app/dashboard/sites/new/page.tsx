"use client";

import { CreateSiteAction } from "@/app/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { siteSchema } from "@/app/utils/zodSchemas";
import { SubmitButton } from "@/app/components/dashboard/SubmitButtons";
import { useFormState } from "@/app/hooks/useFormState";
import { useState } from 'react';

export default function NewSiteRoute() {
  const [state, formAction] = useFormState(CreateSiteAction, null);
  const [isPending, setIsPending] = useState(false);
  
  const [form, fields] = useForm({
    lastResult: state,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: siteSchema,
      });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPending(true);
    const formData = new FormData(event.currentTarget);
    await formAction(formData);
    setIsPending(false);
  };

  return (
    <div className="flex flex-col flex-1 justify-center items-center bg-gradient-to-br from-blue-50 dark:from-blue-900 via-purple-50 dark:via-purple-900 to-pink-50 dark:to-pink-900 p-8 min-h-screen">
      <Card className="border-white bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 shadow-2xl hover:shadow-3xl backdrop-blur-xl backdrop-filter border border-opacity-20 rounded-3xl w-full max-w-[500px] transform transition-all duration-500 overflow-hidden ease-in-out hover:scale-105">
        <CardHeader className="space-y-2 p-6">
          <CardTitle className="bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 font-extrabold text-4xl text-transparent tracking-tight">Create Site</CardTitle>
          <CardDescription className="bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 font-medium text-transparent">
            Craft your digital space. Let&apos;s build something amazing together.
          </CardDescription>
        </CardHeader>
        <form id={form.id} onSubmit={handleSubmit} className="space-y-6">
          <CardContent className="space-y-8 p-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="font-semibold text-gray-700 text-sm dark:text-gray-200">Site Name</Label>
                <Input
                  name={fields.name.name}
                  key={fields.name.key}
                  defaultValue={fields.name.initialValue}
                  placeholder="Enter your site name"
                  className="border-gray-300 dark:border-gray-600 bg-opacity-50 shadow-sm backdrop-blur-sm px-4 py-3 border focus:border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500 w-full transition-all duration-300"
                />
                <p className="mt-1 text-red-500 text-sm">{fields.name.errors}</p>
              </div>

              <div className="space-y-2">
                <Label className="font-semibold text-gray-700 text-sm dark:text-gray-200">Subdirectory</Label>
                <Input
                  name={fields.subdirectory.name}
                  key={fields.subdirectory.key}
                  defaultValue={fields.subdirectory.initialValue}
                  placeholder="e.g., blog, shop, portfolio"
                  className="border-gray-300 dark:border-gray-600 bg-opacity-50 shadow-sm backdrop-blur-sm px-4 py-3 border focus:border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500 w-full transition-all duration-300"
                />
                <p className="mt-1 text-red-500 text-sm">
                  {fields.subdirectory.errors}
                </p>
              </div>

              <div className="space-y-2">
                <Label className="font-semibold text-gray-700 text-sm dark:text-gray-200">Description</Label>
                <Textarea
                  name={fields.description.name}
                  key={fields.description.key}
                  defaultValue={fields.description.initialValue}
                  placeholder="Describe your site in a few words✨..."
                  className="border-gray-300 dark:border-gray-600 bg-opacity-50 shadow-sm backdrop-blur-sm px-4 py-3 border focus:border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500 w-full transition-all duration-300 resize-none"
                  rows={4}
                />
                <p className="mt-1 text-red-500 text-sm">
                  {fields.description.errors}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-6">
            <SubmitButton 
              text="Create Site"
              disabled={isPending}
              className="bg-gradient-to-r from-blue-500 hover:from-blue-600 via-purple-500 hover:via-purple-600 to-pink-500 hover:to-pink-600 focus:ring-opacity-50 shadow-lg hover:shadow-xl px-6 py-3 rounded-full focus:ring-4 focus:ring-blue-300 w-full font-bold text-lg text-white transform transition-all duration-300 hover:scale-105 focus:outline-none"
            />
          </CardFooter>
        </form>
        {state && (
          <div className="px-6 pb-6">
            <p className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-gray-600 text-sm dark:text-gray-400">
              Last action result: {JSON.stringify(state)}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
