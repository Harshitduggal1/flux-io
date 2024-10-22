import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "@/app/utils/db";

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // Get the user session from Kinde authentication
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  // Check if user exists and has an ID
  if (!user || user === null || !user.id) {
    throw new Error("Something went wrong");
  }

  // Try to find the user in the database
  let dbUser = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
  });

  // If user doesn't exist in the database, create a new user
  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        id: user.id,
        firstName: user.given_name ?? "",
        lastName: user.family_name ?? "",
        email: user.email ?? "",
        profileImage:
          user.picture ?? `https://avatar.vercel.sh/${user.given_name}`,
      },
    });
  }

  // Redirect to the dashboard
  //for flux.io.vercel.app
  return NextResponse.redirect(
    process.env.NODE_ENV === "production"
      ? "https://flux-io.vercel.app/dashboard"
      : "http://localhost:3000/dashboard"
  );
}
//better to use a redirect than a json response