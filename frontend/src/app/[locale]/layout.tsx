import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import NextTopLoader from "nextjs-toploader";
import { ThemeProvider } from "@/theme/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/providers/QueryProvider";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:4000"),
  title: {
    default: "DrGodly",
    template: "%s | DrGodly",
  },
  description: "Your personal health companion",
  applicationName: "DrGodly",
};

export const viewport: Viewport = {
  themeColor: "#102F2A",
};

/*
 * Brand typography. These expose the Geist families as the --font-geist-sans /
 * --font-geist-mono custom properties that globals.css aliases to Tailwind's
 * --font-sans / --font-mono tokens, so `font-sans` (applied on <body> below and
 * on every marketing/auth screen) actually resolves. Without this wiring the
 * var() chain is invalid at computed-value time and the whole app silently
 * falls back to the UA serif face.
 */
const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body
        className="font-sans antialiased"
        suppressHydrationWarning
      >
        <ThemeProvider>
          <QueryProvider>
            <NextIntlClientProvider>
              <TooltipProvider>{children}</TooltipProvider>
            </NextIntlClientProvider>
            <Toaster />
            <NextTopLoader showSpinner={false} color="var(--progress-bar)" />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
