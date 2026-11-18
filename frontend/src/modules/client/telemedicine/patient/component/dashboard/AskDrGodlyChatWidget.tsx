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
    <Card className="dash-card border border-border/80 bg-gradient-to-br from-card via-card to-teal-500/5 rounded-2xl shadow-xs hover:shadow-md transition-all overflow-hidden">
      <CardHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 shadow-2xs">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="dash-section-title text-foreground">
              Ask DrGodly AI
            </CardTitle>
            <p className="dash-caption text-xs text-muted-foreground mt-0.5">
              Your 24/7 personal health companion
            </p>
          </div>
        </div>
        <Badge className="bg-teal-500/10 text-teal-700 dark:text-teal-400 text-xs font-semibold border border-teal-500/20 px-2.5 py-0.5 rounded-full">
          Grounded on Your EMR
        </Badge>
      </CardHeader>

      <CardContent className="pt-4 pb-4 space-y-3.5">
        {/* Messages Thread */}
        <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-2.5 ${
                m.sender === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`h-7 w-7 rounded-full flex items-center justify-center text-xs shrink-0 shadow-2xs ${
                  m.sender === "user"
                    ? "bg-foreground text-background"
                    : "bg-teal-600 text-white"
                }`}
              >
                {m.sender === "user" ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
              </div>
              <div
                className={`p-3 rounded-2xl text-xs sm:text-sm leading-relaxed max-w-[85%] transition-all ${
                  m.sender === "user"
                    ? "bg-foreground text-background rounded-tr-none shadow-xs"
                    : "bg-card border border-border text-card-foreground shadow-2xs rounded-tl-none"
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
              className="text-xs px-3 py-1.5 rounded-xl bg-card border border-border/80 text-muted-foreground hover:border-teal-500/50 hover:text-foreground hover:bg-muted/40 transition-all duration-150 text-left shadow-2xs active:scale-[0.98]"
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
            className="text-xs sm:text-sm h-10 bg-card border-border/80 focus-visible:ring-2 focus-visible:ring-teal-500 rounded-xl"
          />
          <Button
            size="sm"
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className="dash-btn-primary h-10 px-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white shrink-0 shadow-xs transition-all active:scale-[0.97]"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        <p className="dash-micro text-[11px] text-muted-foreground/75 text-center">
          DrGodly AI provides health insights, not formal medical diagnosis. In emergencies, call 112.
        </p>
      </CardContent>
    </Card>
  );
}
