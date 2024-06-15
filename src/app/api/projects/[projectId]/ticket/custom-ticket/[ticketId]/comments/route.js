import { PrismaClient } from '@prisma/client';
import { currentUser } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

export async function GET(req, { params }) {
    const { projectId, ticketId } = params;

    try {
        const comments = await prisma.comment.findMany({
            where: {
                customTicketId: parseInt(ticketId, 10)
            },
            include: {
                user: true // Ensure user data is included
            }
        });

        return new Response(JSON.stringify(comments), {
            headers: { 'Content-Type': 'application/json' },
            status: 200
        });
    } catch (error) {
        console.error('Error fetching comments:', error);
        return new Response(JSON.stringify({ message: 'Failed to retrieve comments' }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500
        });
    }
}

export async function POST(req, { params }) {
    const { projectId, ticketId } = params;
    const user = await currentUser();

    if (!user) {
        return new Response(JSON.stringify({ message: 'Unauthorized' }), {
            headers: { 'Content-Type': 'application/json' },
            status: 401
        });
    }

    const { content } = await req.json();

    try {
        const dbUser = await prisma.user.findUnique({
            where: { clerkId: user.id },
        });

        if (!dbUser) {
            return new Response(JSON.stringify({ message: 'User not found' }), {
                headers: { 'Content-Type': 'application/json' },
                status: 404
            });
        }

        const comment = await prisma.comment.create({
            data: {
                content,
                userId: dbUser.id,
                customTicketId: parseInt(ticketId, 10) // Use customTicketId instead of chatResponseId
            },
            include: {
                user: true // Include the user in the response
            }
        });

        return new Response(JSON.stringify(comment), {
            headers: { 'Content-Type': 'application/json' },
            status: 201
        });
    } catch (error) {
        console.error('Error creating comment:', error);
        return new Response(JSON.stringify({ message: 'Failed to create comment' }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500
        });
    }
}
