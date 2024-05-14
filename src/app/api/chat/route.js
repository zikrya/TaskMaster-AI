

export const runtime = "edge";

export async function POST(req) {
    let content;
    try {
        const body = await req.json();
        content = body.content;
    } catch (error) {
        console.error("Error parsing JSON from request:", error);
        return new Response(JSON.stringify({ message: "Bad request, JSON parsing failed" }), {
            headers: { 'Content-Type': 'application/json' },
            status: 400
        });
    }

    // Validate content
    if (!content) {
        return new Response(JSON.stringify({ message: "Missing content in the request" }), {
            headers: { 'Content-Type': 'application/json' },
            status: 400
        });
    }

    content = `I'm creating a software development project and I need you to break down the project using scrum and agile methodology to into smaller workable pieces with how the flow should be as in every step of development, and structure in terms of coding it. Tell me the tech stack you recommend using, and how to flow of development should be. The project is ${content}`
    const messages = [{
        role: "user",
        content: content
    }];

    try {
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4-turbo-preview",
                messages: messages,
                max_tokens: 150,
                temperature: 0.5
            })
        });

        const data = await res.json();

        if (res.ok) {
            const output = data.choices[0]?.message?.content?.trim() || "No response generated.";
            return new Response(JSON.stringify({ message: output }), {
                headers: { 'Content-Type': 'application/json' },
                status: 200
            });
        } else {
            console.error("API call to OpenAI failed:", data);
            return new Response(JSON.stringify({ message: data.error.message || "API Error" }), {
                headers: { 'Content-Type': 'application/json' },
                status: res.status
            });
        }
    } catch ( error ) {
        console.error("Error processing the chat completion:", error);
        return new Response(JSON.stringify({ message: "Server error" }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500
        });
    }
}
