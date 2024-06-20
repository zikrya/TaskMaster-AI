import { assignTicket } from '../../../../../../../lib/ticketUtils';
import { prisma } from '../../../../../../../server/db';

export async function PUT(req, { params }) {
    const { projectId, ticketId } = params;
    let assigneeId;

    try {
        const body = await req.json();
        assigneeId = body.assigneeId;
    } catch (error) {
        console.error("Error parsing JSON from request:", error);
        return new Response(JSON.stringify({ message: "Bad request, JSON parsing failed" }), {
            headers: { 'Content-Type': 'application/json' },
            status: 400
        });
    }

    // Allow setting assigneeId to null for "Unassigned"
    if (assigneeId === '') {
        assigneeId = null;
    }

    try {
        const updatedTicket = await assignTicket(ticketId, assigneeId, 'generated');

        if (assigneeId) {
            // Create notification
            await prisma.notification.create({
                data: {
                    userId: assigneeId,
                    message: `You have been assigned a new ticket: "${updatedTicket.response}"`,
                    url: `/project/${projectId}/ticket/${ticketId}`
                },
            });

            console.log('Notification created for user:', assigneeId);
        }

        return new Response(JSON.stringify(updatedTicket), {
            headers: { 'Content-Type': 'application/json' },
            status: 200
        });
    } catch (error) {
        console.error("Error updating ticket assignee:", error);
        return new Response(JSON.stringify({ message: "Server error" }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500
        });
    }
}