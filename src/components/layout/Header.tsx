import React, { useState, useEffect } from 'react';
import { Search, Moon, Sun, Monitor, Menu, X, Sparkles, BookOpen, Layers, History, Bookmark, Award, HelpCircle, Volume2, VolumeX } from 'lucide-react';
import { ThemeMode } from '../../types';
import { soundEngine } from '../../engine/soundEngine';

interface HeaderProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  theme: ThemeMode;
  onToggleTheme: (mode: ThemeMode) => void;
  onOpenSearch: () => void;
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  theme,
  onToggleTheme,
  onOpenSearch,
  mobileMenuOpen,
  onToggleMobileMenu,
}) => {
  const [soundOn, setSoundOn] = useState<boolean>(() => soundEngine.isSoundEnabled());

  useEffect(() => {
    return soundEngine.subscribe((val) => setSoundOn(val));
  }, []);

  const handleTabClick = (tabId: string) => {
    soundEngine.playKeypadClick('fn');
    onSelectTab(tabId);
  };

  const handleToggleSound = () => {
    const next = soundEngine.toggleSound();
    setSoundOn(next);
  };
  return (
    <header id="calcrick-header" className="sticky top-0 z-40 w-full border-b border-neutral-800/80 bg-neutral-950/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand & Logo */}
        <div className="flex items-center gap-6">
          <button
            id="brand-logo-btn"
            onClick={() => onSelectTab('home')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700 text-white font-bold shadow-lg shadow-violet-900/30 group-hover:scale-105 transition-transform duration-200">
              <span className="font-mono text-lg font-extrabold tracking-tighter">CR</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight text-white group-hover:text-violet-300 transition-colors">CalcRick</span>
                <span className="rounded bg-violet-950/80 px-1.5 py-0.5 text-[10px] font-semibold text-violet-400 border border-violet-800/50">PRO</span>
              </div>
              <p className="text-[11px] text-neutral-400 hidden sm:block">Calculate. Convert. Master.</p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { id: 'home', label: 'Calculator', icon: Sparkles },
              { id: 'explore', label: 'All Tools', icon: Layers },
              { id: 'converters', label: 'Converters', icon: Sparkles },
              { id: 'graphing', label: 'Graphing', icon: Layers },
              { id: 'learn', label: 'Learn & Formulas', icon: BookOpen },
              { id: 'practice', label: 'Practice', icon: Award },
              { id: 'workspace', label: 'Scratchpad', icon: Layers },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`nav-link-${tab.id}`}
                  onClick={() => handleTabClick(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-neutral-800 text-violet-300 shadow-sm border border-neutral-700/60'
                      : 'text-neutral-300 hover:text-white hover:bg-neutral-900'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-violet-400' : 'text-neutral-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Global Search Bar & Actions */}
        <div className="flex items-center gap-2.5">
          {/* Quick Search Shortcut button */}
          <button
            id="global-search-trigger"
            onClick={() => {
              soundEngine.playKeypadClick('fn');
              onOpenSearch();
            }}
            className="flex items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-900/90 px-3 py-1.5 text-xs text-neutral-400 hover:border-neutral-700 hover:text-neutral-200 transition-colors shadow-inner"
            title="Search Calculators, Formulas & Rules (Ctrl+K)"
          >
            <Search className="h-3.5 w-3.5 text-neutral-400" />
            <span className="hidden sm:inline">Search anything...</span>
            <kbd className="hidden sm:inline-block rounded bg-neutral-800 px-1.5 py-0.5 text-[10px] font-mono text-neutral-300 border border-neutral-700">
              ⌘K
            </kbd>
          </button>

          {/* Sound FX Toggle button */}
          <button
            id="nav-btn-sound-toggle"
            onClick={handleToggleSound}
            className={`p-2 rounded-lg border transition-colors ${
              soundOn
                ? 'bg-neutral-900 text-violet-400 border-neutral-800 hover:border-neutral-700'
                : 'border-neutral-800 text-neutral-500 hover:text-white hover:bg-neutral-900'
            }`}
            title={soundOn ? 'Sound Effects Enabled (Click to Mute)' : 'Sound Effects Muted (Click to Enable)'}
          >
            {soundOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>

          {/* History Shortcut */}
          <button
            id="nav-btn-history"
            onClick={() => handleTabClick('history')}
            className={`p-2 rounded-lg border transition-colors ${
              currentTab === 'history'
                ? 'bg-neutral-800 text-violet-400 border-neutral-700'
                : 'border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
            title="Calculation History"
          >
            <History className="h-4 w-4" />
          </button>

          {/* Theme switcher */}
          <div className="flex items-center rounded-lg border border-neutral-800 bg-neutral-900 p-0.5">
            <button
              id="theme-btn-dark"
              onClick={() => {
                soundEngine.playKeypadClick('fn');
                onToggleTheme('dark');
              }}
              className={`p-1.5 rounded-md text-xs transition-colors ${
                theme === 'dark' ? 'bg-neutral-800 text-violet-300' : 'text-neutral-400 hover:text-neutral-200'
              }`}
              title="Dark Theme"
            >
              <Moon className="h-3.5 w-3.5" />
            </button>
            <button
              id="theme-btn-light"
              onClick={() => {
                soundEngine.playKeypadClick('fn');
                onToggleTheme('light');
              }}
              className={`p-1.5 rounded-md text-xs transition-colors ${
                theme === 'light' ? 'bg-neutral-800 text-violet-300' : 'text-neutral-400 hover:text-neutral-200'
              }`}
              title="Light Theme"
            >
              <Sun className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            id="mobile-menu-toggle"
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-900"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div id="mobile-menu-drawer" className="md:hidden border-b border-neutral-800 bg-neutral-950 px-4 py-3 space-y-1 animate-in fade-in duration-150">
          {[
            { id: 'home', label: 'Standard Calculator', icon: Sparkles },
            { id: 'explore', label: 'All 50+ Calculators', icon: Layers },
            { id: 'converters', label: 'Unit & Currency Converters', icon: Sparkles },
            { id: 'graphing', label: 'Graphing Calculator', icon: Layers },
            { id: 'learn', label: 'Formulas & Rules Library', icon: BookOpen },
            { id: 'practice', label: 'Practice & Mastery', icon: Award },
            { id: 'workspace', label: 'Multi-Line Scratchpad', icon: Layers },
            { id: 'history', label: 'Calculation History', icon: History },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                onClick={() => {
                  onSelectTab(item.id);
                  onToggleMobileMenu();
                }}
                className={`flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-neutral-800 text-violet-300'
                    : 'text-neutral-300 hover:bg-neutral-900 hover:text-white'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-violet-400' : 'text-neutral-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
