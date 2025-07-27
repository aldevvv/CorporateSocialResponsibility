// app/dashboard/insights/ai/page.tsx
'use client';

import { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
    <div className="h-[calc(100vh-12rem)] sm:h-[calc(100vh-16rem)] flex flex-col bg-white rounded-xl shadow-sm border border-gray-200/50 overflow-hidden">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 px-4 sm:px-6 py-3 sm:py-4 flex-shrink-0">
        <h3 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-2">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <span className="text-xs sm:text-sm font-bold">AI</span>
          </div>
          AI Assistant
        </h3>
        <p className="text-purple-100 text-xs sm:text-sm mt-1">
          Tanyakan apapun tentang program CSR dan analisis data
        </p>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-3 sm:space-y-4 bg-gray-50">
        {messages.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-gradient-to-r from-purple-600 to-indigo-700 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg sm:text-xl">AI</span>
            </div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Selamat datang di AI Assistant</h3>
            <p className="text-gray-500 max-w-sm sm:max-w-md mx-auto text-sm sm:text-base px-4">
              Mulai percakapan dengan menanyakan sesuatu tentang program CSR, analisis data, atau topik lainnya.
            </p>
          </div>
        )}
        
        {messages.map(m => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] sm:max-w-2xl ${m.role === 'user' ? 'ml-2 sm:ml-12' : 'mr-2 sm:mr-12'}`}>
              <div className={`rounded-2xl px-3 sm:px-4 py-2 sm:py-3 shadow-sm ${
                m.role === 'user'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white'
                  : 'bg-white border border-gray-200'
              }`}>
                <p className={`whitespace-pre-wrap text-sm leading-relaxed ${
                  m.role === 'user' ? 'text-white' : 'text-gray-800'
                }`}>
                  {m.content}
                </p>
              </div>
              <div className={`text-xs text-gray-500 mt-1 px-1 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                {m.role === 'user' ? 'Anda' : 'AI Assistant'}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[85%] sm:max-w-2xl mr-2 sm:mr-12">
              <div className="bg-white border border-gray-200 rounded-2xl px-3 sm:px-4 py-2 sm:py-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-xs sm:text-sm text-gray-500">AI sedang mengetik...</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Form */}
      <div className="flex-shrink-0 border-t border-gray-200 bg-white p-3 sm:p-4">
        <form onSubmit={handleSubmit} className="flex items-center gap-2 sm:gap-3">
          <div className="flex-1 relative">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ketik pesan Anda di sini..."
              disabled={isLoading}
              className="h-10 sm:h-12 pr-3 sm:pr-12 border-2 border-gray-200 focus:border-purple-300 rounded-xl text-sm"
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="h-10 sm:h-12 px-3 sm:px-6 bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <span className="hidden sm:inline">Kirim</span>
            )}
            {isLoading ? null : (
              <svg className="w-4 h-4 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}