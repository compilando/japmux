import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { TenantProvider } from "@/context/TenantContext";
import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { Toaster } from "react-hot-toast";
import HealthCheckWrapper from "@/components/layout/HealthCheckWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "JAPMUX",
  description: "JAPMUX - Sistema de Gestión",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <NotificationProvider>
            <HealthCheckWrapper>
              <ThemeProvider>
                <SidebarProvider>
                  <TenantProvider>
                    {children}
                    <Toaster position="bottom-right" reverseOrder={false} />
                  </TenantProvider>
                </SidebarProvider>
              </ThemeProvider>
            </HealthCheckWrapper>
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
