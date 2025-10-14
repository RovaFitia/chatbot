"use client"

import { useState } from "react"
import { processPdfFile } from "./actions"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"


export default function PDFUpload() {

    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState<{
        type: "success" | "error",
        text: string
    } | null>(null)


    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if(!file) return 
        setIsLoading(true)
        setMessage(null)

        try {
            const formData = new FormData()
            formData.append("file", file)

            const result = await processPdfFile(formData)
            if(result.success) {
                setMessage({
                    type: "success",
                    text: result.message || "PDF processed successfully."
                })

                e.target.value = ""
            }

            else {
                setMessage({
                    type: "error",
                    text: result.error || "Failed to process PDF file."
                })
            }
        }
        catch (error) {
            setMessage({
                type: "error",
                text: "An error occured while processing the PDF file."
            })
        }
        finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">PDF Upload</h1>
                <Card className="mb-6">
                    <CardContent className="pt-6">
                        <div className="space-y-4">
                            <Label htmlFor="pdf-upload">Upload PDF file</Label>
                            <Input
                                id="pdf-upload"
                                type="file"
                                accept=".pdf"
                                onChange={handleFileUpload}
                                disabled={isLoading}
                                className="mt-2"
                            />

                        </div>
                        {
                            isLoading && (
                                <div className="flex items-center justify-center gap-2">
                                    <Loader2 className="w-5 h-5 animate-spin"></Loader2>
                                    <span className="text-muted-foreground">Processing PDF ...</span>
                                </div>
                            )
                        }

                        {
                            message && (
                                <Alert variant={message.type === "error" ? "destructive" : "default"} className="mt-4">
                                    <AlertTitle>
                                        {message.type === "error" ? "Error!" : "Success!"}
                                    </AlertTitle>
                                    <AlertDescription>{message.text}</AlertDescription>
                                </Alert>
                            )
                        }
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}