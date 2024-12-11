import { TopicProvider } from "@/contexts/TopicContext";
import { Navigation } from "@/components/Navigation";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <TopicProvider>
            <Navigation />
            {children}
            <Toaster />
          </TopicProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
