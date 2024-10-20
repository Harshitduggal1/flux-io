import { NextResponse } from 'next/server';
import { transcribeUploadedFile } from '@/actions/upload-actions';

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  const userId = formData.get('userId') as string;

  const resp = [{ serverData: { userId, file } }];
  const result = await transcribeUploadedFile(resp);
  return NextResponse.json(result);
}
