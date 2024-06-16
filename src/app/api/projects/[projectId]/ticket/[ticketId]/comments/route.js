import { getComments, addComment } from '../../../../../../../lib/ticketUtils'
import { currentUser } from '@clerk/nextjs/server';

export async function GET(req, { params }) {
    const { projectId, ticketId } = params;

    try {
        const comments = await getComments(ticketId, 'generated');
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
        const comment = await addComment(ticketId, content, user, 'generated');
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