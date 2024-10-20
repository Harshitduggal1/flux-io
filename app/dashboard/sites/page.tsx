import prisma from "@/app/utils/db";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { FileIcon, PlusCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Defaultimage from "@/public/default.png";
import { EmptyState } from "@/app/components/dashboard/EmptyState";

async function getData() {
  // Fetch all sites without filtering by userId
  const data = await prisma.site.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return data;
}

export default async function SitesRoute() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return redirect("/api/auth/login");
  }

  // Fetch all sites
  const data = await getData();

  return (
    <>
      <div className="flex justify-end w-full">
        <Button asChild className="relative overflow-hidden group">
          <Link href={"/dashboard/sites/new"} className="inline-flex justify-center items-center bg-gradient-to-r from-blue-500 hover:from-blue-600 via-purple-500 hover:via-purple-600 to-pink-500 hover:to-pink-600 shadow-lg hover:shadow-xl mx-auto px-6 py-3 rounded-full focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 max-w-xs font-semibold text-base text-white transform transition-all hover:-translate-y-1 duration-300 ease-in-out focus:outline-none">
            <span className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-50 blur-xl w-full h-full transition-opacity duration-300"></span>
            <span className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-70 blur-xl w-full h-full transition-opacity duration-300 filter"></span>
            <span className="relative z-10 flex items-center">
              <PlusCircle className="mr-2 animate-pulse size-5" />
              <span className="text-2xl text-white">Create Site with AI✨</span>
            </span>
          </Link>
        </Button>
      </div>

      {data === undefined || data.length === 0 ? (
        <EmptyState
          title="You don't have any Sites created"
          description="You currently don't have any Sites. Please create some so that you can see them right here!"
          buttonText="Create Site"
          href="/dashboard/sites/new"
        />
      ) : (
        <div className="gap-4 lg:gap-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((item) => (
            <Card key={item.id}>
              <Image
                src={item.imageUrl ?? Defaultimage}
                alt={item.name}
                className="rounded-t-lg w-full h-[200px] object-cover"
                width={400}
                height={200}
              />
              <CardHeader>
                <CardTitle className="truncate">{item.name}</CardTitle>
                <CardDescription className="line-clamp-3">
                  {item.description}
                </CardDescription>
              </CardHeader>

              <CardFooter>
                <Button asChild className="relative bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-lg hover:shadow-xl w-full transition-all duration-300 overflow-hidden group">
                  <Link href={`/dashboard/sites/${item.id}`} className="block relative">
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></span>
                    <span className="absolute inset-0 opacity-0 group-hover:opacity-100 shadow-[0_0_15px_rgba(59,130,246,0.5),0_0_15px_rgba(167,139,250,0.5),0_0_15px_rgba(236,72,153,0.5)] rounded-lg transition-opacity duration-300"></span>
                    <span className="block relative z-10 px-4 py-2 font-bold text-lg text-white transition-all duration-300">
                      View Articles
                    </span>
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
