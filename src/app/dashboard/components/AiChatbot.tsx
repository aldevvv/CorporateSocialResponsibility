'use client';

import { useState, FormEvent, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, X, Send, Minimize2, Settings } from 'lucide-react';
import Link from 'next/link';

// Definisikan tipe untuk pesan
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function AiChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto scroll saat streaming
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        scrollToBottom();
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input || isLoading) return;

    setIsLoading(true);
    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    // Siapkan pesan AI yang akan diisi secara streaming
    const aiMessageId = (Date.now() + 1).toString();

    try {
      const response = await fetch('/api/ai-insight', {
        method: 'POST',
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });
      
      if (!response.body) return;

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let isFirstChunk = true;
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        
        if (isFirstChunk) {
          // Tambahkan pesan AI baru saat chunk pertama diterima
          const aiMessage: Message = { id: aiMessageId, role: 'assistant', content: chunk };
          setMessages(prev => [...prev, aiMessage]);
          isFirstChunk = false;
        } else {
          // Update pesan AI yang sudah ada
          setMessages(prev => prev.map(msg =>
            msg.id === aiMessageId
              ? { ...msg, content: msg.content + chunk }
              : msg
          ));
        }
      }

    } catch (error) {
      console.error("Gagal mengambil response AI:", error);
      // Tambahkan pesan error jika belum ada pesan AI
      const aiMessage: Message = { id: aiMessageId, role: 'assistant', content: 'Maaf, terjadi kesalahan.' };
      setMessages(prev => [...prev, aiMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const minimizeChatbot = () => {
    setIsMinimized(true);
  };

  const restoreChatbot = () => {
    setIsMinimized(false);
  };

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={toggleChatbot}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
        >
          <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 group-hover:scale-110 transition-transform" />
        </button>
      )}

      {/* Chatbot Popup */}
      {isOpen && (
        <div className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 bg-white rounded-2xl shadow-2xl border border-gray-200/50 transition-all duration-300 flex flex-col ${
          isMinimized
            ? 'w-72 sm:w-80 h-14 sm:h-16'
            : 'w-72 sm:w-80 md:w-96 h-[350px] sm:h-[400px] md:h-[450px]'
        }`}>
          
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-700 px-4 py-3 rounded-t-2xl flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-xs font-bold text-white">AI</span>
              </div>
              <h3 className="text-white font-semibold text-sm">AI Assistant</h3>
            </div>
            <div className="flex items-center gap-1">
              <Link
                href="/dashboard/ai-settings"
                className="text-white/80 hover:text-white p-1 rounded transition-colors"
                title="AI Settings"
              >
                <Settings className="h-4 w-4" />
              </Link>
              <button
                onClick={isMinimized ? restoreChatbot : minimizeChatbot}
                className="text-white/80 hover:text-white p-1 rounded transition-colors"
                title={isMinimized ? "Restore" : "Minimize"}
              >
                <Minimize2 className="h-4 w-4" />
              </button>
              <button
                onClick={toggleChatbot}
                className="text-white/80 hover:text-white p-1 rounded transition-colors"
                title="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Content - Hidden when minimized */}
          {!isMinimized && (
            <>
              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {messages.length === 0 && (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-purple-600 to-indigo-700 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">AI</span>
                    </div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Halo! Ada yang bisa saya bantu?</h4>
                    <p className="text-gray-500 text-xs px-2">
                      Tanyakan tentang program CSR, analisis data, atau topik lainnya.
                    </p>
                  </div>
                )}
                
                {messages.map(m => (
                  <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex items-start gap-2 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      {/* Profile Avatar */}
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                        m.role === 'user'
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-700'
                          : 'bg-gradient-to-r from-purple-600 to-indigo-700'
                      }`}>
                        <span className="text-white font-bold text-xs">
                          {m.role === 'user' ? 'U' : 'AI'}
                        </span>
                      </div>
                      
                      {/* Message Bubble */}
                      <div className={`rounded-2xl px-3 py-2 shadow-sm text-sm ${
                        m.role === 'user'
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white'
                          : 'bg-white border border-gray-200'
                      }`}>
                        <p className={`whitespace-pre-wrap leading-relaxed ${
                          m.role === 'user' ? 'text-white' : 'text-gray-800'
                        }`}>
                          {m.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-purple-600 to-indigo-700 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-xs">AI</span>
                      </div>
                      <div className="bg-white border border-gray-200 rounded-2xl px-3 py-2 shadow-sm">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Form */}
              <div className="border-t border-gray-200 bg-white p-3 rounded-b-2xl flex-shrink-0">
                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                  <div className="flex-1 relative">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ketik pesan..."
                      disabled={isLoading}
                      className="h-9 pr-3 border-2 border-gray-200 focus:border-purple-300 rounded-xl text-sm"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    size="sm"
                    className="h-9 w-9 p-0 bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {isLoading ? (
                      <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </form>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}