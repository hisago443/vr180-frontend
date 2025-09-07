import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Twitter, Facebook, Github, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border/60 bg-gradient-to-b from-background to-background/60">
      <div className="container py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-lg font-semibold">About</h3>
          <p className="mt-3 text-sm text-muted-foreground">
            VeroVR converts your 2D videos into immersive VR 180° experiences using advanced AI.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Resources</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/how-it-works" className="hover:text-foreground">How It Works</Link></li>
            <li><Link to="/api-docs" className="hover:text-foreground">API Docs</Link></li>
            <li><Link to="/support" className="hover:text-foreground">Support</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Legal</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-foreground">Terms</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Contact</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Mail className="size-4" /> support@verovr.ai</li>
            <li className="flex items-center gap-4 mt-2">
              <a href="#" aria-label="Twitter" className="hover:text-foreground"><Twitter className="size-5" /></a>
              <a href="#" aria-label="Facebook" className="hover:text-foreground"><Facebook className="size-5" /></a>
              <a href="#" aria-label="Github" className="hover:text-foreground"><Github className="size-5" /></a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="container py-6 text-xs text-muted-foreground flex flex-col md:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} VeroVR Inc. All rights reserved.</p>
          <p>Built for Quest, Vision Pro, and modern browsers.</p>
        </div>
      </div>
    </footer>
  );
}
