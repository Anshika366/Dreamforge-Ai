import Link from "next/link";
import { Terminal, Globe, Layers } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-background py-8 md:py-12 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Terminal className="h-6 w-6 text-primary-light" />
              <span className="font-display text-lg font-bold text-white">
                DreamForge <span className="text-secondary-light">AI</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm">
              Convert business documents, project specifications, and logs into fully interactive fantasy worlds with dynamic lore, quests, characters, and boss encounters.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white font-display uppercase tracking-wider">Application</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/" className="hover:text-white transition-colors duration-200">Home</Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors duration-200">Dashboard</Link>
              </li>
              <li>
                <Link href="/upload" className="hover:text-white transition-colors duration-200">Upload Portal</Link>
              </li>
            </ul>
          </div>

          {/* Contact / Socials */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white font-display uppercase tracking-wider">Connect</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-white transition-colors duration-200">
                <Globe className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors duration-200">
                <Terminal className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors duration-200">
                <Layers className="h-5 w-5" />
              </a>
            </div>
            <p className="text-xs text-slate-500 pt-2">
              Build your adventure from documents.
            </p>
          </div>

        </div>

        <div className="border-t border-white/5 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} DreamForge AI. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-slate-300">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
