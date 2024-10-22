"use client";

import { useActionState } from "react";
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

export default function NewSiteRoute() {
  const [state, formAction, isPending] = useActionState(CreateSiteAction, null);
  
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

  return (
    <div className="flex flex-col flex-1 justify-center items-center bg-gradient-to-br from-blue-50 dark:from-blue-900 via-purple-50 dark:via-purple-900 to-pink-50 dark:to-pink-900 p-8 min-h-screen">
      <Card className="bg-white dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-80 shadow-xl hover:shadow-2xl backdrop-blur-lg backdrop-filter rounded-2xl w-full max-w-[450px] transition-all duration-300 overflow-hidden">
        <CardHeader className="space-y-1">
          <CardTitle className="bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 font-extrabold text-3xl text-transparent">Create Site</CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400">
            Create your Site here. Click the button below once you&apos;re done...
          </CardDescription>
        </CardHeader>
        <form id={form.id} action={formAction}>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="font-medium text-gray-700 text-sm dark:text-gray-300">Site Name</Label>
                <Input
                  name={fields.name.name}
                  key={fields.name.key}
                  defaultValue={fields.name.initialValue}
                  placeholder="Site Name"
                  className="border-gray-300 shadow-sm px-3 py-2 border focus:border-blue-500 rounded-md focus:ring-2 focus:ring-blue-500 w-full transition-all duration-200"
                />
                <p className="text-red-500 text-sm">{fields.name.errors}</p>
              </div>

              <div className="space-y-2">
                <Label className="font-medium text-gray-700 text-sm dark:text-gray-300">Subdirectory</Label>
                <Input
                  name={fields.subdirectory.name}
                  key={fields.subdirectory.key}
                  defaultValue={fields.subdirectory.initialValue}
                  placeholder="Subdirectory"
                  className="border-gray-300 shadow-sm px-3 py-2 border focus:border-blue-500 rounded-md focus:ring-2 focus:ring-blue-500 w-full transition-all duration-200"
                />
                <p className="text-red-500 text-sm">
                  {fields.subdirectory.errors}
                </p>
              </div>

              <div className="space-y-2">
                <Label className="font-medium text-gray-700 text-sm dark:text-gray-300">Description</Label>
                <Textarea
                  name={fields.description.name}
                  key={fields.description.key}
                  defaultValue={fields.description.initialValue}
                  placeholder="Small Description for your site"
                  className="border-gray-300 shadow-sm px-3 py-2 border focus:border-blue-500 rounded-md focus:ring-2 focus:ring-blue-500 w-full transition-all duration-200 resize-none"
                  rows={4}
                />
                <p className="text-red-500 text-sm">
                  {fields.description.errors}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton text="Create Site" className="bg-gradient-to-r from-blue-500 hover:from-blue-600 via-purple-500 hover:via-purple-600 to-pink-500 hover:to-pink-600 px-4 py-2 rounded-full focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full font-bold text-white transform transition-all duration-300 hover:scale-105 focus:outline-none" />
          </CardFooter>
        </form>
        {isPending && <p>Loading...</p>}
        {state && <p>{JSON.stringify(state)}</p>}
      </Card>
    </div>
  );
}
