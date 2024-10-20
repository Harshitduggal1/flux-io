import { NextResponse } from 'next/server';
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from '@/app/utils/db';

export async function GET() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Fetch the user's current site (you'll need to adjust this logic based on your data model)
    const site = await prisma.site.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    });

    if (!site) {
      return NextResponse.json({ error: 'No site found for user' }, { status: 404 });
    }

    return NextResponse.json({ siteId: site.id });
  } catch (error) {
    console.error('Error fetching current site:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}