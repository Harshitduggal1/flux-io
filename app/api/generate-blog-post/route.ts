import { NextResponse } from 'next/server';
import { generateBlogPostAction } from '@/actions/upload-actions';

export async function POST(request: Request) {
  const params = await request.json();
  const result = await generateBlogPostAction(params);
  return NextResponse.json(result);
}
