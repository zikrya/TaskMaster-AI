export async function GET() {
    return new Response(JSON.stringify({ message: "Hello, Next.js" }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200
    });
}

export async function POST() {
    return new Response(JSON.stringify({ message: "POST request received" }), {
        headers: { 'Content-Type': 'application/json' },
        status: 201
    });
}