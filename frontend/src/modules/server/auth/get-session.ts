import { headers } from "next/headers";
import { AuthResponse } from "./types";

export async function getServerSession(): Promise<AuthResponse | null> {
  const hdrs = await headers();
  const cookie = hdrs.get("cookie") || "";

  try {
    const authUrl = process.env.NEXT_PUBLIC_BETTER_AUTH_URL || process.env.BETTER_AUTH_URL;
    if (!authUrl || authUrl.includes("your_")) return null;

    const res = await fetch(
      `${authUrl}/api/auth/get-session`,
      {
        headers: { cookie },
        cache: "no-store",
        signal: AbortSignal.timeout(3000),
      },
    );

    if (!res.ok) return null;

    return res.json();
  } catch {
    return null;
  }
}
