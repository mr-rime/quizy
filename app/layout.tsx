import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from 'sonner';
import "./globals.css";


const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
    fallback: ["system-ui", "arial"],
    display: "swap",
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
    fallback: ["ui-monospace", "monospace"],
    display: "swap",
});

export const viewport: Viewport = {
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#ffffff" },
        { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
    ],
};

export const metadata: Metadata = {
    title: {
        default: "Quizy - Create & Play Interactive Quizzes",
        template: "%s | Quizy"
    },
    description: "Quizy is a modern quiz platform that lets you create, share, and play interactive quizzes instantly.",
    keywords: [
        "quiz app",
        "online quizzes",
        "interactive quiz",
        "Quizy",
        "create quizzes",
        "education",
        "learning tools",
        "english",
        "programming"
    ],
    authors: [{ name: "Quizy Team" }],
    creator: "Quizy",

    metadataBase: new URL("https://quizy-eg.vercel.app"),

    alternates: {
        canonical: "https://quizy-eg.vercel.app",
    },

    openGraph: {
        type: "website",
        url: "https://quizy-eg.vercel.app",
        title: "Quizy - Create & Play Interactive Quizzes",
        description: "Create quizzes, share them, and play with friends using Quizy.",
        siteName: "Quizy",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "Quizy - Build and Play Quizzes"
            }
        ],
    },

    twitter: {
        card: "summary_large_image",
        title: "Quizy - Create & Play Interactive Quizzes",
        description: "Build your own quizzes and play instantly.",
        images: ["/og-image.png"],
        creator: "@quizy",
    },

    icons: {
        icon: "/autism.ico",
        shortcut: "/autism.ico",
        apple: "/autism.ico"
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                    <Toaster position="top-right" richColors closeButton />
                </ThemeProvider>
            </body>
        </html>
    );
}
