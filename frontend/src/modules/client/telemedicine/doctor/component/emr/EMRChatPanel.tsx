/**
 * EMRChatPanel — two-tab panel used on the Doctor EMR page.
 *
 * Layer : Client — telemedicine / doctor / emr
 * Role  : Top-level layout component for the doctor's AI-powered EMR workspace.
 *         Provides a header bar with an inline tab toggle that switches between:
 *
 *           "AI Chat"    — the A2UIChat component, lazily loaded to keep the
 *                          initial page bundle small. Enables conversational
 *                          clinical workflows backed by FHIR tool calls.
 *
 *           "UI Browser" — UISchemaPreview, a browsable catalogue of every
 *                          A2UI schema in the registry, grouped by FHIR resource
 *                          type. Useful for inspecting forms/cards before using
 *                          them in a live session.
 *
 * Height: calc(100vh - 156px) to fill the app shell below the navbar/breadcrumb.
 */

"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Bot, LayoutGrid, Sparkles, Activity, ShieldCheck, Database } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { UISchemaPreview } from "./UISchemaPreview";

/**
 * A2UIChat is dynamically imported to avoid including the heavy AI chat bundle
 * in the initial page JS. The `ssr: false` flag prevents a hydration mismatch
 * because A2UIChat depends on browser-only APIs (local storage, Web Audio, etc.).
 */
const A2UIChatPage = dynamic(
  () => import("@/modules/client/ai-hub/components/A2UIChat"),
  {
    ssr: false,
    loading: () => (
      <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
        Loading AI Assistant…
      </div>
    ),
  },
);

interface EMRChatPanelProps {
  /** The portal role — drives the subtitle copy shown in the header. */
  role: "doctor" | "patient";
}

/**
 * EMRChatPanel component.
 *
 * Renders the shared AI EMR workspace used by the doctor portal.
 * The active tab is local state — no URL param or global store needed.
 *
 * @param props.role - "doctor" (clinical mode) or "patient" (patient-facing copy).
 */
export function EMRChatPanel({ role }: EMRChatPanelProps) {
  const [tab, setTab] = useState<"chat" | "preview">("chat");

  return (
    <div className="flex flex-col w-full h-[calc(100vh-156px)]">
      {/* ── Header with tab toggle ── */}
      <div className="flex items-center justify-between px-6 py-3 border-b bg-white shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-slate-900 leading-tight">EMR Intelligence Assistant</p>
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[11px] font-semibold py-0">
                FastMCP :8002 Live
              </Badge>
              <Badge className="bg-teal-50 text-teal-700 border-teal-200 text-[11px] font-semibold py-0">
                FHIR R4 Core
              </Badge>
            </div>
            <p className="text-xs text-slate-500 leading-tight mt-0.5">
              {role === "doctor"
                ? "Autonomous Clinical Workflow Engine — Grounded in Patient EHR & ABHA"
                : "Your verified health records — ask anything about your diagnosis, meds, or care"}
            </p>
          </div>
        </div>

        {/* Pill-style tab toggle */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1 border border-slate-200/60">
            <button
              onClick={() => setTab("chat")}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                tab === "chat"
                  ? "bg-white text-slate-900 shadow-2xs font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Bot className="h-3.5 w-3.5 text-teal-600" />
              Clinical AI Chat
            </button>
            <button
              onClick={() => setTab("preview")}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                tab === "preview"
                  ? "bg-white text-slate-900 shadow-2xs font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5 text-teal-600" />
              A2UI Schema Registry
            </button>
          </div>
        </div>
      </div>

      {/* ── Clinical Intelligence Prompt Shortcut Ribbon ── */}
      {tab === "chat" && (
        <div className="px-6 py-2 bg-slate-50/80 border-b border-slate-200/80 flex items-center gap-2 overflow-x-auto text-xs shrink-0">
          <span className="font-semibold text-slate-600 flex items-center gap-1 shrink-0 text-[11px]">
            <Sparkles className="size-3.5 text-teal-600" />
            Clinical Prompts:
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700 font-medium text-[11px] shrink-0">
            Show Encounter History
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700 font-medium text-[11px] shrink-0">
            Check RxNorm Interactions
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700 font-medium text-[11px] shrink-0">
            Synthesize Lab Panels (HbA1c/Lipids)
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700 font-medium text-[11px] shrink-0">
            Draft SOAP Progress Note
          </span>
        </div>
      )}

      {/* ── Body: swap between tabs without unmounting the inactive one ── */}
      {/* Note: conditional rendering (not hidden) — A2UIChat resets on tab switch,
          which is intentional so each new chat session starts fresh.            */}
      <div className="flex flex-1 min-h-0 w-full">
        {tab === "chat" ? <A2UIChatPage /> : <UISchemaPreview />}
      </div>
    </div>
  );
}
