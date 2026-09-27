'use client';

import { useState } from 'react';
import PropertyCard from './PropertyCard';

interface AIChatProps {
    // eslint-disable-next-line
    onPropertiesFound?: (properties: any[]) => void;
}

export default function AIChat({ onPropertiesFound }: AIChatProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [conversation, setConversation] = useState<{ 
        role: 'user' | 'ai'; 
        text: string; 
        properties?: [];
    }[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        // Add user message to UI immediately
        const userMessage = input;
        setConversation((prev) => [...prev, { role: 'user', text: userMessage }]);
        setInput('');
        setIsLoading(true);

        try {
            // Call the AI endpoint
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: userMessage }),
            });

            const data = await res.json();

            console.log("RAW AI RESPONSE: ", data);

            const aiReply = data.reply || {};

            let safeString = "I found some properties for you.";

            if (typeof aiReply.message === 'string') {
                safeString = aiReply.message;
            } else if (aiReply.message?.content) {
                safeString = typeof aiReply.message.content === 'string'
                    ? aiReply.message.content
                    : aiReply.message.content[0]?.text || safeString;
            }

            let safeProperties = [];
            if (Array.isArray(aiReply.properties)) {
                safeProperties = aiReply.properties;
            } else if (typeof aiReply.properties === 'string') {
                try {
                    safeProperties = JSON.parse(aiReply.properties);
                } catch (error) {
                    console.error("Could not parse properties:", aiReply.properties);
                }
            }

            if (!res.ok) throw new Error(data.error || 'Failed to fetch response.');

            // Add AI response to UI
            setConversation((prev) => [...prev, { 
                role: 'ai', text: safeString, properties: safeProperties
            }]);

            // If the parent gave us a function, fire it with the new data
            if (onPropertiesFound && safeProperties.length > 0) {
                onPropertiesFound(safeProperties);
            }
        } catch (error) {
            console.error('Chat Error:', error);
            setConversation((prev) => [...prev, { role: 'ai', text: 'Sorry, I encountered an error.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* The Chat Window */}
            {isOpen && (
                <div className="w-80 sm:w-96 bg-white rounded-2xl shadow-2xl overflow-hidden mb-4 
                border border-gray-200 flex flex-col h-[500px] transition-all duration-300 origin-bottom-right">

                    {/* Header */}
                    <div className="bg-blue-600 text-white p-4 font-bold flex justify-between items-center shadow-sm">
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
                        {conversation.length === 0 && (
                            <p className="text-gray-400 text-center mt-4">Ask me to search for properties at a specific location!</p>
                        )}

                        {conversation.map((msg, index) => (
                            <div key={index} className={`flex flex-col ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`p-3 rounded-2xl max-w-[85%] ${
                                    msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none shadow-md' : 'bg-white text-gray-800 rounded-bl-none shadow-sm border-gray-200'
                                }`}>
                                    { msg.text }
                                </div>

                                {/* If properties exist, map them into cards. */}
                                {Array.isArray(msg.properties) && msg.properties.length > 0 && (
                                    <div className="mt-2 flex flex-col gap-2">
                                        {/* eslint-disable-next-line */}
                                        {msg.properties.map((prop: any, idx: number) => (
                                            <PropertyCard key={prop.id || idx} property={prop} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="p-3 rounded-2xl bg-white text-gray-600 shadow-sm border border-gray-200 animate-pulse 
                                rounded-bl-none flex gap-2 items-center">
                                    <div className="w-2 h-2 text-gray-900 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 text-gray-900 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                    <div className="w-2 h-2 text-gray-900 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {/* Input Area */}
                    <form onSubmit={handleSubmit} className="p-3 border-t bg-white flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2
                            focus:ring-blue-600"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={isLoading}
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