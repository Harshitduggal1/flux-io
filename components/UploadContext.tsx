'use client'

import React, { createContext, useContext, ReactNode } from 'react';
import { useUploadThing } from '@/lib/uploadthing';

interface UploadContextType {
  startUpload: ReturnType<typeof useUploadThing>['startUpload'];
}

const UploadContext = createContext<UploadContextType | undefined>(undefined);

export const useUpload = () => {
  const context = useContext(UploadContext);
  if (!context) {
    throw new Error('useUpload must be used within an UploadProvider');
  }
  return context;
};

interface UploadProviderProps {
  children: ReactNode;
}

export const UploadProvider: React.FC<UploadProviderProps> = ({ children }) => {
  const { startUpload } = useUploadThing('videoOrAudioUploader');

  return (
    <UploadContext.Provider value={{ startUpload }}>
      {children}
    </UploadContext.Provider>
  );
};
