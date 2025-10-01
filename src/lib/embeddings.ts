import { embed, embedMany } from "ai";
import { groq } from "@ai-sdk/groq";

export async function generateEmbedding(text: string) {
    const input = text.replace("\n", " ");

    const { embedding } = await embed({
        model: groq.textEmbeddingModel("text-embedding-3-small"),
        value: input,
    })

    return embedding;
}

export async function generateEmbeddings(texts: string[]) {
    const inputs = texts.map((text) => text.replace("\n", " "));

    const { embeddings } = await embedMany({
        model: groq.textEmbeddingModel("text-embedding-3-small"),
        values: inputs,
    })

    return embeddings;
}