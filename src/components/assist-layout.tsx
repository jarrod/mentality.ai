import { UserButton } from "@clerk/tanstack-react-start"
import { Link } from "@tanstack/react-router"
import { Wind } from "lucide-react"

/**
 * Friendly website-style layout for the Assist area.
 * No dashboard sidebar — simple header + content for authenticated users.
 */
export function AssistLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Link to="/assist" className="flex items-center gap-2 font-medium">
          <Wind className="h-5 w-5" />
          <span>Assist</span>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}
