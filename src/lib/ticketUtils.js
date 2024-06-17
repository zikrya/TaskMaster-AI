import { prisma } from "../server/db";
import { currentUser } from '@clerk/nextjs/server';

export async function getTicket(projectId, ticketId, type) {
    const whereClause = type === 'generated' ? { id: parseInt(ticketId, 10), projectId: parseInt(projectId, 10) } : { id: parseInt(ticketId, 10), projectId: parseInt(projectId, 10) };

    const ticket = type === 'generated'
        ? await prisma.chatResponse.findUnique({
            where: { id: whereClause.id }
        })
        : await prisma.customTicket.findUnique({
            where: { id: whereClause.id }
        });

    return ticket;
}

export async function updateTicketStatus(ticketId, newStatus, type) {
    const updatedTicket = type === 'generated'
        ? await prisma.chatResponse.update({
            where: { id: parseInt(ticketId, 10) },
            data: { status: newStatus }
        })
        : await prisma.customTicket.update({
            where: { id: parseInt(ticketId, 10) },
            data: { status: newStatus }
        });

    return updatedTicket;
}

export async function getComments(ticketId, type) {
    const whereClause = type === 'generated' ? { chatResponseId: parseInt(ticketId, 10) } : { customTicketId: parseInt(ticketId, 10) };

    const comments = await prisma.comment.findMany({
        where: whereClause,
        include: { user: true }
    });

    return comments;
}

export async function addComment(ticketId, content, user, type) {
    const dbUser = await prisma.user.findUnique({
        where: { clerkId: user.id },
    });

    if (!dbUser) {
        throw new Error('User not found');
    }

    const data = type === 'generated'
        ? { content, userId: dbUser.id, chatResponseId: parseInt(ticketId, 10) }
        : { content, userId: dbUser.id, customTicketId: parseInt(ticketId, 10) };

    const comment = await prisma.comment.create({
        data,
        include: { user: true }
    });

    return comment;
}

export async function assignTicket(ticketId, assigneeId, type) {
    const updatedTicket = type === 'generated'
        ? await prisma.chatResponse.update({
            where: { id: parseInt(ticketId, 10) },
            data: { assigneeId }
        })
        : await prisma.customTicket.update({
            where: { id: parseInt(ticketId, 10) },
            data: { assigneeId }
        });

    return updatedTicket;
}