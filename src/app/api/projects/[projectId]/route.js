import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  const { projectId } = params;

  if (!projectId) {
    return new Response(JSON.stringify({ message: 'Project ID is required' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    });
  }

  try {
    const project = await prisma.project.findUnique({
      where: {
        id: parseInt(projectId, 10),
      },
      include: {
        chatResponses: true, // Include the related chatResponses
        user: true, // Include the user to fetch user-specific details if needed
      },
    });

    if (!project) {
      return new Response(JSON.stringify({ message: 'Project not found' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 404,
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
