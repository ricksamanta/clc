import React from 'react';
import { Mail, Heart, Sparkles, Shield, Cpu, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer id="calcrick-footer" className="w-full border-t border-neutral-850 bg-neutral-950/90 py-10 text-neutral-400 mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Brand & Mission */}
          <div className="text-center md:text-left space-y-1.5">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="font-bold text-base text-neutral-200 tracking-tight">CalcRick</span>
              <span className="text-xs text-neutral-500">•</span>
              <span className="text-xs text-violet-400 font-medium tracking-wide uppercase">Calculate. Convert. Understand. Master.</span>
            </div>
            <p className="text-xs text-neutral-400 max-w-md">
              A deterministic, high-precision calculation and learning platform designed to explain every answer with mathematical rigor.
            </p>
          </div>

          {/* Creator Details */}
          <div className="flex flex-col items-center md:items-end gap-1.5 text-xs text-neutral-400">
            <div className="flex items-center gap-1.5 text-neutral-300">
              <span>Created by</span>
              <span className="font-semibold text-white">Rick Samanta</span>
            </div>
            <div className="flex items-center gap-2">
              <a
                id="footer-email-link"
                href="mailto:ricksamantaz@proton.me"
                className="flex items-center gap-1 text-violet-400 hover:text-violet-300 transition-colors"
              >
                <Mail className="h-3 w-3" />
                <span>ricksamantaz@proton.me</span>
              </a>
              <span>•</span>
              <span className="text-neutral-400">Version 2.4 Pro</span>
            </div>
          </div>
        </div>

        {/* Feature Badges */}
        <div className="mt-8 pt-6 border-t border-neutral-900 flex flex-wrap items-center justify-center gap-6 text-[11px] text-neutral-400">
          <div className="flex items-center gap-1.5">
            <Shield className="w-3 h-3 text-emerald-400" />
            <span>100% Deterministic Source-of-Truth</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Cpu className="w-3 h-3 text-violet-400" />
            <span>Zero Unsafe eval() Execution</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Educational Step-by-Step Breakdown</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
