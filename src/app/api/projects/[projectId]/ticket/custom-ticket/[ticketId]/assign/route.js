import { assignTicket } from '../../../../../../../../lib/ticketUtils';
import { prisma } from '../../../../../../../../server/db';
import pusher from '../../../../../../../../server/pusher';


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

    if (assigneeId === '') {
        assigneeId = null;
    }

    try {
        const updatedTicket = await assignTicket(ticketId, assigneeId, 'custom');

        if (assigneeId) {
            await prisma.notification.create({
                data: {
                    userId: assigneeId,
                    message: `You have been assigned a new custom ticket: "${updatedTicket.title}"`,
                    url: `/project/${projectId}/ticket/custom-ticket/${ticketId}`
                },
            });

            // Trigger Pusher event
            pusher.trigger('project-channel', 'custom-ticket-assigned', {
                projectId,
                ticketId,
                assigneeId,
                ticket: updatedTicket
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