/**
 * Legal page — Terms of Service and Privacy Policy summaries.
 *
 * Route: /[locale]/(marketing)/legal
 *
 * Exists so the Terms / Privacy links in the marketing footer and on the
 * login and sign-up screens resolve to a real destination instead of the
 * dead href="#" placeholders they pointed at before.
 *
 * The copy below is a product-level summary. Final agreements are issued to
 * each practice and patient at onboarding, which the page states plainly
 * rather than pretending this placeholder text is a binding contract.
 */

import { getServerSession } from "@/modules/server/auth/get-session";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Scale, Lock, Database } from "lucide-react";
import RootNavbar from "@/modules/client/(marketing)/components/RootNavbar";
import Footer from "@/modules/client/(marketing)/components/Footer";

export const dynamic = "force-dynamic";

const TERMS_SECTIONS = [
  {
    id: "use",
    title: "1. Acceptable use of the platform",
    body: "DrGodly provides clinical documentation, care-continuity and telemedicine tooling for licensed providers and the patients they treat. The platform is not an emergency service: if you are experiencing a medical emergency, contact local emergency services. Clinical judgement remains the responsibility of the licensed provider; AI-generated drafts, differentials and summaries are decision support that must be reviewed before use.",
  },
  {
    id: "accounts",
    title: "2. Accounts and access",
    body: "Each account is for a single named individual. Practitioner accounts are verified against the registration authority cited at sign-up. Credentials must not be shared, and organizations remain responsible for the activity performed under their seats.",
  },
  {
    id: "clinical",
    title: "3. Clinical records and retention",
    body: "Records are authored against HL7 FHIR R4 resources. Retention, disclosure and amendment follow the rules of the provider's jurisdiction and the applicable medical records policy. Deleting a DrGodly account does not by itself delete records a provider is legally required to retain.",
  },
  {
    id: "ai",
    title: "4. AI-assisted features",
    body: "AI agents draft intake summaries, SOAP notes and assessment plans. Outputs are stored as generated, attributed to the model version, and are marked as unreviewed until a clinician accepts them. Model providers are bound by business associate agreements where protected health information is processed.",
  },
  {
    id: "availability",
    title: "5. Service changes and availability",
    body: "Features may evolve and scheduled maintenance is announced in advance where practical. Uptime commitments for a specific practice are documented in its service agreement.",
  },
];

const PRIVACY_SECTIONS = [
  {
    id: "data",
    title: "1. What we process",
    body: "Account details you provide, the clinical content of encounters your care team records, device identifiers and connection logs used for security, and usage metadata that helps us measure whether documentation features are working.",
  },
  {
    id: "legal-basis",
    title: "2. Why we are allowed to",
    body: "Health information is processed for treatment and health-care operations under HIPAA, and under ABDM consent artifacts where a patient records through India's national framework. Marketing analytics are the only category kept outside the clinical record and are opt-in.",
  },
  {
    id: "sharing",
    title: "3. Who sees it",
    body: "Your care team, and anyone you explicitly share a record with through a time-boxed access link. Infrastructure and model vendors act as business associates under signed agreements and are prohibited from using protected information to train general-purpose models.",
  },
  {
    id: "security",
    title: "4. How it is protected",
    body: "TLS 1.2+ in transit, AES-256 at rest, role-scoped access, audit logging on every record read and write, and least-privilege operations access. Session tokens rotate and are verified against the identity provider rather than stored locally.",
  },
  {
    id: "rights",
    title: "5. Your rights",
    body: "Access, correction, deletion where lawful, an accounting of disclosures, and a machine-readable export of your records. Requests are handled by your practice's privacy officer, and the platform exposes the underlying data so the export does not depend on us.",
  },
];

function SectionColumn({
  id,
  eyebrow,
  title,
  intro,
  items,
}: {
  id: string;
  eyebrow: string;
  title: string;
  intro: string;
  items: { id: string; title: string; body: string }[];
}) {
  return (
    <section id={id} className="scroll-mt-28 pt-12">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          {eyebrow}
        </p>
        <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          {title}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">{intro}</p>
      </div>

      <Accordion
        type="multiple"
        className="mt-8 max-w-3xl border-b border-border"
        defaultValue={items.slice(0, 1).map((item) => item.id)}
      >
        {items.map((item) => (
          <AccordionItem key={item.id} value={item.id} className="border-border">
            <AccordionTrigger className="text-left text-base font-semibold hover:no-underline hover:text-primary py-5">
              {item.title}
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-sm leading-relaxed text-muted-foreground pb-5">{item.body}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

/** Public Terms of Service and Privacy Policy page. */
export default async function LegalPage() {
  const session = await getServerSession();

  return (
    <>
      <RootNavbar session={session} />
      <main className="pt-28 sm:pt-36 pb-20 min-h-dvh bg-gradient-to-b from-background via-muted/25 to-background">
        <div className="max-w-[110rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Badge variant="outline" className="text-[11px] border-primary/30 text-primary">
              Last reviewed January 2026
            </Badge>
            <h1 className="mt-5 text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
              Terms &amp; Privacy
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              A plain-language summary of the agreement between you, your care
              team and the DrGodly platform. The complete, jurisdiction-specific
              agreements are issued to each practice and patient at onboarding;
              this page is the readable version, not a substitute for them.
            </p>
          </div>

          <div className="mt-10 max-w-3xl grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: Scale,
                label: "Clinical accountability",
                detail: "Providers own every documented decision",
              },
              {
                icon: Lock,
                label: "Minimum necessary",
                detail: "Access scoped to your role and relationship",
              },
              {
                icon: Database,
                label: "Portability",
                detail: "FHIR R4 export, no lock-in",
              },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.label}
                  className="rounded-2xl border border-border bg-card p-5 shadow-sm"
                >
                  <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
                    <Icon className="size-5 text-primary" />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-foreground">{card.label}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {card.detail}
                  </p>
                </div>
              );
            })}
          </div>

          <SectionColumn
            id="terms"
            eyebrow="Agreement"
            title="Clinical Terms of Service"
            intro="What you agree to when you create an account and document care through DrGodly."
            items={TERMS_SECTIONS}
          />

          <SectionColumn
            id="privacy"
            eyebrow="Data"
            title="Privacy Policy"
            intro="How protected health information is collected, used, disclosed and safeguarded."
            items={PRIVACY_SECTIONS}
          />

          <section className="mt-16 max-w-3xl rounded-2xl border border-border bg-card p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
                <ShieldCheck className="size-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-card-foreground">
                  Questions about your records?
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Requests to access, correct or export your health information
                  go to the privacy officer of the practice that created them —
                  they hold the treatment relationship and can act on your
                  behalf immediately. Security and compliance documentation,
                  including the HIPAA business associate agreement, is
                  summarized on the security page.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-[11px]">
                    HIPAA
                  </Badge>
                  <Badge variant="outline" className="text-[11px]">
                    ABDM
                  </Badge>
                  <Badge variant="outline" className="text-[11px]">
                    ISO 27001
                  </Badge>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
