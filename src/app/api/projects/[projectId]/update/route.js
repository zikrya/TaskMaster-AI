import { prisma } from "../../../../../server/db";
import { currentUser } from "@clerk/nextjs/server";

export async function PUT(request, { params }) {
    const { projectId } = params;
    const user = await currentUser();
    const { name, description } = await request.json();

    if (!user) {
        return new Response(JSON.stringify({ message: "Unauthorized" }), {
            headers: { "Content-Type": "application/json" },
            status: 401,
        });
    }

    try {
        const project = await prisma.project.findUnique({
            where: { id: parseInt(projectId, 10) },
            include: { user: true },
        });

        if (!project || project.user.clerkId !== user.id) {
            return new Response(JSON.stringify({ message: "Forbidden" }), {
                headers: { "Content-Type": "application/json" },
                status: 403,
            });
        }

        const updatedProject = await prisma.project.update({
            where: { id: project.id },
            data: { name, description },
        });

        return new Response(JSON.stringify(updatedProject), {
            headers: { "Content-Type": "application/json" },
            status: 200,
        });
    } catch (error) {
        console.error("Error updating project:", error);
        return new Response(JSON.stringify({ message: "Failed to update project" }), {
            headers: { "Content-Type": "application/json" },
            status: 500,
        });
    }
}
