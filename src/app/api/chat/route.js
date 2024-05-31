import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
    let content, projectId;
    try {
        const body = await req.json();
        content = body.content;
        projectId = body.projectId;
    } catch (error) {
        console.error("Error parsing JSON from request:", error);
        return new Response(JSON.stringify({ message: "Bad request, JSON parsing failed" }), {
            headers: { 'Content-Type': 'application/json' },
            status: 400
        });
    }

    if (!content || !projectId) {
        return new Response(JSON.stringify({ message: "Missing content or project ID in the request" }), {
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
                model: "gpt-4-turbo-preview",
                messages: [{ role: "user", content: `give me a list of 5 ${content} frameworks, please just the framework no other content` }],
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

        // Extract and clean the frameworks
        const frameworks = data.choices[0]?.message?.content?.trim().split('\n').map(f => f.trim()).filter(f => f) || [];

        // Save the responses to the database
        const chatResponses = await prisma.chatResponse.createMany({
            data: frameworks.map((framework) => ({
                request: content,
                response: framework,
                projectId: parseInt(projectId, 10)
            })),
            skipDuplicates: true,
        });

        // Fetch the IDs of the created responses
        const createdResponses = await prisma.chatResponse.findMany({
            where: { projectId: parseInt(projectId, 10), request: content }
        });

        return new Response(JSON.stringify({ message: "Responses created", responses: createdResponses }), {
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
