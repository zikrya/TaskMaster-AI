import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    // Get the authenticated user
    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Parse the request body
    const { name, description } = await request.json();

    // Find the User record in the database using the clerkId
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!dbUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create the project and associate it with the user
    const project = await prisma.project.create({
      data: {
        name,
        description,
        user: { connect: { id: dbUser.id } }, // Associate project with the user from the database
      },
    });

    return NextResponse.json(project, {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { message: "Error creating project" },
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}