import ContentEditor from "@/components/content/content-editor";
import prisma from "@/app/utils/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";

interface ArticleContent {
  content?: string;
}

export default async function PostsPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) {
    redirect("/sign-in");
  }

  const post = await prisma.posts.findFirst({
    where: {
      userId: user.id,
      id: id,
    },
  });

  if (!post) {
    notFound();
  }

  // Parse the articleContent JSON and extract the content
  let content = "";
  try {
    if (typeof post.articleContent === 'string') {
      const parsedContent = JSON.parse(post.articleContent) as ArticleContent;
      content = parsedContent.content || "";
    } else if (typeof post.articleContent === 'object' && post.articleContent !== null) {
      const typedContent = post.articleContent as ArticleContent;
      content = typedContent.content || "";
    }
  } catch (error) {
    console.error("Error parsing articleContent:", error);
    content = "Error loading content";
  }

  // Ensure content is a string
  content = typeof content === 'string' ? content : JSON.stringify(content);

  // Transform the post data to match what ContentEditor expects
  const transformedPost = {
    content: content,
    title: post.title,
    id: post.id,
  };

  return (
    <div className="mx-auto mt-28 mb-12 px-2.5 lg:px-0 w-full max-w-screen-xl">
      <ContentEditor post={transformedPost} />
    </div>
  );
}
