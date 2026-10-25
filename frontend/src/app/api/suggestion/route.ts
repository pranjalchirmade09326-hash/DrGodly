/**
 * /api/suggestion — proxy to the doctor-assistant AI agent.
 *
 * Called by the Suggestion component during a live consultation.
 * Forwards { conversation: string[] } to DOCTOR_ASSISTANT_AGENT_URL and
 * returns { questions: string[] } from the upstream agent.
 *
 * Required env vars:
 *   DOCTOR_ASSISTANT_AGENT_URL  — upstream Python doctor-assistant agent
 *   BETTER_AUTH_URL             — used by getAuthToken to obtain a bearer token
 */

import { NextRequest, NextResponse } from "next/server";
import { getAuthToken } from "@/modules/server/auth/jwt-token";

/**
 * Proxies the conversation to the doctor-assistant agent and returns suggested questions.
 *
 * @param req - POST body: { conversation: string[] }
 * @returns JSON { questions: string[] } from the upstream agent.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const conversation: string[] = Array.isArray(body?.conversation) ? body.conversation : [];

    const agentUrl = process.env.DOCTOR_ASSISTANT_AGENT_URL;

    // Try upstream agent if configured
    if (agentUrl && !agentUrl.includes("your_")) {
      try {
        const token = await getAuthToken().catch(() => null);
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const upstream = await fetch(agentUrl, {
          method: "POST",
          headers,
          body: JSON.stringify(body),
          signal: AbortSignal.timeout(4000),
        });

        if (upstream.ok) {
          const data = await upstream.json();
          if (Array.isArray(data?.questions) && data.questions.length > 0) {
            return NextResponse.json(data);
          }
        }
      } catch {
        // Fall back to built-in CDS generation
      }
    }

    // ── Built-in Clinical Decision Support (CDS) Intelligence Fallback ──
    const textContext = conversation.join(" ").toLowerCase();
    const questions: string[] = [];

    if (textContext.includes("chest") || textContext.includes("heart") || textContext.includes("palpitat")) {
      questions.push("Does the chest discomfort radiate to your jaw, neck, back, or left arm?");
      questions.push("Does the pain intensify with exertion, or change when you take a deep breath or change positions?");
      questions.push("Have you felt lightheaded, clammy, or experienced shortness of breath alongside this?");
    } else if (textContext.includes("headache") || textContext.includes("head") || textContext.includes("migraine")) {
      questions.push("Is the headache throbbing or pressing, and is it worse on one side of your head?");
      questions.push("Are you noticing sensitivity to light (photophobia), sound, nausea, or visual aura?");
      questions.push("Did this headache onset suddenly like a 'thunderclap', or build up gradually?");
    } else if (textContext.includes("cough") || textContext.includes("breath") || textContext.includes("throat") || textContext.includes("fever") || textContext.includes("cold")) {
      questions.push("Is your cough dry or productive, and if productive, what color is the phlegm?");
      questions.push("Have you monitored your temperature with a thermometer, and have you had chills or body aches?");
      questions.push("Are you having any wheezing, difficulty speaking in full sentences, or shortness of breath at rest?");
    } else if (textContext.includes("stomach") || textContext.includes("abdom") || textContext.includes("vomit") || textContext.includes("diarrhea") || textContext.includes("nausea")) {
      questions.push("Where exactly is the pain located (upper right, lower right, diffuse), and does it worsen after eating?");
      questions.push("Have you noticed any blood in your stool, dark tarry stools, or persistent vomiting?");
      questions.push("When did you last have a bowel movement, and have you had any recent dietary changes?");
    } else {
      questions.push("How long have these symptoms been present, and have they been progressively worsening or intermittent?");
      questions.push("Have you taken any medications or tried any remedies, and did they give you any relief?");
      questions.push("Are you currently taking any prescription medications, vitamins, or do you have known drug allergies?");
    }

    return NextResponse.json({ questions });
  } catch (err: unknown) {
    console.error("[suggestion] error:", err);
    return NextResponse.json({
      questions: [
        "How long have you noticed these symptoms, and are they getting progressively worse?",
        "Have you taken any over-the-counter medications or remedies for relief?",
        "Do you have any existing chronic medical conditions or known drug allergies?",
      ],
    });
  }
}
