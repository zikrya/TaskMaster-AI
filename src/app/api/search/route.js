import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');

    if (!query) {
        return new Response(JSON.stringify({ message: 'Query is required' }), {
            headers: { 'Content-Type': 'application/json' },
            status: 400,
        });
    }

    try {
        const users = await prisma.user.findMany({
            where: {
                OR: [
                    { username: { contains: query, mode: 'insensitive' } },
                    { email: { contains: query, mode: 'insensitive' } },
                ],
            },
        });

        return new Response(JSON.stringify(users), {
            headers: { 'Content-Type': 'application/json' },
            status: 200,
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        return new Response(JSON.stringify({ message: 'Failed to retrieve users' }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500,
        });
    }
}
