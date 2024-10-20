import BgGradient from "@/components/common/bg-gradient";
import prisma from "@/app/utils/db"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import AuthCheck from "@/components/AuthCheck"; // We'll create this component

export default async function Page() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) {
    // Instead of redirecting, we'll render nothing and let AuthCheck handle it
    return <AuthCheck />;
  }

  const posts = await prisma.posts.findMany({
    where: {
      userId: user.id,
      status: "draft", // Assuming all generated posts start as drafts
    },
    orderBy: {
      createdAt: 'desc'
    },
    select: {
      id: true,
      title: true,
      smallDescription: true,
      articleContent: true,
      createdAt: true,
    }
  });

  return (
    <main className="mx-auto mt-28 mb-12 px-2.5 lg:px-0 w-full max-w-screen-xl">
      <h2 className="mb-2 font-semibold text-2xl text-gray-800">
        Your generated posts ✍️
      </h2>

      {posts.length === 0 && (
        <div>
          <p className="mb-4 line-clamp-3 text-gray-600 text-lg lg:text-xl">
            You have no generated posts yet. Upload a video or audio to get started.
          </p>
          <Link
            href={`/dashboard/generate`}
            className="flex items-center gap-2 font-medium text-purple-600 hover:text-purple-800"
          >
            Go to Generate Page <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => {
          let content = post.smallDescription || '';
          if (typeof post.articleContent === 'string') {
            try {
              const parsedContent = JSON.parse(post.articleContent);
              content = parsedContent.content || post.smallDescription || '';
            } catch (error) {
              console.error("Error parsing articleContent:", error);
            }
          }

          return (
            <BgGradient key={post.id}>
              <div className="bg-white shadow-md hover:shadow-lg p-6 rounded-lg transition-shadow duration-300">
                <h3 className="mb-2 font-semibold text-gray-800 text-xl truncate">
                  {post.title}
                </h3>
                <p className="mb-4 line-clamp-3 text-gray-600 text-sm">
                  {content}
                </p>
                <div className="flex justify-between items-center">
                  <Link
                    href={`/posts/${post.id}`}
                    className="flex items-center gap-1 font-medium text-purple-600 hover:text-purple-800"
                  >
                    Read more <ArrowRight className="pt-1 w-5 h-5" />
                  </Link>
                  <span className="text-gray-500 text-xs">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </BgGradient>
          );
        })}
      </div>
    </main>
  );
}
