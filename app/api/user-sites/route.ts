import { NextResponse } from 'next/server';
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from '@/app/utils/db';

export async function GET() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) {
    return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
  }

  try {
    const sites = await prisma.site.findMany({
      where: { userId: user.id },
      select: { id: true, name: true },
    });

    return NextResponse.json(sites);
  } catch (error) {
    console.error('Error fetching user sites:', error);
    return NextResponse.json({ error: 'Failed to fetch user sites' }, { status: 500 });
  }
}
