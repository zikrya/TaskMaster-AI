import { PrismaClient } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function GET() {
    const user = await currentUser();

    if (!user) {
        return new Response(JSON.stringify({ message: "Unauthorized" }), {
            headers: { 'Content-Type': 'application/json' },
            status: 401,
        });
    }

    try {
        // Find the User record in the database using the clerkId
        const dbUser = await prisma.user.findUnique({
            where: { clerkId: user.id },
            include: { projects: true },
        });

        if (!dbUser) {
            return new Response(JSON.stringify({ message: "User not found" }), {
                headers: { 'Content-Type': 'application/json' },
                status: 404,
            });
        }

        return new Response(JSON.stringify(dbUser.projects), {
            headers: { 'Content-Type': 'application/json' },
            status: 200,
        });
    } catch (error) {
        console.error("Error fetching user projects:", error);
        return new Response(JSON.stringify({ message: "Failed to retrieve projects" }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500,
        });
    }
}
