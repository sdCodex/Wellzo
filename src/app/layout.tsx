import { Analytics } from '@vercel/analytics/next'; 
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wellzo",
  description:
    "Wellzo – A modern online doctor consultation app, designed and built by Sujay Das.",
  icons:{
    icon:"/favicon.ico"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider >
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            enableSystem
            disableTransitionOnChange
          >
            {/* header */}
            <Header />
            <main className="min-h-screen">{children}</main>
            <Toaster richColors />
            {/* footer */}

            <footer className="bg-muted py-12">
              <div className="container mx-auto px-4 text-center">
                <p>Made with 💖 Sujay Das</p>
              </div>
            </footer>
          </ThemeProvider>
           <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
