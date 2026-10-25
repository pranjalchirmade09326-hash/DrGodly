import { headers } from "next/headers";

export async function getAuthToken(): Promise<string> {
  const hdrs = await headers();
  // Only forward the session cookie — forwarding all browser headers causes
  // undici to fail with "fetch failed" due to forbidden headers (connection,
  // content-length, etc.) being present in the incoming request.
  const cookie = hdrs.get("cookie") ?? "";

  try {
    const betterAuthUrl = process.env.BETTER_AUTH_URL;
    if (betterAuthUrl && !betterAuthUrl.includes("your_")) {
      const res = await fetch(`${betterAuthUrl}/api/auth/token`, {
        method: "GET",
        headers: { cookie },
        cache: "no-store",
        signal: AbortSignal.timeout(3000),
      });

      if (res.ok) {
        const data = await res.json();
        const token: string | undefined = data.token ?? data.jwt ?? data.access_token;
        if (token) return token;
      }
    }
  } catch {
    // BetterAuth service unreachable
  }

  // Safe fallback dev token for local execution
  return "dev-local-jwt-token";
}
