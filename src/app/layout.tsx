import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gemelo Digital - Shelly DW2",
  description: "Visualización 3D en tiempo real del sensor Shelly Door/Window 2 via MQTT",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Suprimir error de React DevTools
              window.addEventListener('error', function(e) {
                if (e.message?.includes('Invalid argument not valid semver')) {
                  e.stopImmediatePropagation();
                  e.preventDefault();
                }
              });
              
              // Suprimir warnings de consola específicos
              const originalError = console.error;
              console.error = function(...args) {
                if (args[0]?.includes?.('Invalid argument not valid semver')) {
                  return;
                }
                originalError.apply(console, args);
              };
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
