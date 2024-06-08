import { PrismaClient } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  const { projectId } = params;
  const user = await currentUser();

  if (!projectId) {
    return new Response(JSON.stringify({ message: 'Project ID is required' }), {
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
    const project = await prisma.project.findUnique({
      where: {
        id: parseInt(projectId, 10),
      },
      include: {
        chatResponses: true,
        user: true,
      },
    });

    if (!project) {
      return new Response(JSON.stringify({ message: 'Project not found' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 404,
      });
    }

    // Log the IDs for troubleshooting
    console.log('Project User Clerk ID:', project.user.clerkId);
    console.log('Current User Clerk ID:', user.id);

    // Check if the current user is the owner of the project
    if (project.user.clerkId !== user.id) {
      return new Response(JSON.stringify({ message: 'Forbidden' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 403,
      });
    }

    return new Response(JSON.stringify(project), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching project:", error);
    return new Response(JSON.stringify({ message: 'Failed to retrieve project' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}
