import { TopicProvider } from "@/contexts/TopicContext";
import { Navigation } from "@/components/Navigation";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import ThemeProvider from "@/components/ThemeProvider";
import "./globals.css";
import { BottomNavigation } from "@/components/BottomNavigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "ZForum",
    template: "%s - ZForum",
  },
  description: "A community forum for everyone.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <TopicProvider>
              <div className="flex min-h-screen flex-col">
                <Navigation className="fixed inset-x-0 top-0 z-50" />
                <main className="container mx-auto my-16 flex-1 overflow-y-auto px-4 py-8 sm:px-6 lg:px-8">
                  {children}
                </main>
                <BottomNavigation className="fixed inset-x-0 bottom-0 z-50" />
                <Toaster />
              </div>
            </TopicProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
