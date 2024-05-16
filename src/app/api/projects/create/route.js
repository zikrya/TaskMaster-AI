import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { name, description } = await request.json();

    const project = await prisma.project.create({
      data: {
        name,
        description,
      },
    });

    return NextResponse.json(project, {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { message: "Error creating project" },
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}