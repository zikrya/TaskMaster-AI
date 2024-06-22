import { prisma } from "../../../../../server/db";
import { currentUser } from "@clerk/nextjs/server";

export async function PUT(req, { params }) {
    const { id } = params;
    const user = await currentUser();

    if (!user) {
        return new Response(JSON.stringify({ message: "Unauthorized" }), {
            headers: { 'Content-Type': 'application/json' },
            status: 401,
        });
    }

    try {
        const notification = await prisma.notification.update({
            where: { id: parseInt(id, 10) },
            data: { read: true },
        });

        return new Response(JSON.stringify(notification), {
            headers: { 'Content-Type': 'application/json' },
            status: 200,
        });
    } catch (error) {
        console.error("Error marking notification as read:", error);
        return new Response(JSON.stringify({ message: "Failed to update notification" }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500,
        });
    }
}
