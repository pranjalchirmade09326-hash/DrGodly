"use client";

import { useState } from "react";
import { Bot, Send, Sparkles, AlertCircle, CheckCircle2, ChevronRight, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "m1",
    sender: "ai",
    text: "Hello Anjali! I am your DrGodly Health Assistant. I have secure access to your vitals and care plan. How can I help you today?",
  },
];

const PROMPT_PILLS = [
  {
    label: "Can I take Ibuprofen with Lisinopril?",
    reply: "Caution: Ibuprofen (an NSAID) can reduce the blood-pressure lowering effectiveness of Lisinopril and increase stress on your kidneys. For mild pain or headache, Paracetamol (Acetaminophen) is generally considered safer. Please consult Dr. Priya if pain persists.",
  },
  {
    label: "Explain my latest HbA1c result (6.8%)",
    reply: "Your HbA1c is 6.8%, which falls in the early pre-diabetes/controlled diabetes range (target is typically < 7.0%). This reflects your average blood sugar over the past 3 months. Your daily walking and diet adjustments are keeping it stable!",
  },
  {
    label: "What exercises are safe with my BP?",
    reply: "Moderate aerobic activities like brisk walking, cycling, or light swimming for 30 minutes daily are ideal. Avoid heavy isometric lifting or sudden straining until approved by Dr. Priya.",
  },
];

export function AskDrGodlyChatWidget() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), sender: "user", text: query };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Simulate grounded AI reply
    setTimeout(() => {
      const pillMatch = PROMPT_PILLS.find((p) => p.label.toLowerCase() === query.toLowerCase());
      const replyText =
        pillMatch?.reply ||
        `Based on your current health records (Stage 2 Hypertension on medication), "${query}" is noted. As a general precaution, maintain adequate hydration, monitor your BP twice daily, and share any new symptoms with Dr. Priya during your upcoming visit.`;

      const aiMsg: Message = { id: (Date.now() + 1).toString(), sender: "ai", text: replyText };
      setMessages((prev) => [...prev, aiMsg]);
    }, 600);
  };

  return (
    <Card className="border border-teal-200/60 bg-gradient-to-br from-white via-teal-50/10 to-emerald-50/20 rounded-2xl shadow-xs overflow-hidden">
      <CardHeader className="pb-3 border-b border-teal-100/60 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-teal-600 text-white shadow-xs">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold text-slate-900">
              Ask DrGodly AI
            </CardTitle>
            <p className="text-xs text-slate-500">
              Your 24/7 personal health companion
            </p>
          </div>
        </div>
        <Badge className="bg-teal-50 text-teal-800 text-[11px] font-medium border border-teal-200">
          Grounded on Your EMR
        </Badge>
      </CardHeader>

      <CardContent className="pt-3 space-y-3">
        {/* Messages Thread */}
        <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-2 ${
                m.sender === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] shrink-0 ${
                  m.sender === "user"
                    ? "bg-slate-900 text-white"
                    : "bg-teal-600 text-white"
                }`}
              >
                {m.sender === "user" ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
              </div>
              <div
                className={`p-2.5 rounded-2xl text-xs leading-relaxed max-w-[85%] ${
                  m.sender === "user"
                    ? "bg-slate-900 text-white rounded-tr-none"
                    : "bg-white border border-teal-100 text-slate-700 shadow-2xs rounded-tl-none"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {/* Suggested Question Pills */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {PROMPT_PILLS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p.label)}
              className="text-[11px] px-2.5 py-1 rounded-xl bg-white border border-slate-200 text-slate-600 hover:border-teal-400 hover:text-teal-700 transition-all text-left"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="flex items-center gap-2 pt-1">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask about medications, lab results, diet..."
            className="text-xs h-9 bg-white border-slate-200 focus-visible:ring-teal-500 rounded-xl"
          />
          <Button
            size="sm"
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className="h-9 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white shrink-0"
          >
            <Send className="h-3.5 w-3.5" />
          </Button>
        </div>

        <p className="text-[10px] text-slate-400 text-center">
          DrGodly AI provides health insights, not formal medical diagnosis. In emergencies, call 112.
        </p>
      </CardContent>
    </Card>
  );
}
