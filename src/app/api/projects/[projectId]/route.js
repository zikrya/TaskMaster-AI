import { prisma } from "../../../../server/db";
import { currentUser } from "@clerk/nextjs/server";

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
        customTickets: true,
        user: true,
        sharedWith: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!project) {
      return new Response(JSON.stringify({ message: 'Project not found' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 404,
      });
    }

    const isOwner = project.user.clerkId === user.id;
    const isSharedUser = project.sharedWith.some(shared => shared.user.clerkId === user.id);

    if (!isOwner && !isSharedUser) {
      return new Response(JSON.stringify({ message: 'Forbidden' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 403,
      });
    }

    const allUsers = [
      { ...project.user, role: 'Owner' },
      ...project.sharedWith.map(shared => ({ ...shared.user, role: 'Contributor' })),
    ];

    return new Response(JSON.stringify({ project, allUsers }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Failed to retrieve project' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}
