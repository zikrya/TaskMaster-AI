import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req, { params }) {
    const { projectId, ticketId } = params;
    let currentDescription;

    try {
        const body = await req.json();
        currentDescription = body.currentDescription;
    } catch (error) {
        console.error("Error parsing JSON from request:", error);
        return new Response(JSON.stringify({ message: "Bad request, JSON parsing failed" }), {
            headers: { 'Content-Type': 'application/json' },
            status: 400
        });
    }

    if (!currentDescription) {
        return new Response(JSON.stringify({ message: "Missing current description in the request" }), {
            headers: { 'Content-Type': 'application/json' },
            status: 400
        });
    }

    try {
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4-turbo",
                messages: [{ role: "user", content: `Continue the following description for the development task: ${currentDescription}` }],
                max_tokens: 150,
                temperature: 0.5
            })
        });

        const data = await res.json();

        if (!res.ok) {
            console.error("API call to OpenAI failed:", data);
            return new Response(JSON.stringify({ message: data.error.message || "API Error" }), {
                headers: { 'Content-Type': 'application/json' },
                status: res.status
            });
        }

        const newDescription = data.choices[0]?.message?.content?.trim() || "No additional description generated.";

        // Update the ticket with the new description part
        const updatedTicket = await prisma.chatResponse.update({
            where: { id: parseInt(ticketId, 10) },
            data: { description: `${currentDescription} ${newDescription}` },
        });

        return new Response(JSON.stringify({ message: "Description continued", description: newDescription }), {
            headers: { 'Content-Type': 'application/json' },
            status: 200
        });
    } catch (error) {
        console.error("Error processing the chat completion or database operation:", error);
        return new Response(JSON.stringify({ message: "Server error" }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500
        });
    }
}
