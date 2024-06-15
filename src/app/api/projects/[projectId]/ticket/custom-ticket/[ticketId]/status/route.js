import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req, { params }) {
    const { projectId, ticketId } = params;
    let newStatus;

    try {
        const body = await req.json();
        newStatus = body.status;
    } catch (error) {
        console.error("Error parsing JSON from request:", error);
        return new Response(JSON.stringify({ message: "Bad request, JSON parsing failed" }), {
            headers: { 'Content-Type': 'application/json' },
            status: 400
        });
    }

    if (!newStatus) {
        return new Response(JSON.stringify({ message: "Missing status in the request" }), {
            headers: { 'Content-Type': 'application/json' },
            status: 400
        });
    }

    try {
        const updatedTicket = await prisma.customTicket.update({
            where: { id: parseInt(ticketId, 10) },
            data: { status: newStatus }
        });

        return new Response(JSON.stringify(updatedTicket), {
            headers: { 'Content-Type': 'application/json' },
            status: 200
        });
    } catch (error) {
        console.error("Error updating ticket status:", error);
        return new Response(JSON.stringify({ message: "Server error" }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500
        });
    }
}