import { PrismaClient } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function POST(req, { params }) {
  const { projectId } = params;
  const user = await currentUser();
  let { title, description } = await req.json();

  if (!user) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      headers: { "Content-Type": "application/json" },
      status: 401,
    });
  }

  if (!title || !description) {
    return new Response(JSON.stringify({ message: "Title and description are required" }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    });
  }

  try {
    const newTicket = await prisma.chatResponse.create({
      data: {
        request: title, // Title of the ticket
        description: description, // User-provided description
        response: description, // For simplicity, we'll save the same description in response; you can adjust if needed
        projectId: parseInt(projectId, 10),
        status: "To Do",
        isAIGenerated: false,
      },
    });

    return new Response(JSON.stringify(newTicket), {
      headers: { "Content-Type": "application/json" },
      status: 201,
    });
  } catch (error) {
    console.error("Error creating ticket:", error);
    return new Response(JSON.stringify({ message: "Failed to create ticket" }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
}

