import { NextResponse } from 'next/server';
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "@/app/utils/db";

export async function GET() {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.email) {
      return NextResponse.json({ error: "User not authenticated or email not available" }, { status: 401 });
    }

    const email = user.email;

    let dbUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true, firstName: true, lastName: true, subscription: true }
    });

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: { 
          email, 
          id: user.id,
          firstName: user.given_name ?? '',
          lastName: user.family_name ?? ''
        },
        select: { id: true, firstName: true, lastName: true, subscription: true }
      });
    } else if (dbUser.id !== user.id) {
      await prisma.user.update({
        where: { email },
        data: { id: user.id }
      });
    }

    const userId = dbUser.id;
    const hasUserCancelled = dbUser.subscription?.status === 'canceled';

    const isProPlan = dbUser.subscription?.planId === 'pro';
    const isBasicPlan = dbUser.subscription?.planId === 'basic';
    const planTypeName = isProPlan ? 'Pro' : isBasicPlan ? 'Basic' : 'Starter';

    const postsCount = await prisma.post.count({
      where: { userId }
    });

    const isValidBasicPlan = isBasicPlan && postsCount < 3;

    return NextResponse.json({
      email,
      userId,
      hasUserCancelled,
      isProPlan,
      isBasicPlan,
      planTypeName,
      isValidBasicPlan
    });
  } catch (error) {
    console.error('Error in user-data API route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
