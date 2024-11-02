import '../globals.css';
import type { Metadata } from 'next';
import { Inter, Vazirmatn } from 'next/font/google';
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import AuthProvider from "@/components/auth-provider";
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';

const inter = Inter({ subsets: ['latin'] });
const vazirmatn = Vazirmatn({ subsets: ['arabic'] });

export const metadata: Metadata = {
  title: 'CRM System',
  description: 'Modern CRM system built with Next.js',
};

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'fa' }];
}

export default async function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <html lang={locale} dir={locale === 'fa' ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <body className={locale === 'fa' ? vazirmatn.className : inter.className}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster />
            </ThemeProvider>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}