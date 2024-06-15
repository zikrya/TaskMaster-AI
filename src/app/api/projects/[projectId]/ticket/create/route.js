// api/projects/[projectId]/ticket/create/route.js (personal tickets)
import { PrismaClient } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function POST(req, { params }) {
  const { projectId } = params;
  const { title, description } = await req.json();
  const user = await currentUser();

  if (!title || !description || !projectId) {
    return new Response(JSON.stringify({ message: 'Title, description, and project ID are required' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    });
  }

  if (!user) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 401,
    });
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!existingUser) {
      return new Response(JSON.stringify({ message: 'User not found' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 404,
      });
    }

    const newTicket = await prisma.customTicket.create({
      data: {
        title,
        description,
        projectId: parseInt(projectId, 10),
        userId: existingUser.id,
        status: "To Do" // Ensure the status is set to "To Do"
      },
    });

    return new Response(JSON.stringify(newTicket), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error("Error creating ticket:", error);
    return new Response(JSON.stringify({ message: 'Failed to create ticket' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}
