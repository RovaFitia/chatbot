import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters"

export const textsplitters = new RecursiveCharacterTextSplitter({
    chunkSize: 150,
    chunkOverlap: 20,
})

export async function chunckContent(content: string) {
    return await textsplitters.splitText(content.trim())
}