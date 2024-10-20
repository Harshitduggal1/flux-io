import { NextResponse } from 'next/server';
import prisma from '@/app/utils/db';

export async function POST(request: Request) {
  try {
    const { postId } = await request.json();
    
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: { likes: { increment: 1 } },
    });
    
    return NextResponse.json({ likes: updatedPost.likes }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update likes' }, { status: 500 });
  }
}
