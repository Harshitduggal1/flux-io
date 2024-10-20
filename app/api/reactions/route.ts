import { NextResponse } from 'next/server';
import prisma from '@/app/utils/db';
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

type Reaction = 'like' | 'love' | 'clap' | 'fire' | 'rocket';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get('postId');
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!postId) {
    return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
  }

  const reactions = await prisma.reaction.groupBy({
    by: ['type'],
    where: { postId },
    _count: true,
  });

  const userReaction = user ? await prisma.reaction.findUnique({
    where: {
      userId_postId: {
        userId: user.id,
        postId: postId,
      },
    },
    select: { type: true },
  }) : null;

  const formattedReactions = {
    like: 0,
    love: 0,
    clap: 0,
    fire: 0,
    rocket: 0
  };

  reactions.forEach(reaction => {
    if (reaction.type in formattedReactions) {
      formattedReactions[reaction.type as keyof typeof formattedReactions] = reaction._count;
    }
  });

  return NextResponse.json({
    reactions: formattedReactions,
    userReaction: userReaction?.type || null,
  });
}

export async function POST(request: Request) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { postId, reaction } = await request.json();

  if (!postId || !reaction) {
    return NextResponse.json({ error: 'Post ID and reaction type are required' }, { status: 400 });
  }

  const existingReaction = await prisma.reaction.findUnique({
    where: {
      userId_postId: {
        userId: user.id,
        postId: postId,
      },
    },
  });

  if (existingReaction) {
    if (existingReaction.type === reaction) {
      // If the user is clicking the same reaction, remove it
      await prisma.reaction.delete({
        where: {
          userId_postId: {
            userId: user.id,
            postId: postId,
          },
        },
      });
    } else {
      // If the user is changing their reaction, update it
      await prisma.reaction.update({
        where: {
          userId_postId: {
            userId: user.id,
            postId: postId,
          },
        },
        data: {
          type: reaction,
        },
      });
    }
  } else {
    // If the user is clicking a new reaction, create it
    await prisma.reaction.create({
      data: {
        type: reaction,
        userId: user.id,
        postId: postId,
      },
    });
  }

  // Fetch updated reactions
  const updatedReactions = await prisma.reaction.groupBy({
    by: ['type'],
    where: { postId },
    _count: true,
  });

  const formattedReactions: Record<Reaction, number> = {
    like: 0,
    love: 0,
    clap: 0,
    fire: 0,
    rocket: 0
  };

  updatedReactions.forEach(reaction => {
    if (reaction.type in formattedReactions) {
      formattedReactions[reaction.type as Reaction] = reaction._count;
    }
  });

  return NextResponse.json({
    reactions: formattedReactions,
    userReaction: reaction,
  });
}
