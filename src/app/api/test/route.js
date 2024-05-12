import { supabase } from "@/lib/supabaseClient";

export async function GET() {
    console.log("Fetching data from Supabase");
    const { data, error } = await supabase
        .from('Test')
        .select('*');
    console.log("Data:", data, "Error:", error);

    if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500
        });
    } else {
        return new Response(JSON.stringify(data), {
            headers: { 'Content-Type': 'application/json' },
            status: 200
        });
    }
}