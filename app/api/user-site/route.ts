import { NextResponse } from 'next/server';
import prisma from '@/app/utils/db';

export async function POST(request: Request) {
  const { userId } = await request.json();

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    // Try to find an existing site for the user
    let site = await prisma.site.findFirst({
      where: { userId: userId },
    });

    // If no site exists, create a default one
    if (!site) {
      site = await prisma.site.create({
        data: {
          name: 'Default Site',
          description: 'This is your default site',
          subdirectory: `user-${userId}-default`,
          userId: userId,
        },
      });
    }

    if (!site || !site.id) {
      throw new Error('Failed to fetch or create a site');
    }

    return NextResponse.json(site);
  } catch (error) {
    console.error('Error fetching or creating user site:', error);
    return NextResponse.json({ error: 'Failed to fetch or create user site' }, { status: 500 });
  }
}
