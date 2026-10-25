/**
 * Auth layout — shared wrapper for authentication pages.
 * Supports both full-bleed split panels (login/signup) and centered card flows.
 */

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-svh w-full bg-background flex flex-col justify-center">
      {children}
    </div>
  );
}
