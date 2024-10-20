import { NextResponse } from 'next/server';
import prisma from '@/app/utils/db';
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function PUT(request: Request, { params }: { params: { commentId: string } }) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { content } = await request.json();
    const { commentId } = params;

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    if (comment.userId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized to update this comment' }, { status: 403 });
    }

    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: { content },
    });

    return NextResponse.json(updatedComment);
  } catch (error) {
    console.error('Error updating comment:', error);
    return NextResponse.json({ error: 'Failed to update comment' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { commentId: string } }
) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { commentId } = params;

    console.log('Attempting to delete comment:', commentId);

    // Check if the comment exists and belongs to the user
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: { replies: true },
    });

    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    if (comment.userId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized to delete this comment' }, { status: 403 });
    }

    let result;

    // If the comment has replies, mark it as deleted
    if (comment.replies.length > 0) {
      result = await prisma.comment.update({
        where: { id: commentId },
        data: { 
          content: '[deleted]',
        },
      });
    } else {
      // If no replies, delete the comment and its associated likes
      await prisma.like.deleteMany({
        where: { commentId: commentId },
      });

      result = await prisma.comment.delete({
        where: { id: commentId },
      });
    }

    console.log('Comment operation completed successfully:', commentId);
    return NextResponse.json({ message: 'Comment operation completed successfully', result });
  } catch (error) {
    console.error('Error processing comment:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
