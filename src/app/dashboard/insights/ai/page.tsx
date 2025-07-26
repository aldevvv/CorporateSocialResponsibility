// app/dashboard/insights/ai/page.tsx
'use client';

import { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

// Definisikan tipe untuk pesan
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function AiInsightPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input || isLoading) return;

    setIsLoading(true);
    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    
    // Siapkan pesan AI yang akan diisi secara streaming
    const aiMessageId = (Date.now() + 1).toString();
    const aiMessage: Message = { id: aiMessageId, role: 'assistant', content: '' };
    setMessages(prev => [...prev, aiMessage]);
    setInput('');

    try {
      const response = await fetch('/api/ai-insight', {
        method: 'POST',
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });
      
      if (!response.body) return;

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        setMessages(prev => prev.map(msg => 
          msg.id === aiMessageId 
            ? { ...msg, content: msg.content + chunk } 
            : msg
        ));
      }

    } catch (error) {
      console.error("Gagal mengambil response AI:", error);
      setMessages(prev => prev.map(msg => 
        msg.id === aiMessageId 
          ? { ...msg, content: 'Maaf, terjadi kesalahan.' } 
          : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex-1 overflow-y-auto pr-4 space-y-4">
        {messages.map(m => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <Card className={`max-w-xl ${m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
              <CardContent className="p-3">
                <p className="whitespace-pre-wrap">{m.content}</p>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tanyakan sesuatu..."
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? '...' : 'Kirim'}
          </Button>
        </form>
      </div>
    </div>
  );
}