import { generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthings/core";

export const { useUploadThing, uploadFiles } =
  generateReactHelpers<OurFileRouter>();
