import { Button } from "@/components/ui/button";
import { BookOpen, LogIn, LogOut, ShieldCheck } from "lucide-react";
import type { Page } from "../App";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface NavbarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

export default function Navbar({ currentPage, setCurrentPage }: NavbarProps) {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const isLoggedIn = loginStatus === "success" && !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/90 backdrop-blur-md shadow-xs">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          type="button"
          onClick={() => setCurrentPage("home")}
          data-ocid="nav.home_link"
          className="flex items-center gap-2.5 group"
        >
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
            <BookOpen className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-xl text-foreground tracking-tight">
            Study<span className="text-accent">Vault</span>
          </span>
        </button>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          <button
            type="button"
            onClick={() => setCurrentPage("home")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentPage === "home"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            Browse All
          </button>
          <button
            type="button"
            onClick={() => setCurrentPage("home")}
            className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            JEE
          </button>
          <button
            type="button"
            onClick={() => setCurrentPage("home")}
            className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            NEET
          </button>
        </div>

        {/* Admin Button */}
        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage("admin")}
                data-ocid="nav.admin_link"
                className={`gap-2 ${
                  currentPage === "admin" ? "bg-primary/10 text-primary" : ""
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                Admin
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={clear}
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              onClick={login}
              disabled={isLoggingIn}
              data-ocid="nav.admin_link"
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <LogIn className="w-4 h-4" />
              {isLoggingIn ? "Signing in..." : "Admin Login"}
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
}
