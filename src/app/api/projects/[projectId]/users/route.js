import { prisma } from "../../../../../server/db";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(req, { params }) {
    const { projectId } = params;
    const user = await currentUser();

    if (!user) {
        return new Response(JSON.stringify({ message: "Unauthorized" }), {
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
                user: true, // Owner of the project
                sharedWith: {
                    include: {
                        user: true, // Users with whom the project is shared
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

        // Gather the users involved in the project
        const users = [project.user, ...project.sharedWith.map(shared => shared.user)];

        return new Response(JSON.stringify(users), {
            headers: { 'Content-Type': 'application/json' },
            status: 200,
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        return new Response(JSON.stringify({ message: "Failed to retrieve users" }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500,
        });
    }
}
