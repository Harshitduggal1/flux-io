import { NextResponse } from 'next/server';
import { generateBlogPostAction } from '@/app/actions'; // Updated import path

export async function POST(request: Request) {
  try {
    const params = await request.json();
    
    // Assuming the first argument is the current state (null for initial state)
    // and the second argument is the form data or params
    const result = await generateBlogPostAction(null, params);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error generating blog post:', error);
    return NextResponse.json({ error: 'Failed to generate blog post' }, { status: 500 });
  }
}
