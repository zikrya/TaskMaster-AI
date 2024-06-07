import { NextResponse } from "next/server";
import { currentUser, auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const authResult = auth();
  const userId = authResult.userId;
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  // Get user's information
  const user = await currentUser();
  if (!user) {
    return new NextResponse('User not exist', { status: 404 });
  }

  let dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
  });

  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        clerkId: user.id,
        name: user.firstName ?? '',
        lastName: user.lastName ?? '',
        email: user.emailAddresses[0].emailAddress ?? '',
        username: user.username ?? '', // Ensure username is added here
      },
    });
  } else {
    dbUser = await prisma.user.update({
      where: { clerkId: user.id },
      data: {
        name: user.firstName ?? '',
        lastName: user.lastName ?? '',
        email: user.emailAddresses[0].emailAddress ?? '',
        username: user.username ?? '', // Ensure username is updated here
      },
    });
  }

  return new NextResponse(null, {
    status: 302, // 302 Found - temporary redirect
    headers: {
      Location: 'http://localhost:3000/projects',
    },
  });
}
