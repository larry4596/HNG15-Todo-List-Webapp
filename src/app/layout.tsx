import "./globals.css"
import { TodoProvider } from "@/lib/store"
import { ThemeProvider } from "@/lib/theme"
import { Inter } from "next/font/google"

const inter = Inter({ weight: ["300", "400", "500", "600", "700"] })

export const metadata = {
  title: "HNG15 Todo List",
  description: "A modern Todo list app built with Next.js 15, TypeScript, Tailwind CSS, and Zustand",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen">
        <ThemeProvider>
          <TodoProvider>{children}</TodoProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}