"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Shield, KeyRound, Mail, ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Set cookie to indicate authentication status
    document.cookie = "dreamforge_logged_in=true; path=/; max-age=86400; SameSite=Lax";

    // Simulate login verification delay
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
      router.refresh();
    }, 1500);
  };

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center px-4 overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-secondary/10 rounded-full blur-3xl -z-10" />

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border border-white/5 bg-slate-950/40 backdrop-blur-md shadow-2xl p-2">
          
          <CardHeader className="text-center pb-2">
            <Link href="/" className="inline-flex items-center justify-center gap-2 mb-4 group">
              <Sparkles className="h-6 w-6 text-primary-light group-hover:rotate-12 transition-transform" />
              <span className="font-display font-black text-xl text-white tracking-wider uppercase">
                DreamForge AI
              </span>
            </Link>
            <CardTitle className="text-xl text-white font-display">
              Access the Reality Forge
            </CardTitle>
            <CardDescription className="text-slate-400 text-xs mt-1">
              Enter your scribing credentials or connect via Guild Pass to manage your simulations.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6">
            <form onSubmit={handleLogin} className="space-y-4">
              
              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
                  <Mail className="h-3 w-3 text-primary-light" /> Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="scribe@dreamforge.ai"
                    className="w-full bg-slate-950 border border-white/5 focus:border-primary/50 text-white text-xs rounded-lg pl-3.5 pr-3.5 py-2.5 outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
                    <KeyRound className="h-3 w-3 text-secondary-light" /> Password
                  </label>
                  <a href="#" className="text-[10px] text-slate-500 hover:text-white transition-colors font-mono">
                    Forgot Key?
                  </a>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-950 border border-white/5 focus:border-primary/50 text-white text-xs rounded-lg pl-3.5 pr-3.5 py-2.5 outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Submit button */}
              <Button
                type="submit"
                isLoading={isLoading}
                variant="glow"
                className="w-full py-2.5 text-xs font-bold uppercase tracking-wider gap-2 mt-6"
              >
                Sign In <ArrowRight className="h-4 w-4" />
              </Button>

            </form>

            {/* Guild Pass divider */}
            <div className="relative my-6 text-center">
              <hr className="border-white/5" />
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-950 px-3 text-[9px] font-mono text-slate-500 tracking-wider">
                OR SELECT GUILD METHOD
              </span>
            </div>

            {/* Guild Pass OAuth Button */}
            <Button
              onClick={handleLogin}
              disabled={isLoading}
              variant="outline"
              className="w-full py-2.5 text-xs font-bold uppercase tracking-wider gap-2 border-white/5 hover:border-primary/20 bg-white/5 text-white"
            >
              <Shield className="h-4 w-4 text-accent" /> Connect Guild Pass
            </Button>
          </CardContent>

        </Card>
      </motion.div>
    </div>
  );
}
