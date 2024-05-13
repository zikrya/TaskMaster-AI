

export const runtime = "edge";

export async function POST(req) {
    let content;
    try {
        const body = await req.json();
        content = body.content;  // Expecting a single piece of content directly in the body
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

    // Prepare the message for the API
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
