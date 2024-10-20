import { NextResponse } from 'next/server';
import prisma from '@/app/utils/db';
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get('postId');
  const sortBy = searchParams.get('sortBy') || 'newest';
  const limit = Number(searchParams.get('limit')) || 10;

  if (!postId) {
    return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
  }

  let orderBy: any = { createdAt: 'desc' };
  if (sortBy === 'oldest') orderBy = { createdAt: 'asc' };
  if (sortBy === 'mostLikes') {
    orderBy = { likes: { _count: 'desc' } };
  }

  const comments = await prisma.comment.findMany({
    where: { postId, parentId: null },
    orderBy,
    take: limit,
    include: {
      user: { select: { firstName: true, lastName: true, profileImage: true } },
      replies: {
        include: {
          user: { select: { firstName: true, lastName: true, profileImage: true } },
        },
        orderBy: { createdAt: 'asc' },
      },
      likes: { select: { id: true } }, // Include likes to get the count
    },
  });

  // Transform the comments to include the like count
  const transformedComments = comments.map(comment => ({
    ...comment,
    likeCount: comment.likes.length,
    likes: undefined, // Remove the likes array from the response
  }));

  return NextResponse.json(transformedComments);
}

export async function POST(request: Request) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { postId, content, parentId } = await request.json();

    // Validate required fields
    if (!postId || !content) {
      console.log('Missing required fields:', { postId, content });
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    console.log('Checking if post exists...');
    // Validate that the post exists
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      console.log('Post not found:', postId);
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // If parentId is provided, validate that the parent comment exists
    if (parentId) {
      console.log('Checking if parent comment exists...');
      const parentComment = await prisma.comment.findUnique({ where: { id: parentId } });
      if (!parentComment) {
        console.log('Parent comment not found:', parentId);
        return NextResponse.json({ error: 'Parent comment not found' }, { status: 404 });
      }
    }

    console.log('Creating new comment...');
    const newComment = await prisma.comment.create({
      data: {
        postId,
        content,
        userId: user.id,
        parentId
      },
      include: {
        user: { select: { firstName: true, lastName: true, profileImage: true } },
      },
    });

    console.log('New comment created:', newComment);
    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      return NextResponse.json({ error: error.message, name: error.name }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
