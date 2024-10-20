import prisma from "@/app/utils/db";
import Image from "next/image";
import { notFound } from "next/navigation";
import Logo from "@/public/logo.svg";
import { ThemeToggle } from "@/app/components/dashboard/ThemeToggle";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Defaultimage from "@/public/default.png";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { PlusCircle } from "lucide-react";
import { EmptyState } from "@/app/components/dashboard/EmptyState";

async function getData(subDir: string) {
  const data = await prisma.site.findUnique({
    where: {
      subdirectory: subDir,
    },
    select: {
      id: true,
      name: true,
      posts: {
        select: {
          smallDescription: true,
          title: true,
          image: true,
          createdAt: true,
          slug: true,
          id: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
}

export default async function BlogIndexPage({
  params,
}: {
  params: { name: string };
}) {
  const data = await getData(params.name);

  if (!data) {
    return <EmptyState title="Blog not found" description="The blog you are looking for does not exist." buttonText={""} href={""} />;
  }

  return (
    <div className="bg-transparent min-h-screen transition-all duration-500">
      <nav className="top-0 z-50 sticky bg-white/30 dark:bg-black/30 shadow-lg backdrop-blur-lg">
        <div className="flex justify-between items-center mx-auto px-4 py-3 container">
          <div className="flex items-center space-x-4">
            <Image src={Logo} alt="Logo" width={40} height={40} className="shadow-md hover:shadow-xl rounded-full transition-all duration-300" />
            <h1 className="bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 font-bold text-3xl text-transparent tracking-tight">{data.name}</h1>
          </div>
          <ThemeToggle />
        </div>
      </nav>

      <div className="flex flex-col items-center gap-12 mx-auto px-4 py-16 container">
        <div className="bg-white/10 dark:bg-black/10 shadow-2xl hover:shadow-3xl backdrop-blur-xl rounded-3xl w-full max-w-3xl transition-all duration-500 overflow-hidden">
          <div className="space-y-8 p-12">
            <h2 className="bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 font-extrabold text-5xl text-center text-transparent">Create Your Next Masterpiece</h2>
            <p className="text-center text-gray-700 text-xl dark:text-gray-300">Unleash your creativity and share your unique perspective with the world.</p>
            <Button asChild className="bg-gradient-to-r from-blue-500 hover:from-blue-600 via-purple-500 hover:via-purple-600 to-pink-500 hover:to-pink-600 shadow-lg hover:shadow-xl py-6 rounded-full w-full text-xl transform hover:scale-105 font-bold text-white transition-all duration-300">
              <Link href={`/dashboard/sites/${data.id}/create`}>
                <PlusCircle className="mr-3 size-6" />
                Create New Article
              </Link>
            </Button>
          </div>
        </div>

        <div className="w-full max-w-6xl">
          {data.posts.length === 0 ? (
            <EmptyState
              title="No Articles Found"
              description="There are currently no articles in this blog. Click the button to create your first article."
              buttonText="Create Article"
              href={`/dashboard/sites/${data.id}/create`}
            />
          ) : (
            <div className="gap-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {data.posts.map((item) => (
                <Card key={item.id} className="bg-white/5 dark:bg-gray-800/5 hover:shadow-2xl backdrop-blur-md rounded-2xl transition-all hover:-translate-y-2 duration-300 overflow-hidden group">
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={item.image ?? Defaultimage}
                      alt={item.title}
                      className="group-hover:scale-110 w-full h-full transition-transform duration-500 object-cover"
                      width={400}
                      height={200}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <CardHeader className="space-y-2">
                    <CardTitle className="bg-clip-text bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 font-extrabold text-2xl text-transparent truncate">{item.title}</CardTitle>
                    <CardDescription className="line-clamp-3 text-gray-600 text-sm dark:text-gray-300">
                      {item.smallDescription}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild className="w-full transform hover:scale-105 bg-gradient-to-r from-green-400 hover:from-green-500 via-blue-500 hover:via-blue-600 to-purple-600 hover:to-purple-700 shadow-lg hover:shadow-xl rounded-full font-bold text-white transition-all duration-300">
                      <Link href={`/blog/${params.name}/${item.slug}`}>
                        Read more
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
