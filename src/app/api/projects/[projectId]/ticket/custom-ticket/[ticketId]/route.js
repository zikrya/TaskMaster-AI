import { prisma } from "../../../../../../../server/db";

export async function GET(req, { params }) {
    const { projectId, ticketId } = params;

    if (!projectId || !ticketId) {
        return new Response(JSON.stringify({ message: 'Project ID and Ticket ID are required' }), {
            headers: { 'Content-Type': 'application/json' },
            status: 400,
        });
    }

    try {
        const ticket = await prisma.customTicket.findUnique({
            where: {
                id: parseInt(ticketId, 10),
            },
        });

        if (!ticket || ticket.projectId !== parseInt(projectId, 10)) {
            return new Response(JSON.stringify({ message: 'Ticket not found' }), {
                headers: { 'Content-Type': 'application/json' },
                status: 404,
            });
        }

        return new Response(JSON.stringify(ticket), {
            headers: { 'Content-Type': 'application/json' },
            status: 200,
        });
    } catch (error) {
        console.error("Error fetching ticket:", error);
        return new Response(JSON.stringify({ message: 'Failed to retrieve ticket' }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500,
        });
    }
}

export async function PUT(req, { params }) {
    const { projectId, ticketId } = params;
    const { title, description } = await req.json();

    if (!projectId || !ticketId) {
        return new Response(JSON.stringify({ message: 'Project ID and Ticket ID are required' }), {
            headers: { 'Content-Type': 'application/json' },
            status: 400,
        });
    }

    if (!title || !description) {
        return new Response(JSON.stringify({ message: 'Title and description are required' }), {
            headers: { 'Content-Type': 'application/json' },
            status: 400,
        });
    }

    try {
        const updatedTicket = await prisma.customTicket.update({
            where: {
                id: parseInt(ticketId, 10),
            },
            data: {
                title,
                description,
            },
        });

        return new Response(JSON.stringify(updatedTicket), {
            headers: { 'Content-Type': 'application/json' },
            status: 200,
        });
    } catch (error) {
        console.error("Error updating ticket:", error);
        return new Response(JSON.stringify({ message: 'Failed to update ticket' }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500,
        });
    }
}
