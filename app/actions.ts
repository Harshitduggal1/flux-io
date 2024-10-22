"use server";

import { redirect } from "next/navigation";
import { parseWithZod } from "@conform-to/zod";
import { PostSchema, SiteCreationSchema, siteSchema } from "./utils/zodSchemas";
import prisma from "./utils/db";
import { requireUser } from "./utils/requireUser";
import { stripe } from "./utils/stripe";
import { transcribeUploadedFile as originalTranscribeUploadedFile } from './actions/upload-actions';

// Action to create a new site
export async function CreateSiteAction(prevState: any, formData: FormData) {
  // Your action logic here
  // Use formData to get the form values
  // Return the new state
}

// Action to create a new blog post
export async function CreatePostAction(prevState: any, formData: FormData) {
  const user = await requireUser();

  const submission = parseWithZod(formData, {
    schema: PostSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  await prisma.post.create({
    data: {
      title: submission.value.title,
      smallDescription: submission.value.smallDescription,
      slug: submission.value.slug,
      articleContent: JSON.parse(submission.value.articleContent),
      image: submission.value.coverImage,
      userId: user.id,
      siteId: formData.get("siteId") as string,
    },
  });

  return redirect(`/dashboard/sites/${formData.get("siteId")}`);
}

// Action to edit an existing post
export async function EditPostActions(formData: FormData) {
  // Your action logic here
  // Use formData to get the form values
  // Return the new state
}

// Action to delete a post
export async function DeletePost(formData: FormData) {
  const user = await requireUser();

  await prisma.post.delete({
    where: {
      userId: user.id,
      id: formData.get("articleId") as string,
    },
  });

  return redirect(`/dashboard/sites/${formData.get("siteId")}`);
}

// Action to update the image of a site
export async function UpdateImage(formData: FormData) {
  const user = await requireUser();

  await prisma.site.update({
    where: {
      userId: user.id,
      id: formData.get("siteId") as string,
    },
    data: {
      imageUrl: formData.get("imageUrl") as string,
    },
  });

  return redirect(`/dashboard/sites/${formData.get("siteId")}`);
}

// Action to delete a site
export async function DeleteSite(formData: FormData) {
  const user = await requireUser();

  await prisma.site.delete({
    where: {
      userId: user.id,
      id: formData.get("siteId") as string,
    },
  });

  return redirect("/dashboard/sites");
}

// Action to create a subscription
export async function CreateSubscription() {
  const user = await requireUser();

  let stripeUserId = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    select: {
      customerId: true,
      email: true,
      firstName: true,
    },
  });

  // Create a new Stripe customer if one doesn't exist
  if (!stripeUserId?.customerId) {
    const stripeCustomer = await stripe.customers.create({
      email: stripeUserId?.email,
      name: stripeUserId?.firstName,
    });

    stripeUserId = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        customerId: stripeCustomer.id,
      },
    });
  }

  // Create a Stripe checkout session
  const session = await stripe.checkout.sessions.create({
    customer: stripeUserId.customerId as string,
    mode: "subscription",
    billing_address_collection: "auto",
    payment_method_types: ["card"],
    line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
    customer_update: {
      address: "auto",
      name: "auto",
    },
    success_url:
      process.env.NODE_ENV === "production"
        ? "https://blog-marshal.vercel.app/dashboard/payment/success"
        : "http://localhost:3000/dashboard/payment/success",
    cancel_url:
      process.env.NODE_ENV === "production"
        ? "https://blog-marshal.vercel.app/dashboard/payment/cancelled"
        : "http://localhost:3000/dashboard/payment/cancelled",
  });

  return redirect(session.url as string);
}

// Function to validate site data using siteSchema
export async function ValidateSite(siteData: any) {
  const result = siteSchema.safeParse(siteData);
  return result.success ? { isValid: true } : { isValid: false, errors: result.error.errors };
}

// Wrapper function for transcribeUploadedFile
export async function transcribeUploadedFile(params: any): Promise<any> {
  return originalTranscribeUploadedFile(params);
}

// Action to generate a blog post
export async function generateBlogPostAction(params: any) {
  // Implementation
}
