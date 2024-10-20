/* eslint-disable react/no-children-prop */
'use client'

import { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import UploadForm from "@/components/upload/upload-form";
import { UploadProvider } from '@/components/UploadContext';
import { useKindeAuth } from '@kinde-oss/kinde-auth-nextjs';

export default function GeneratePage() {
  const [planTypeName] = useState("Free"); // Placeholder, replace with actual logic when available
  const { user } = useKindeAuth();

  return (
    <UploadProvider>
      <div className="mx-auto px-6 lg:px-8 py-24 sm:py-32 max-w-7xl">
        <div className="flex flex-col justify-center items-center gap-6 text-center">
          <Badge className="bg-gradient-to-r from-purple-700 to-pink-800 px-4 py-1 font-semibold text-lg text-white capitalize">
            {planTypeName} Plan
          </Badge>

          <h2 className="font-bold text-3xl text-gray-900 sm:text-4xl capitalize tracking-tight">
            Start creating amazing content
          </h2>

          <p className="mt-2 max-w-2xl text-center text-gray-600 text-lg leading-8">
            Upload your audio or video file and let our AI do the magic!
          </p>

          <UploadForm userId={user?.id || ''} />
        </div>
      </div>
    </UploadProvider>
  );
}
