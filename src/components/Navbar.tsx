"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Sparkles, Terminal } from "lucide-react";
import { Button } from "./ui/button";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const logged = document.cookie.includes("dreamforge_logged_in=true");
      setIsLoggedIn(logged);
    };

    checkAuth();
    const interval = setInterval(checkAuth, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSignOut = () => {
    document.cookie = "dreamforge_logged_in=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    setIsLoggedIn(false);
    router.push("/login");
    router.refresh();
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary p-[1px] group-hover:scale-105 transition-transform duration-200">
            <div className="flex h-full w-full items-center justify-center rounded-lg bg-background">
              <Terminal className="h-5 w-5 text-primary-light group-hover:text-white transition-colors duration-200" />
            </div>
          </div>
          <span className="font-display text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-primary-light bg-clip-text text-transparent">
            DreamForge <span className="text-secondary-light">AI</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <Link 
            href="/" 
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              isActive('/') 
                ? 'text-white bg-white/5' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Home
          </Link>
          <Link 
            href="/dashboard" 
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              isActive('/dashboard') 
                ? 'text-white bg-white/5' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Dashboard
          </Link>
          <Link 
            href="/upload" 
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              isActive('/upload') 
                ? 'text-white bg-white/5' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Forge World
          </Link>
        </nav>

        {/* Action Button */}
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              <Button variant="outline" size="sm" onClick={handleSignOut} className="hidden sm:flex">
                Sign Out
              </Button>
              <Link href="/upload">
                <Button variant="glow" size="sm" className="hidden sm:flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-accent" />
                  Create World
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleSignOut} className="sm:hidden">
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline" size="sm" className="hidden sm:flex">
                  Sign In
                </Button>
              </Link>
              <Link href="/login" className="sm:hidden">
                <Button variant="outline" size="sm">Sign In</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
