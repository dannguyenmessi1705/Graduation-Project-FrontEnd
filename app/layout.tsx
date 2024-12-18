import { TopicProvider } from "@/contexts/TopicContext";
import { Navigation } from "@/components/Navigation";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import ThemeProvider from "@/components/ThemeProvider";
import "./globals.css";

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
                <Navigation />
                <main className="container mx-auto grow px-4 py-8 sm:px-6 lg:px-8">
                  {children}
                </main>
                <Toaster />
              </div>
            </TopicProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
