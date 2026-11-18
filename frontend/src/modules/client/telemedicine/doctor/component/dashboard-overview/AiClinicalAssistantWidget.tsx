"use client";

import { useState } from "react";
import { Sparkles, Send, Bot, CheckCircle2, ChevronRight, AlertCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface SuggestedPrompt {
  id: string;
  label: string;
  response: string;
}

const DEFAULT_PROMPTS: SuggestedPrompt[] = [
  {
    id: "p1",
    label: "Summarize intake for next patient (Anjali Menon)",
    response: "Anjali Menon (42F, ABHA: 91-4821-9032-1104): Presenting with 3-day history of throbbing bilateral headaches and intermittent visual blurriness. Known Stage 2 HTN on Telmisartan 40mg. Self-reported BP this morning is 150/95 mmHg. No chest pain or dyspnea. Pre-visit ECG normal sinus rhythm.",
  },
  {
    id: "p2",
    label: "Check drug interactions: Metformin + Lisinopril",
    response: "No severe contraindication. Lisinopril may slightly enhance hypoglycemic effect of Metformin. Monitor renal function (eGFR) and serum potassium periodically, especially if GFR < 60 mL/min.",
  },
  {
    id: "p3",
    label: "Highlight critical lab values from yesterday",
    response: "Critical Flag: Patient Ramesh Kumar (MRN-4091) Serum Potassium reported at 5.8 mEq/L (Normal: 3.5 - 5.0 mEq/L). Action Recommended: Repeat stat electrolyte panel and review potassium-sparing medications.",
  },
  {
    id: "p4",
    label: "Draft follow-up template for hypertensive review",
    response: "SOAP Template Loaded: [Subjective] BP diary compliance, side effects (headache/dizziness). [Objective] In-clinic BP, heart rate, peripheral edema. [Assessment] HTN control status (JNC-8/AHA). [Plan] Titration or add CCB (Amlodipine), 30-day follow-up.",
  },
];

export function AiClinicalAssistantWidget() {
  const [selectedPrompt, setSelectedPrompt] = useState<SuggestedPrompt | null>(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [customAnswer, setCustomAnswer] = useState<string | null>(null);

  const handleSend = () => {
    if (!query.trim()) return;
    setLoading(true);
    setCustomAnswer(null);
    setTimeout(() => {
      setCustomAnswer(
        `DrGodly Clinical Engine: Analysis completed for "${query}". Based on AHA/ACC 2024 guidelines and recent EMR records, standard protocol suggests verifying patient baseline creatinine before adjusting pharmacotherapy.`
      );
      setLoading(false);
    }, 800);
  };

  return (
    <Card className="dash-card border border-border/80 bg-gradient-to-br from-card via-card to-teal-500/5 shadow-xs hover:shadow-md transition-all rounded-2xl overflow-hidden">
      <CardHeader className="pb-3 border-b border-border/60 bg-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 shadow-2xs">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="dash-section-title text-foreground">
                AI Clinical Assistant
              </CardTitle>
              <p className="dash-caption text-xs text-muted-foreground mt-0.5">
                Ambient clinical decision support & EMR insights
              </p>
            </div>
          </div>
          <Badge className="bg-teal-500/10 text-teal-700 dark:text-teal-400 text-xs font-semibold border border-teal-500/20 px-2.5 py-0.5 rounded-full">
            Gemini 2.5 Pro Grounded
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-4 pb-4 space-y-4">
        {/* Suggested Prompt Chips */}
        <div>
          <p className="dash-caption text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">
            Suggested Clinical Prompts
          </p>
          <div className="flex flex-wrap gap-2">
            {DEFAULT_PROMPTS.map((prompt) => (
              <button
                key={prompt.id}
                onClick={() => {
                  setSelectedPrompt(prompt);
                  setCustomAnswer(null);
                }}
                className={`text-xs px-3 py-1.5 rounded-xl border text-left transition-all duration-150 flex items-center gap-1.5 shadow-2xs active:scale-[0.98] ${
                  selectedPrompt?.id === prompt.id
                    ? "bg-teal-600 text-white border-teal-600 shadow-xs"
                    : "bg-card text-foreground border-border hover:border-teal-500/50 hover:bg-muted/40"
                }`}
              >
                <span>{prompt.label}</span>
                <ChevronRight className="h-3 w-3 shrink-0 opacity-70" />
              </button>
            ))}
          </div>
        </div>

        {/* Answer Display */}
        {(selectedPrompt || customAnswer || loading) && (
          <div className="p-4 rounded-xl bg-card border border-teal-200/80 dark:border-teal-800/60 shadow-xs animate-in fade-in duration-200 space-y-2">
            <div className="flex items-center justify-between text-xs text-teal-700 dark:text-teal-400 font-semibold border-b border-border/60 pb-2">
              <span className="flex items-center gap-1.5">
                <Bot className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                {loading ? "Synthesizing EMR data..." : "Clinical Copilot Response"}
              </span>
              {!loading && (
                <span className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Evidence Verified
                </span>
              )}
            </div>

            {loading ? (
              <div className="flex items-center gap-2 py-4 justify-center text-xs text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin text-teal-600 dark:text-teal-400" />
                Querying FastMCP & FHIR clinical repositories...
              </div>
            ) : (
              <p className="text-xs sm:text-sm leading-relaxed text-foreground">
                {customAnswer || selectedPrompt?.response}
              </p>
            )}
          </div>
        )}

        {/* Input Bar */}
        <div className="flex items-center gap-2 pt-1">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask DrGodly anything about your patients, schedule, or medications..."
            className="text-xs sm:text-sm h-10 bg-card border-border/80 focus-visible:ring-2 focus-visible:ring-teal-500 rounded-xl"
          />
          <Button
            size="sm"
            onClick={handleSend}
            disabled={!query.trim() || loading}
            className="dash-btn-primary h-10 px-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white shrink-0 shadow-xs active:scale-[0.97]"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
