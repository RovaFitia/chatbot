"use client"
import { useState, Fragment } from 'react';
import { useChat} from "@ai-sdk/react"

import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInputBody,
  PromptInputButton,
  type PromptInputMessage,
  PromptInputModelSelect,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from '@/components/ai-elements/prompt-input';

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';

import { Message, MessageContent } from '@/components/ai-elements/message';
import { Response } from '@/components/ai-elements/response';

import { Loader } from '@/components/ai-elements/loader';

const RAGChatBot = () => {

    const [input, setInput] = useState("")
    const { messages, sendMessage, status } = useChat({
        onError: (err) => {
            console.error('Chat error:', err);
        }
    })

    const handleSubmit = (message: PromptInputMessage) => {
        if(!message.text) return
        sendMessage({text: message.text})
        setInput("")
    }
 
    return (
        <div className='max-w-4xl mx-auto p-6 relative size-full h-[calc(100vh-4rem)]'>
            <div className="flex flex-col h-full">
                <Conversation className="h-full">
                    <ConversationContent>
                        {
                            messages.map((message) => (
                                <div key={message.id}>
                                    {message.parts.map((part, i) => {
                                        switch(part.type) {
                                            case "text" :
                                                return <Fragment key={`${message.id}-${i}`}>
                                                    <Message from={message.role}>
                                                        <MessageContent>
                                                            <Response>{part.text}</Response>
                                                        </MessageContent>
                                                    </Message>
                                                </Fragment>

                                            default:
                                                return null
                                        }
                                    } )}
                                </div>
                            ))
                        }
                    
                        {(status === "submitted" || status === "streaming") && <Loader />}
                    </ConversationContent>
                    <ConversationScrollButton/>
                </Conversation>

                <PromptInput className="mt-4" onSubmit={handleSubmit} >
                    <PromptInputBody>
                        <PromptInputTextarea placeholder="Type your message..." value={input} onChange={(e)=> setInput(e.target.value)} />
                    </PromptInputBody>
                    <PromptInputToolbar>
                        <PromptInputTools>
                            {/* Model selector, web search etc */}
                        </PromptInputTools>
                        <PromptInputSubmit />
                    </PromptInputToolbar>
                </PromptInput>
            </div>
        </div>
    );
}

export default RAGChatBot;
