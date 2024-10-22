import { NextResponse } from 'next/server';
import { generateBlogPostAction } from '@/app/actions';

export async function POST(request: Request) {
  try {
    const params = await request.json();
    const result = await generateBlogPostAction(params);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error generating blog post:', error);
    return NextResponse.json({ error: 'Failed to generate blog post' }, { status: 500 });
  }
}
