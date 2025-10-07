"use server"

import  {pdf } from "pdf-parse"
import { db } from "@/lib/db-config"
import { documents } from "@/lib/db-schema"
import { generateEmbeddings } from "@/lib/embeddings"
import { chunckContent } from "@/lib/chucking"
import { success } from "zod/v4"

export async function processPdfFile(formData: FormData) {
    try {
        const file = formData.get("file") as File
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const data = await pdf(buffer)

        if(!data.text || data.text.trim().length === 0) {
            return {
                success: false,
                error: "No text found in the PDF file."
            }
        }

        const chunks = await chunckContent(data.text)
        const embeddings = await generateEmbeddings(chunks)

        const records = chunks.map((chunk, index) => ({
            content: chunk,
            embedding: embeddings[index],
        }))

        await db.insert(documents).values(records)

        return {
            success: true,
            message: `Created ${records.length} searchable chunks`
        }
    }
    catch (error) {
        console.log("Error processing PDF file:", error)
        return {
            success: false,
            message: "Failed to process PDF file."
        }
    }
}