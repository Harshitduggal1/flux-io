import { NextResponse } from 'next/server';
import prisma from '@/app/utils/db';
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function POST(request: Request, { params }: { params: { commentId: string } }) {
  try {
    const { getUser } = getKindeServerSession();
    const kindeUser = await getUser();

    if (!kindeUser || !kindeUser.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { commentId } = params;

    console.log('Attempting to like/unlike comment:', commentId);

    // Check if the comment exists
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      console.log('Comment not found:', commentId);
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { id: kindeUser.id },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          id: kindeUser.id,
          email: kindeUser.email || '',
          firstName: kindeUser.given_name || '',
          lastName: kindeUser.family_name || '',
        },
      });
    }

    // Check if the user has already liked the comment
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_commentId: {
          userId: user.id,
          commentId: commentId
        }
      }
    });

    let result;
    if (existingLike) {
      // User has already liked, so remove the like
      result = await prisma.like.delete({
        where: { id: existingLike.id },
      });
      console.log('Like removed for commentId:', commentId, 'userId:', user.id);
    } else {
      // User hasn't liked, so add a new like
      result = await prisma.like.create({
        data: {
          userId: user.id,
          commentId: commentId,
        },
      });
      console.log('New like created for commentId:', commentId, 'userId:', user.id);
    }

    // Get the updated like count
    const likeCount = await prisma.like.count({
      where: { commentId: commentId },
    });

    return NextResponse.json({ likeCount });
  } catch (error) {
    console.error('Error processing like:', error);
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      return NextResponse.json({ error: error.message, name: error.name }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}