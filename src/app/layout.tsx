import { Outfit } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { NotificationProvider } from '@/context/NotificationContext';
import HealthCheckWrapper from '@/components/layout/HealthCheckWrapper';

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <AuthProvider>
          <NotificationProvider>
            <HealthCheckWrapper>
              <ThemeProvider>
                <SidebarProvider>{children}</SidebarProvider>
              </ThemeProvider>
            </HealthCheckWrapper>
            <Toaster position="bottom-right" reverseOrder={false} />
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
