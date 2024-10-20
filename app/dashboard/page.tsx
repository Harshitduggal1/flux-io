import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyState } from "../components/dashboard/EmptyState";
import prisma from "../utils/db";
import { requireUser } from "../utils/requireUser";
import SitesRoute from "./sites/page";
import Image from "next/image";
import Defaultimage from "@/public/default.png";
import { Button } from "@/components/ui/button";
import Link from "next/link";

async function getData(userId: string) {
  const [sites, articles] = await Promise.all([
    prisma.site.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 3,
    }),
    prisma.post.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 3,
    }),
  ]);

  return { sites, articles };
}

export default async function DashboardIndexPage() {
  const user = await requireUser();
  const { articles, sites } = await getData(user.id);
  return (
    <div className="bg-gradient-to-br from-blue-50 dark:from-blue-900 via-purple-50 dark:via-purple-900 to-pink-50 dark:to-pink-900 p-8 min-h-screen transition-all duration-500">
      <h1 className="bg-clip-text bg-gradient-to-r from-blue-600 hover:from-blue-500 via-purple-600 hover:via-purple-500 to-pink-600 hover:to-pink-500 mb-8 font-extrabold text-4xl text-transparent transition-all duration-300">Your Sites</h1>
      {sites.length > 0 ? (
        <div className="gap-6 lg:gap-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {sites.map((item) => (
            <Card key={item.id} className="bg-white dark:bg-gray-800 bg-opacity-30 dark:bg-opacity-30 shadow-lg hover:shadow-2xl backdrop-blur-lg backdrop-filter rounded-2xl transform transition-all hover:-translate-y-2 duration-300 overflow-hidden">
              <div className="relative">
                <Image
                  src={item.imageUrl ?? Defaultimage}
                  alt={item.name}
                  className="w-full h-48 transform transition-transform duration-300 object-cover hover:scale-110"
                  width={400}
                  height={200}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <CardHeader className="space-y-2">
                <CardTitle className="bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 font-bold text-2xl text-transparent truncate">{item.name}</CardTitle>
                <CardDescription className="line-clamp-3 text-gray-600 dark:text-gray-300">
                  {item.description}
                </CardDescription>
              </CardHeader>

              <CardFooter>
                <Button asChild className="bg-gradient-to-r from-blue-500 hover:from-blue-600 via-purple-500 hover:via-purple-600 to-pink-500 hover:to-pink-600 shadow-lg hover:shadow-xl px-6 py-3 rounded-full w-full font-bold text-white transform transition-all duration-300 hover:scale-105">
                  <Link href={`/dashboard/sites/${item.id}`}>
                    <span className="relative z-10">View Articles</span>
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="You don't have any sites created"
          description="You currently don't have any Sites. Please create some so that you can see them right here."
          href="/dashboard/sites/new"
          buttonText="Create Site"
        />
      )}

      <h1 className="bg-clip-text bg-gradient-to-r from-green-400 hover:from-green-300 via-blue-500 hover:via-blue-400 to-purple-600 hover:to-purple-500 mt-16 mb-8 font-extrabold text-4xl text-transparent transition-all duration-300">Recent Articles</h1>
      {articles.length > 0 ? (
        <div className="gap-6 lg:gap-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((item) => (
            <Card key={item.id} className="bg-white dark:bg-gray-800 bg-opacity-30 dark:bg-opacity-30 shadow-lg hover:shadow-2xl backdrop-blur-lg backdrop-filter rounded-2xl transform transition-all hover:-translate-y-2 duration-300 overflow-hidden">
              <div className="relative">
                <Image
                  src={item.image ?? Defaultimage}
                  alt={item.title}
                  className="w-full h-48 transform transition-transform duration-300 object-cover hover:scale-110"
                  width={400}
                  height={200}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <CardHeader className="space-y-2">
                <CardTitle className="bg-clip-text bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 font-bold text-2xl text-transparent truncate">{item.title}</CardTitle>
                <CardDescription className="line-clamp-3 text-gray-600 dark:text-gray-300">
                  {item.smallDescription}
                </CardDescription>
              </CardHeader>

              <CardFooter>
                <Button asChild className="bg-gradient-to-r from-green-400 hover:from-green-500 via-blue-500 hover:via-blue-600 to-purple-600 hover:to-purple-700 shadow-lg hover:shadow-xl px-6 py-3 rounded-full w-full font-bold text-white transform transition-all duration-300 hover:scale-105">
                  <Link href={`/dashboard/sites/${item.siteId}/${item.id}`}>
                    <span className="relative z-10">Edit Article</span>
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="You don't have any articles created"
          description="You currently don't have any articles created. Please create some so that you can see them right here"
          buttonText="Create Article"
          href="/dashboard/sites"
        />
      )}
    </div>
  );
}