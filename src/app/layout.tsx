import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { EmergencyBanner } from "@/components/layout/emergency-banner";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { GlobalNavbar } from "@/components/layout/global-navbar";
import { Footer } from "@/components/layout/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MediConnect — Unified Digital Healthcare Platform",
  description:
    "Integrated healthcare system connecting patients, verified doctors, accredited hospitals, and administrators.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col bg-background text-foreground antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <EmergencyBanner />
          <div className="flex-1 flex flex-row min-h-screen">
            <AppSidebar />
            <div className="flex-1 flex flex-col min-w-0">
              <GlobalNavbar />
              <main className="flex-1 flex flex-col">{children}</main>
              <Footer />
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
