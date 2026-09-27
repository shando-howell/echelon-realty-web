'use client';

import { useState } from 'react';
import Link from 'next/link';

type Message = {
    role: 'user' | 'ai';
    content: string;
    // eslint-disable-next-line
    properties?: any[]; // Holds the PostGIS data
}

interface AIChatProps {
    // eslint-disable-next-line
    onPropertiesFound?: (properties: any[]) => void;
}

export default function AIChatStream({ onPropertiesFound }: AIChatProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isStreaming, setIsStreaming] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isStreaming) return;

        // Add user message to UI immediately
        setMessages(prev => [...prev, { role: 'user', content: input }]);
        const currentPrompt = input;
        setInput('');
        setIsStreaming(true);

        // Create a placeholder for the AI's streaming response
        setMessages(prev => [...prev, { role: 'ai', content: '' }]);

        try {
            const res = await fetch('http://localhost:3000/api/ai/chat/stream', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: currentPrompt, history: messages }),
            });

            if (!res.body) throw new Error("No readable stream.");

            // Set up the stream reader and decoder
            const reader = res.body.getReader();
            const decoder = new TextDecoder('utf-8');

            let aiResponse = "";

            // Process the stream loop
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                // Decode the raw Uint8Array chunk into a string
                const chunk = decoder.decode(value, { stream: true });

                // A single chunk might contain multiple "data: {...}\n\n" lines
                const lines = chunk.split('\n\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const dataStr = line.substring(6); // Remove "data: "

                        if (dataStr === '[DONE]') break; // Stream complete

                        try {
                            const parsed = JSON.parse(dataStr);

                            if (parsed.type === "text" && parsed.token) {
                                aiResponse += parsed.token;

                                // Update the last message in the state with the appended token
                                setMessages(prev => {
                                    const newMessages = [...prev];
                                    newMessages[newMessages.length - 1].content = aiResponse;
                                    return newMessages;
                                });
                            }
                            else if (parsed.type === "ui_component" && parsed.component === "property_cards") {

                                let propertyData = parsed.data;

                                // If LangChain wrapped this in a ToolMessage, extract the actual content first.
                                if (propertyData?.id?.includes("ToolMessage")) {
                                    propertyData = propertyData.kwargs?.content || propertyData.content;
                                }

                                // Failsafe 1: If LangGraph double-stringified the JSON, parse it
                                if (typeof propertyData === 'string') {
                                    try {
                                        propertyData = JSON.parse(propertyData);
                                    } catch (e) {
                                        console.error("Failed to parse tool string ==> ", e);
                                    }
                                }

                                // Attach it only if it's an array
                                if (Array.isArray(propertyData)) {
                                    
                                    // If the parent gave us a function, fire it with the new data
                                    if (onPropertiesFound && propertyData.length > 0) {
                                        onPropertiesFound(propertyData);
                                    }

                                    setMessages(prev => {
                                        const newMessages = [...prev];
                                        newMessages[newMessages.length - 1].properties = propertyData;
                                        return newMessages;
                                    });
                                }
                                    
                            }                   
                        } catch (e) {
                            console.error("Error parsing stream chunk:", e);
                        }
                    }
                }
            }
        } catch (error) {
            console.error("Chat error:", error);
        } finally {
            setIsStreaming(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* The Chat Window */}
            {isOpen && (
                <div className="w-80 sm:w-96 bg-white rounded-2xl shadow-2xl overflow-hidden mb-4
                border border-gray-200 flex flex-col h-125 transition-all duration-300 origin-bottom-right">

                    {/* Header */}
                    <div className="bg-blue-600 text-white p-4 font-bold flex justify-between items-center
                    shadow-sm">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                            <span>AI Assistant</span>
                        </div>

                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white hover:text-gray-200 focus:outline-none"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={msg.role === 'user' ? 'text-right' : 'text-left'}>
                                {/* The Text Bubble */}
                                {msg.content && (
                                    <span className={`inline-block p-3 rounded-lg ${
                                        msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none shadow-md' : 'bg-white text-gray-800 rounded-bl-none shadow-sm border-gray-200'
                                    }`}>
                                        {msg.content}
                                    </span>
                                )}

                                {/* The Generative UI cards */}
                                {msg.properties && msg.properties.length > 0 && (
                                    <div className="mt-4 flex flex-col gap-4 overflow-x-auto pb-2 snap-x">
                                        {/* eslint-disable-next-line */}
                                        {msg.properties.map((prop: any) => (
                                            <div key={prop.id} className="min-w-65 bg-blue-200/50 border border-blue-200 rounded-xl
                                            overflow-hidden snap-center shrink-0">
                                                {/* Render images here */}
                                                <img className="h-32 w-full object-cover" src="/images/placeholder-property.jpg"/>

                                                <div className="p-4">
                                                    <h4 className="text-gray-800 font-bold text-lg">{prop.title}</h4>

                                                    <Link 
                                                        href={`/properties/${prop.id}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="block text-center mt-4 w-full py-2 bg-blue-600 hover:bg-blue-400 text-white font-bold
                                                        rounded-lg transition-colors"
                                                    >
                                                        View Details
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        {isStreaming && (
                            <div className="flex items-center">
                                <h1 className="animate-pulse text-gray-800 italic">
                                    Awaiting AI response...
                                </h1>
                            </div>
                        )}
                    </div>

                    {/* Input Form */}
                    <form onSubmit={handleSubmit} className="p-3 border-t bg-white flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask me to find properties..."
                            className="flex-1 p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2
                            focus:ring-blue-600"
                            disabled={isStreaming}
                        />
                        <button
                            type="submit"
                            disabled={isStreaming}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-400
                            disabled:opacity-50"
                        >
                            Send
                        </button>
                    </form>
                </div>
            )}

            {/* The Floating Action Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:bg-blue-400 hover:scale-105
                    transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-200"
                >
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                </button>
            )}
        </div>
    );
}