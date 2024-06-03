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
                messages: [{ role: "user", content: `You're a Tech Project manager, an expert in scrum and agile. You'll split up this ${content} into jira tickets for the first story. No descriptions just what you would label the tickets. Only the tech, development tasks, nothing about what to do before developing. Also no intro or anything just skip straight into making the tickets.`}],
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

        // Extract and clean the tasks
        const tasks = data.choices[0]?.message?.content?.trim().split('\n').map(task => task.trim()).filter(task => task) || [];

        // Save the responses to the database
        const chatResponses = await prisma.chatResponse.createMany({
            data: tasks.map((task) => ({
                request: content,
                response: task,
                projectId: parseInt(projectId, 10),
                status: "To Do" // Set the default status to "To Do"
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
