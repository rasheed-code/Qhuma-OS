"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Loader2 } from "lucide-react";
import { chatMessages as initialMessages } from "@/data/students";
import { Role, ChatMessage } from "@/types";

interface Message {
  id: string;
  sender: "student" | "teacher";
  senderName: string;
  message: string;
  time: string;
  isTyping?: boolean;
}

function formatTime() {
  return new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
}

export default function TeacherChat({ role }: { role: Role }) {
  const [messages, setMessages] = useState<Message[]>(() =>
    initialMessages.map((m: ChatMessage) => ({
      id: m.id,
      sender: m.sender,
      senderName: m.senderName,
      message: m.message,
      time: m.time,
    }))
  );
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const title =
    role === "student"
      ? "Profa. Ana Martínez"
      : role === "parent"
      ? "Tutor QHUMA"
      : "Mensajes";

  const subtitle =
    role === "student"
      ? "Mentora IA · 1º ESO"
      : role === "parent"
      ? "Asistente familiar"
      : "Clase 1º ESO";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const senderName =
      role === "student" ? "Lucas" : role === "parent" ? "María" : "Ana";

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: "student",
      senderName,
      message: text,
      time: formatTime(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    const typingId = `typing-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      {
        id: typingId,
        sender: "teacher",
        senderName: "Prof. Ana",
        message: "...",
        time: "",
        isTyping: true,
      },
    ]);

    try {
      const historyToSend = messages.slice(-8);
      const res = await fetch("/api/tutor-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history: historyToSend }),
      });

      const data = await res.json();
      const reply = data.reply ?? "¡Sigue así! 💪";

      setMessages((prev) =>
        prev
          .filter((m) => m.id !== typingId)
          .concat({
            id: `ai-${Date.now()}`,
            sender: "teacher",
            senderName: "Prof. Ana",
            message: reply,
            time: formatTime(),
          })
      );
    } catch {
      setMessages((prev) =>
        prev
          .filter((m) => m.id !== typingId)
          .concat({
            id: `ai-err-${Date.now()}`,
            sender: "teacher",
            senderName: "Prof. Ana",
            message: "¡Sigue con la tarea! Ahora mismo estoy ocupada. 🙂",
            time: formatTime(),
          })
      );
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickSuggestions = [
    "¿Cómo empiezo?",
    "Estoy bloqueado",
    "¿Qué entrego?",
  ];

  return (
    <div className="bg-card rounded-2xl border border-card-border flex flex-col h-[460px]">
      {/* Gradient header */}
      <div
        className="flex items-center gap-2.5 px-4 py-3.5 rounded-t-2xl"
        style={{
          background: "linear-gradient(135deg, var(--sidebar) 0%, var(--accent-dark) 100%)",
        }}
      >
        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
          <Sparkles size={14} className="text-accent" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-[13px] font-semibold text-white block leading-tight truncate">
            {title}
          </span>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-[10px] text-white/70">{subtitle}</span>
          </div>
        </div>
        <div className="text-[10px] text-white/60 font-medium bg-white/10 px-2 py-0.5 rounded-full">
          IA
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2.5">
        {messages.map((msg) => {
          const isTeacher = msg.sender === "teacher";
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isTeacher ? "items-start" : "items-end"}`}
            >
              <div
                className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 ${
                  isTeacher
                    ? "bg-background rounded-tl-sm"
                    : "bg-sidebar text-white rounded-tr-sm"
                }`}
              >
                {msg.isTyping ? (
                  <div className="flex items-center gap-1 py-0.5">
                    {[0, 150, 300].map((delay) => (
                      <div
                        key={delay}
                        className="w-1.5 h-1.5 rounded-full bg-text-muted animate-bounce"
                        style={{ animationDelay: `${delay}ms` }}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-[12px] leading-relaxed whitespace-pre-wrap">
                    {msg.message}
                  </p>
                )}
              </div>
              {!msg.isTyping && (
                <span className="text-[9px] text-text-muted mt-0.5 px-1">
                  {msg.senderName}
                  {msg.time ? ` · ${msg.time}` : ""}
                </span>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick suggestions — only when few messages */}
      {messages.length <= 5 && (
        <div className="px-3 pb-2 flex gap-1.5 flex-wrap">
          {quickSuggestions.map((s) => (
            <button
              key={s}
              onClick={() => {
                setInput(s);
                inputRef.current?.focus();
              }}
              className="text-[10px] text-accent-text bg-accent-light border border-accent/30 px-2.5 py-1 rounded-full hover:bg-accent/20 transition-colors cursor-pointer"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="px-3 py-3 border-t border-border">
        <div className="flex items-center gap-2 bg-background rounded-xl px-3 py-2.5">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Pregunta a la Profa. Ana..."
            className="flex-1 bg-transparent text-[12px] text-text-primary placeholder:text-text-muted outline-none"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="w-7 h-7 rounded-full bg-sidebar flex items-center justify-center hover:bg-accent-dark transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 size={12} className="text-accent animate-spin" />
            ) : (
              <Send size={12} className="text-accent" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
