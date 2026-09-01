// Web Audio API Synthesizer for subtle tactile auditory feedback

class SoundEngine {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;
  private listeners: Set<(enabled: boolean) => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('calcrick_sound_enabled');
        this.enabled = saved !== null ? saved === 'true' : true;
      } catch {
        this.enabled = true;
      }
    }
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public isSoundEnabled(): boolean {
    return this.enabled;
  }

  public setSoundEnabled(enabled: boolean): void {
    this.enabled = enabled;
    try {
      localStorage.setItem('calcrick_sound_enabled', String(enabled));
    } catch {
      // ignore
    }
    this.listeners.forEach(fn => fn(enabled));
  }

  public toggleSound(): boolean {
    const next = !this.enabled;
    this.setSoundEnabled(next);
    if (next) {
      this.playKeypadClick('fn');
    }
    return next;
  }

  public subscribe(listener: (enabled: boolean) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Subtle mechanical / tactile keypad click
   */
  public playKeypadClick(type: 'num' | 'op' | 'fn' | 'delete' | 'clear' | 'memory' | 'equals' = 'num'): void {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    if (type === 'clear') {
      // Soft downward sweep
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(550, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.05);

      gain.gain.setValueAtTime(0.035, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.055);
      return;
    }

    if (type === 'delete') {
      // Deeper tactile click
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(380, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.025);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.03);
      return;
    }

    if (type === 'memory') {
      // Double micro tap
      [0, 0.04].forEach((offset, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(idx === 0 ? 950 : 1250, now + offset);
        gain.gain.setValueAtTime(0.025, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.02);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + offset);
        osc.stop(now + offset + 0.025);
      });
      return;
    }

    // Standard types
    let freq = 820;
    let duration = 0.02;
    let peakGain = 0.025;

    if (type === 'op') {
      freq = 1100;
      peakGain = 0.03;
      duration = 0.025;
    } else if (type === 'fn') {
      freq = 1350;
      peakGain = 0.025;
      duration = 0.022;
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.7, now + duration);

    gain.gain.setValueAtTime(peakGain, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration + 0.005);
  }

  /**
   * Harmonious warm success chime on calculation completion
   */
  public playSuccessChime(): void {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Ascending arpeggio harmonic bell: D5 (587.33Hz) -> A5 (880Hz) -> D6 (1174.66Hz)
    const tones = [
      { freq: 587.33, start: 0, dur: 0.22, vol: 0.045 },
      { freq: 880.00, start: 0.06, dur: 0.28, vol: 0.05 },
      { freq: 1174.66, start: 0.12, dur: 0.35, vol: 0.035 }
    ];

    tones.forEach(({ freq, start, dur, vol }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + start);

      gain.gain.setValueAtTime(0.0001, now + start);
      gain.gain.linearRampToValueAtTime(vol, now + start + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + start + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + start);
      osc.stop(now + start + dur + 0.01);
    });
  }

  /**
   * Soft non-jarring low error buzz
   */
  public playErrorSound(): void {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Two soft low pulses
    [0, 0.09].forEach((offset) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(165, now + offset);

      gain.gain.setValueAtTime(0.045, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.07);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + offset);
      osc.stop(now + offset + 0.075);
    });
  }

  /**
   * Subtle soft click for general UI interactions (tabs, toggles, conversions)
   */
  public playGeneralClick(): void {
    this.playKeypadClick('fn');
  }
}

export const soundEngine = new SoundEngine();
