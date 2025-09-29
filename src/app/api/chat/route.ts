import { streamText, UIMessage, convertToModelMessages } from "ai";
import { groq } from "@ai-sdk/groq";

export async function POST(req : Request) {
    console.log('🔵 Route /api/chat called');
    console.log('🔑 GROQ_API_KEY exists:', !!process.env.GROQ_API_KEY)
    try {
        const { messages }: {messages: UIMessage[]} = await req.json();

        console.log('Received messages:', messages);

        const result = streamText({
            model: groq("llama-3.3-70b-versatile"),
            messages: convertToModelMessages(messages),
        })
    
        return result.toUIMessageStreamResponse();
    }
    catch (error) {
        console.error("Error streaming chat completion:", error);
        return new Response(
            JSON.stringify({ error: "Failed to stream chat completion" }), 
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}