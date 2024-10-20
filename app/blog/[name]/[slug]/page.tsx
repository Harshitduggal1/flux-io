import { RenderArticle } from "@/app/components/dashboard/RenderArticle";
import prisma from "@/app/utils/db";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JSONContent } from "novel";
import ReactionButton from "@/components/ReactionButton";
import CommentSection from "@/components/CommentSection";
import PageViews from "@/components/PageViews";
import ShareLinks from "@/components/ShareLinks";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import ScrollTracker from "@/components/Ai-scroll";

type Reaction = 'like' | 'love' | 'clap' | 'fire' | 'rocket';

async function getData(name: string, slug: string) {
  const site = await prisma.site.findUnique({
    where: { subdirectory: name },
    select: { id: true },
  });

  if (!site) return notFound();

  const post = await prisma.post.findFirst({
    where: { siteId: site.id, slug: slug },
    include: {
      reactions: true,
      comments: {
        where: { parentId: null },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profileImage: true,
            },
          },
          replies: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  profileImage: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!post) return notFound();

  const reactionCounts: Record<Reaction, number> = {
    like: 0,
    love: 0,
    clap: 0,
    fire: 0,
    rocket: 0
  };

  post.reactions.forEach(reaction => {
    if (reaction.type in reactionCounts) {
      reactionCounts[reaction.type as Reaction]++;
    }
  });

  const { getUser } = getKindeServerSession();
  const user = await getUser();

  let userReaction = null;
  if (user) {
    const reaction = await prisma.reaction.findUnique({
      where: {
        userId_postId: {
          userId: user.id,
          postId: post.id,
        },
      },
      select: { type: true },
    });
    userReaction = reaction?.type || null;
  }

  return {
    ...post,
    reactionCounts,
    userReaction,
  };
}

export default async function SlugRoute({
  params,
}: {
  params: { slug: string; name: string };
}) {
  const data = await getData(params.name, params.slug);

  // Increment page views
  await prisma.post.update({
    where: { id: data.id },
    data: { views: { increment: 1 } },
  });

  return (
    <>
      <ScrollTracker />
      <div className="flex items-center gap-x-3 pt-10 pb-5">
        <Button size="icon" variant="outline" asChild>
          <Link href={`/blog/${params.name}`}>
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <h1 className="font-medium text-xl">Go Back</h1>
      </div>

      <div className="flex flex-col justify-center items-center mb-10">
        <div className="m-auto w-full md:w-7/12 text-center">
          <p className="m-auto my-5 w-10/12 font-light text-muted-foreground text-sm md:text-base">
            {new Intl.DateTimeFormat("en-US", {
              dateStyle: "medium",
            }).format(data.createdAt)}
          </p>
          <h1 className="mb-5 font-bold text-3xl md:text-6xl tracking-tight">
            {data.title}
          </h1>
          <p className="m-auto line-clamp-3 w-10/12 text-muted-foreground">
            {data.smallDescription}
          </p>
        </div>
      </div>

      <div className="relative m-auto mb-10 md:mb-20 md:rounded-2xl w-full md:w-5/6 lg:w-2/3 max-w-screen-lg h-80 md:h-[450px] overflow-hidden">
        <Image
          src={data.image}
          alt={data.title}
          width={1200}
          height={630}
          className="w-full h-full object-cover"
          priority
        />
      </div>

      <RenderArticle json={data.articleContent as unknown as JSONContent} />
      
      <div className="flex flex-col items-center gap-4 mt-10">
      <ReactionButton 
        postId={data.id} 
        initialReactions={data.reactionCounts}
        initialUserReaction={data.userReaction as Reaction | null}
      />
        <PageViews views={data.views} />
        <ShareLinks url={`/blog/${params.name}/${params.slug}`} title={data.title} />
      </div>

      <CommentSection postId={data.id} />

    </>
  );
}
