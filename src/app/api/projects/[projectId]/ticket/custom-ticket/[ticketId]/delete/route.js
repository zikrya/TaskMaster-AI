import { prisma } from "../../../../../../../../server/db";
import { currentUser } from "@clerk/nextjs/server";

export async function DELETE(req, { params }) {
    const { projectId, ticketId } = params;
    const user = await currentUser();

    if (!projectId || !ticketId) {
        return new Response(JSON.stringify({ message: 'Project ID and Ticket ID are required' }), {
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
        const customTicket = await prisma.customTicket.findUnique({
            where: {
                id: parseInt(ticketId, 10),
            },
        });

        if (!customTicket || customTicket.projectId !== parseInt(projectId, 10)) {
            return new Response(JSON.stringify({ message: 'Ticket not found in this project' }), {
                headers: { 'Content-Type': 'application/json' },
                status: 404,
            });
        }

        await prisma.customTicket.delete({
            where: { id: parseInt(ticketId, 10) },
        });

        return new Response(JSON.stringify({ message: 'Custom ticket deleted successfully' }), {
            headers: { 'Content-Type': 'application/json' },
            status: 200,
        });
    } catch (error) {
        console.error("Error deleting custom ticket:", error);
        return new Response(JSON.stringify({ message: 'Failed to delete custom ticket' }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500,
        });
    }
}
