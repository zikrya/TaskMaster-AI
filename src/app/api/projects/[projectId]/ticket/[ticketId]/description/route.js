import { prisma } from "../../../../../../../server/db";

export async function POST(req, { params }) {
    const { projectId, ticketId } = params;
    let projectDescription, ticketResponse;

    try {
        const body = await req.json();
        projectDescription = body.projectDescription;
        ticketResponse = body.ticketResponse;
    } catch (error) {
        console.error("Error parsing JSON from request:", error);
        return new Response(JSON.stringify({ message: "Bad request, JSON parsing failed" }), {
            headers: { 'Content-Type': 'application/json' },
            status: 400
        });
    }

    if (!projectDescription || !ticketResponse) {
        return new Response(JSON.stringify({ message: "Missing project description or ticket response in the request" }), {
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
                messages: [{ role: "user", content: `You're a project manager who is an expert in scrum and agile practices. For this [${ticketResponse}] you're going to give a description on what the developer needs to do for this project. The basis of this project is ${projectDescription}. Skip explaining the ticket title, and the object. Make it concise.` }],
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

        const description = data.choices[0]?.message?.content?.trim() || "No description generated.";

        // Update the ticket with the generated description
        await prisma.chatResponse.update({
            where: { id: parseInt(ticketId, 10) },
            data: { description },
        });

        return new Response(JSON.stringify({ message: "Description generated", description }), {
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
