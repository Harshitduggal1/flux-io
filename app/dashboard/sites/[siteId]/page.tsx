import { EmptyState } from "@/app/components/dashboard/EmptyState";
import prisma from "@/app/utils/db";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import {
  Book,
  MoreHorizontal,
  PlusCircle,
  Settings,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

async function getData(siteId: string) {
  // Fetch the site without filtering by userId
  const data = await prisma.site.findUnique({
    where: {
      id: siteId,
    },
    select: {
      subdirectory: true,
      posts: {
        select: {
          image: true,
          title: true,
          createdAt: true,
          id: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  return data;
}

export default async function SiteIdRoute({
  params,
}: {
  params: { siteId: string };
}) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  // Optional: Redirect to login if user is not authenticated
  // If you want to allow viewing without authentication, you can remove this check
  if (!user) {
    // Uncomment the next line if you want to redirect unauthenticated users
    // return redirect("/api/auth/login");
  }

  const data = await getData(params.siteId);

  if (!data) {
    return <EmptyState title="Site not found" description="The site you are looking for does not exist." buttonText={""} href={""} />;
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 dark:from-blue-900 via-purple-50 dark:via-purple-900 to-pink-50 dark:to-pink-900 p-8 min-h-screen transition-all duration-500">
      <div className="flex justify-end gap-x-4 mb-8 w-full">
        <Button asChild variant="secondary" className="bg-white dark:bg-gray-800 hover:bg-opacity-90 dark:hover:bg-opacity-90 shadow-lg hover:shadow-xl px-4 py-2 rounded-full font-semibold text-gray-800 dark:text-white transform transition-all duration-300 hover:scale-105">
          <Link href={`/blog/${data?.subdirectory}`} className="flex items-center">
            <Book className="mr-2 size-4" />
            <span className="bg-clip-text bg-gradient-to-r from-blue-500 hover:from-purple-500 to-purple-500 hover:to-pink-500 text-transparent transition-all duration-300">View Blog</span>
          </Link>
        </Button>
        <Button asChild variant="secondary" className="bg-white dark:bg-gray-800 hover:bg-opacity-90 dark:hover:bg-opacity-90 shadow-lg hover:shadow-xl px-4 py-2 rounded-full font-semibold text-gray-800 dark:text-white transform transition-all duration-300 hover:scale-105">
          <Link href={`/dashboard/sites/${params.siteId}/settings`} className="flex items-center">
            <Settings className="mr-2 size-4" />
            <span className="bg-clip-text bg-gradient-to-r from-green-400 hover:from-blue-500 to-blue-500 hover:to-green-400 text-transparent transition-all duration-300">Settings</span>
          </Link>
        </Button>
        <Button asChild className="bg-gradient-to-r from-blue-500 hover:from-blue-600 via-purple-500 hover:via-purple-600 to-pink-500 hover:to-pink-600 shadow-lg hover:shadow-xl px-6 py-2 rounded-full font-bold text-white transform transition-all duration-300 hover:scale-105">
          <Link href={`/dashboard/sites/${params.siteId}/create`} className="flex items-center">
            <PlusCircle className="mr-2 size-4" />
            <span className="relative z-10">Create Article</span>
          </Link>
        </Button>
      </div>

      {data?.posts === undefined || data.posts.length === 0 ? (
        <EmptyState
          title="You don't have any Articles created"
          description="You currently don't have any articles. Please create some so that you can see them right here."
          buttonText="Create Article"
          href={`/dashboard/sites/${params.siteId}/create`}
        />
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow-2xl hover:shadow-3xl rounded-3xl transition-all duration-300 overflow-hidden">
          <Card className="border-0">
            <CardHeader className="bg-gradient-to-r from-blue-100 dark:from-blue-900 to-purple-100 dark:to-purple-900 p-8">
              <CardTitle className="bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 font-extrabold text-4xl text-transparent">Articles</CardTitle>
              <CardDescription className="text-gray-600 text-lg dark:text-gray-300">
                Manage your Articles in a simple and intuitive interface
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 dark:bg-gray-700">
                    <TableHead className="font-bold text-gray-700 dark:text-gray-200">Image</TableHead>
                    <TableHead className="font-bold text-gray-700 dark:text-gray-200">Title</TableHead>
                    <TableHead className="font-bold text-gray-700 dark:text-gray-200">Status</TableHead>
                    <TableHead className="font-bold text-gray-700 dark:text-gray-200">Created At</TableHead>
                    <TableHead className="text-right font-bold text-gray-700 dark:text-gray-200">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.posts.map((item) => (
                    <TableRow key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                      <TableCell>
                        <Image
                          src={item.image}
                          width={64}
                          height={64}
                          alt="Article Cover Image"
                          className="shadow-md hover:shadow-lg rounded-md transition-all duration-300 object-cover size-16"
                        />
                      </TableCell>
                      <TableCell className="font-medium text-gray-800 dark:text-gray-200">
                        {item.title}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-green-100 dark:bg-green-900 px-3 py-1 rounded-full font-semibold text-green-800 text-xs dark:text-green-100"
                        >
                          Published
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-300">
                        {new Intl.DateTimeFormat("en-US", {
                          dateStyle: "medium",
                        }).format(item.createdAt)}
                      </TableCell>

                      <TableCell className="text-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost" className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200">
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xl border rounded-xl">
                            <DropdownMenuLabel className="text-gray-700 dark:text-gray-200">Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
                            <DropdownMenuItem asChild className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                              <Link
                                href={`/dashboard/sites/${params.siteId}/${item.id}`}
                                className="text-blue-600 hover:text-blue-800 dark:hover:text-blue-300 dark:text-blue-400 transition-colors duration-200"
                              >
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                              <Link
                                href={`/dashboard/sites/${params.siteId}/${item.id}/delete`}
                                className="text-red-600 hover:text-red-800 dark:hover:text-red-300 dark:text-red-400 transition-colors duration-200"
                              >
                                Delete
                              </Link>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
