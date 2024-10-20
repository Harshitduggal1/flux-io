"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const prisma = new PrismaClient();

export async function updatePostAction(data: {
  postId: string;
  content: string;
}) {
  const { postId, content } = data;

  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) {
    console.error("User not authenticated");
    return {
      success: false,
      message: "User not authenticated",
    };
  }

  try {
    const [title, ...contentParts] = content?.split("\n\n") || [];
    const updatedTitle = title.split("#")[1].trim();

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { userId: true },
    });

    if (!post || post.userId !== user.id) {
      console.error("Post not found or user not authorized");
      return {
        success: false,
        message: "Post not found or user not authorized",
      };
    }

    // Prepare the update data
    const updateData: any = {
      title: updatedTitle,
    };

    // Check if 'content' or 'articleContent' exists in your schema
    if ('content' in prisma.post.fields) {
      updateData.content = content;
    } else if ('articleContent' in prisma.post.fields) {
      updateData.articleContent = content;
    } else {
      // If neither exists, you might want to store it as JSON
      updateData.data = JSON.stringify({ content });
    }

    await prisma.post.update({
      where: { id: postId },
      data: updateData,
    });

    revalidatePath(`/posts/${postId}`);
    return {
      success: true,
    };
  } catch (error) {
    console.error("Error occurred in updating the post", postId, error);
    return {
      success: false,
      message: "Error updating post",
    };
  }
}
