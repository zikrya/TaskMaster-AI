import { prisma } from "../../../../../../server/db";
import { currentUser } from "@clerk/nextjs/server";

export async function DELETE(request, { params }) {
    const { projectId, userId } = params;
    const user = await currentUser();

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

        await prisma.sharedProject.deleteMany({
            where: {
                projectId: project.id,
                userId: userId,
            },
        });

        return new Response(JSON.stringify({ message: "User removed from project" }), {
            headers: { "Content-Type": "application/json" },
            status: 200,
        });
    } catch (error) {
        console.error("Error removing user from project:", error);
        return new Response(JSON.stringify({ message: "Failed to remove user from project" }), {
            headers: { "Content-Type": "application/json" },
            status: 500,
        });
    }
}
