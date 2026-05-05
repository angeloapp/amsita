'use client';

import { useState, useRef, useEffect } from 'react';
import { useChat } from 'ai/react';

const SUGGESTED_ACTIONS = [
  'Abre YouTube y busca lo mas popular',
  'Ve a Wikipedia y resume el articulo principal',
  'Busca en Google las noticias de hoy',
  'Navega a GitHub y muestra mis repos',
];

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({ api: '/api/chat' });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col min-h-screen bg-[#0f0f0f]">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-[#2e2e2e]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center font-bold text-sm">A</div>
          <span className="text-white font-semibold text-lg">Amsita</span>
          <span className="text-xs text-teal-400 bg-teal-400/10 px-2 py-0.5 rounded-full">Browser Agent</span>
        </div>
        <div className="text-xs text-gray-500">Powered by OpenAI</div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto px-4 py-6 max-w-3xl mx-auto w-full">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-8 mt-20">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white mb-2">Hola, soy Amsita</h1>
              <p className="text-gray-400 text-base">Tu agente de navegador con IA. Dame una instruccion.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl">
              {SUGGESTED_ACTIONS.map((action, i) => (
                <button
                  key={i}
                  onClick={() => handleInputChange({ target: { value: action } } as any)}
                  className="text-left px-4 py-3 rounded-xl bg-[#1a1a1a] border border-[#2e2e2e] text-gray-300 text-sm hover:border-teal-500 hover:text-white transition-all duration-200"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m) => (
          <div key={m.id} className={`mb-6 flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.role === 'assistant' && (
              <div className="w-7 h-7 rounded-full bg-teal-500 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1">A</div>
            )}
            <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
              m.role === 'user'
                ? 'bg-teal-600 text-white rounded-br-sm'
                : 'bg-[#1a1a1a] text-gray-200 rounded-bl-sm border border-[#2e2e2e]'
            }`}>
              {m.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 mb-6">
            <div className="w-7 h-7 rounded-full bg-teal-500 flex items-center justify-center text-xs font-bold">A</div>
            <div className="bg-[#1a1a1a] border border-[#2e2e2e] px-4 py-3 rounded-2xl rounded-bl-sm">
              <div className="flex gap-1 items-center">
                <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce delay-75" />
                <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce delay-150" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Input */}
      <div className="border-t border-[#2e2e2e] px-4 py-4">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex gap-3">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Escribe una instruccion para el navegador..."
            className="flex-1 bg-[#1a1a1a] border border-[#2e2e2e] rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-teal-500 transition-colors"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-teal-600 hover:bg-teal-500 disabled:opacity-40 disabled:cursor-not-allowed text-white px-5 py-3 rounded-xl text-sm font-medium transition-colors"
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}
