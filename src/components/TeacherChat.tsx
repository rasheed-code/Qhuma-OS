"use client";

import { Send, MessageCircle } from "lucide-react";
import { chatMessages } from "@/data/students";
import { Role } from "@/types";

export default function TeacherChat({ role }: { role: Role }) {
  const title =
    role === "student"
      ? "Chat with Prof. Ana"
      : role === "parent"
      ? "Chat with Tutor"
      : "Messages";

  return (
    <div className="bg-card rounded-2xl border border-card-border flex flex-col h-[420px]">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
        <div className="w-7 h-7 rounded-full bg-sidebar flex items-center justify-center">
          <MessageCircle size={13} className="text-accent" />
        </div>
        <div>
          <span className="text-[13px] font-semibold text-text-primary block leading-tight">
            {title}
          </span>
          <span className="text-[10px] text-success">Online</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3">
        {chatMessages.map((msg) => {
          const isTeacher = msg.sender === "teacher";
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${
                isTeacher ? "items-start" : "items-end"
              }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 ${
                  isTeacher
                    ? "bg-background rounded-tl-sm"
                    : "bg-sidebar text-white rounded-tr-sm"
                }`}
              >
                <p className="text-[12px] leading-relaxed">{msg.message}</p>
              </div>
              <span className="text-[9px] text-text-muted mt-1 px-1">
                {msg.senderName} · {msg.time}
              </span>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className="px-3 py-3 border-t border-border">
        <div className="flex items-center gap-2 bg-background rounded-xl px-3 py-2">
          <input
            type="text"
            placeholder="Type something..."
            className="flex-1 bg-transparent text-[12px] text-text-primary placeholder:text-text-muted outline-none"
          />
          <button className="w-7 h-7 rounded-full bg-sidebar flex items-center justify-center hover:bg-accent-dark transition-colors cursor-pointer">
            <Send size={12} className="text-accent" />
          </button>
        </div>
      </div>
    </div>
  );
}
