'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { ArrowUp } from 'lucide-react';
import Image from 'next/image';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  type?: string;
  data?: any;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          session_id: 'test-session',
          messages: messages
        })
      });

      const data = await response.json();
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
        type: data.type,
        data: data.data
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e);
    }
  };

  const welcomeMessage = "Hi! I'm your cooking buddy! Tell me what you're thinking of making and I'll help bring your ideas to life!";
  const characterTitle = "Kitchen Companion";

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="h-16 border-b flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
            PantryPal
          </span>
        </div>
      </div>

      {/* Resizable area */}
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* Chat Panel */}
        <ResizablePanel defaultSize={60} minSize={40}>
          <div className="h-full flex flex-col">
            {/* Character Header as Button */}
            <div className="p-4 border-b">
              <Tooltip open={isOpen} onOpenChange={setIsOpen}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start h-auto p-3 hover:bg-accent"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsOpen(true);
                    }}
                  >
                    <Avatar className="w-12 h-12 mr-3">
                      <AvatarImage src="/panda.png" alt="PantryPal" />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        PP
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start">
                      <span className="font-semibold text-base">PantryPal</span>
                      <span className="text-xs text-muted-foreground">{characterTitle}</span>
                    </div>
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="max-w-xs p-4"
                  sideOffset={5}
                >
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <Avatar className="w-8 h-8 shrink-0">
                        <AvatarImage src="/panda.png" alt="PantryPal" />
                        <AvatarFallback>PP</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">PantryPal</p>
                        <p className="text-xs text-muted-foreground">{characterTitle}</p>
                      </div>
                    </div>
                    <p className="text-sm">{welcomeMessage}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>

            {/* Chat Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4 max-w-3xl mx-auto">
                {messages.length === 0 && (
                  <div className="text-center text-muted-foreground py-12">
                    <p>Ask me anything about cooking!</p>
                  </div>
                )}
                
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.role === 'assistant' && (
                      <Avatar className="w-8 h-8 mr-2 shrink-0">
                        <AvatarImage src="/panda.png" alt="PantryPal" />
                        <AvatarFallback>PP</AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`rounded-2xl px-4 py-3 max-w-[80%] ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      } ${message.content.length > 120 ? 'w-full' : ''}`}
                    >
                      {message.role === 'user' ? (
                        message.content
                      ) : (
                        <div>
                          {!message.content && isLoading && index === messages.length - 1 ? (
                            <p className="text-sm">Thinking...</p>
                          ) : (
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {isLoading && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
                  <div className="flex justify-start">
                    <Avatar className="w-8 h-8 mr-2 shrink-0">
                      <AvatarImage src="/panda.png" alt="PantryPal" />
                      <AvatarFallback>PP</AvatarFallback>
                    </Avatar>
                    <div className="rounded-2xl px-4 py-3 bg-muted">
                      <p className="text-sm">Thinking...</p>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t">
              <form onSubmit={sendMessage} className="max-w-3xl mx-auto">
                <div className="relative flex items-end gap-2">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="What are you thinking of making?"
                    className="flex-1 min-h-[52px] max-h-[200px] px-4 py-3 pr-12 rounded-2xl border border-input bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                    rows={1}
                    disabled={isLoading}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={isLoading || !input.trim()}
                    className="absolute right-2 bottom-2 h-8 w-8 rounded-full"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Right Panel - Equipment & Recipes */}
        <ResizablePanel defaultSize={40} minSize={30}>
          <div className="h-full flex flex-col">
            {/* Equipment Section */}
            <div className="p-4 border-b">
              <h3 className="font-semibold text-sm mb-3">🍳 My Kitchen Equipment</h3>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  Equipment drawer coming soon...
                </div>
              </div>
            </div>

            {/* Recipes Section */}
            <ScrollArea className="flex-1 p-4">
              <h3 className="font-semibold text-sm mb-3">📋 Recipes</h3>
              <div className="text-sm text-muted-foreground">
                Recipes will appear here...
              </div>
            </ScrollArea>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
