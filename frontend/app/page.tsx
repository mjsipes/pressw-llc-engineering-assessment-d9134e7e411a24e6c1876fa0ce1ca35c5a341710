'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { ArrowUp } from 'lucide-react';

interface Recipe {
  name: string;
  total_time: string;
  ingredients: string[];
  instructions: string[];
  history_note?: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  type?: string;
  data?: any;
  recipe?: Recipe;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [equipment, setEquipment] = useState('stove, oven');
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('kitchen-equipment');
    if (saved) setEquipment(saved);
    
    const savedRecipes = localStorage.getItem('recipes');
    if (savedRecipes) setRecipes(JSON.parse(savedRecipes));
  }, []);

  useEffect(() => {
    localStorage.setItem('kitchen-equipment', equipment);
  }, [equipment]);

  useEffect(() => {
    localStorage.setItem('recipes', JSON.stringify(recipes));
  }, [recipes]);

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
          messages: messages,
          equipment: equipment
        })
      });

      const data = await response.json();
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
        type: data.type,
        data: data.data,
        recipe: data.recipe
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Update equipment if agent modified it
      if (data.updated_equipment) {
        setEquipment(data.updated_equipment);
      }
      
      // Save recipe if created
      if (data.recipe) {
        setRecipes(prev => [data.recipe, ...prev]);
      }
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

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="h-16 border-b flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src="/panda.png" alt="PantryPal" />
            <AvatarFallback>PP</AvatarFallback>
          </Avatar>
          <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
            PantryPal
          </span>
        </div>
      </div>

      {/* Resizable area */}
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* Chat Panel */}
        <ResizablePanel defaultSize={60} minSize={40}>
          <div className="h-full flex flex-col">

            {/* Chat Messages */}
            <ScrollArea className="flex-1 px-2 py-3">
              <div className="space-y-4 max-w-3xl mx-auto">
                {messages.length === 0 && (
                  <div className="text-center text-muted-foreground py-12">
                    <p className="text-sm">Ask me anything about cooking!</p>
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
                    <div className="flex flex-col gap-3 max-w-[85%]">
                      <div
                        className={`rounded-2xl px-4 py-3 text-sm ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        {message.role === 'user' ? (
                          message.content
                        ) : (
                          <div>
                            {!message.content && isLoading && index === messages.length - 1 ? (
                              <span>Thinking...</span>
                            ) : (
                              <span className="whitespace-pre-wrap">{message.content}</span>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {message.recipe && (
                        <div className="bg-card border rounded-lg p-4 text-sm">
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="font-semibold text-base">{message.recipe.name}</h3>
                            <span className="text-xs text-muted-foreground">⏱️ {message.recipe.total_time}</span>
                          </div>
                          
                          {message.recipe.history_note && (
                            <p className="text-xs text-muted-foreground italic mb-3">{message.recipe.history_note}</p>
                          )}
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold mb-2">Ingredients</h4>
                              <ul className="space-y-1 text-xs">
                                {message.recipe.ingredients.map((ing, i) => (
                                  <li key={i}>• {ing}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">Instructions</h4>
                              <ol className="space-y-1 text-xs">
                                {message.recipe.instructions.map((step, i) => (
                                  <li key={i}>{i + 1}. {step}</li>
                                ))}
                              </ol>
                            </div>
                          </div>
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
                    <div className="rounded-2xl px-4 py-3 bg-muted text-sm">
                      <span>Thinking...</span>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="px-2 py-3 border-t">
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
          <div className="h-full flex flex-col bg-muted/30">
            {/* Equipment Section */}
            <div className="p-4 border-b">
              <h3 className="font-semibold text-sm mb-3">🍳 My Kitchen Equipment</h3>
              <textarea
                value={equipment}
                onChange={(e) => setEquipment(e.target.value)}
                placeholder="stove, oven, blender..."
                className="w-full min-h-[80px] px-3 py-2 text-sm rounded-lg border border-input bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Recipes Section */}
            <ScrollArea className="flex-1 p-4">
              <h3 className="font-semibold text-sm mb-3">📋 Recipes ({recipes.length})</h3>
              {recipes.length === 0 ? (
                <div className="text-sm text-muted-foreground">
                  Ask for a recipe to get started!
                </div>
              ) : (
                <div className="space-y-3">
                  {recipes.map((recipe, i) => (
                    <div key={i} className="bg-card border rounded-lg p-3 text-xs">
                      <h4 className="font-semibold text-sm mb-1">{recipe.name}</h4>
                      <p className="text-muted-foreground">⏱️ {recipe.total_time}</p>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
