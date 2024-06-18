import { prisma } from "../../../server/db";
import { currentUser } from "@clerk/nextjs/server";

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
        });

        if (!dbUser) {
            return new Response(JSON.stringify({ message: "User not found" }), {
                headers: { 'Content-Type': 'application/json' },
                status: 404,
            });
        }

        // Fetch notifications using the internal user ID
        const notifications = await prisma.notification.findMany({
            where: {
                userId: dbUser.id,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return new Response(JSON.stringify(notifications), {
            headers: { 'Content-Type': 'application/json' },
            status: 200,
        });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return new Response(JSON.stringify({ message: "Failed to retrieve notifications" }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500,
        });
    }
}
