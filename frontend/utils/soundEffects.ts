class SoundFX {
  private ctx: AudioContext | null = null;
  private musicInterval: NodeJS.Timeout | null = null;
  private currentBpm: number = 100;
  private isMusicPlaying: boolean = false;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // ⌨️ LOUD & PUNCHY Mechanical Keyboard Synthesizer
  playMechKeyClick(switchType: 'thock' | 'clicky' | 'linear' | 'off' = 'thock') {
    if (switchType === 'off') return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // 1. 🪵 DEEP LOUD ACOUSTIC THOCK (Holy Panda / Topre Style)
    if (switchType === 'thock') {
      // Body Resonator (Deep hollow thock)
      const bodyOsc = ctx.createOscillator();
      const bodyGain = ctx.createGain();
      bodyOsc.type = 'triangle';
      const bodyFreq = Math.random() * 40 + 130; // 130Hz - 170Hz deep wooden resonance
      bodyOsc.frequency.setValueAtTime(bodyFreq, now);
      bodyOsc.frequency.exponentialRampToValueAtTime(45, now + 0.07);

      bodyGain.gain.setValueAtTime(0.65, now); // 🔊 Loud presence
      bodyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      bodyOsc.connect(bodyGain);
      bodyGain.connect(ctx.destination);
      bodyOsc.start(now);
      bodyOsc.stop(now + 0.07);

      // Snap Transient (Crisp top-out click)
      const snapOsc = ctx.createOscillator();
      const snapGain = ctx.createGain();
      snapOsc.type = 'sine';
      snapOsc.frequency.setValueAtTime(800 + Math.random() * 200, now);
      snapOsc.frequency.exponentialRampToValueAtTime(200, now + 0.02);

      snapGain.gain.setValueAtTime(0.35, now);
      snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

      snapOsc.connect(snapGain);
      snapGain.connect(ctx.destination);
      snapOsc.start(now);
      snapOsc.stop(now + 0.02);
    } 
    // 2. 🔴 PUNCHY RED LINEAR CLACK
    else if (switchType === 'linear') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      const freq = Math.random() * 80 + 340; // 340Hz - 420Hz crisp bottom-out
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(90, now + 0.05);

      gain.gain.setValueAtTime(0.55, now); // 🔊 Loud crisp clack
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } 
    // 3. 🔵 SHARP BLUE CLICKY SWITCH
    else if (switchType === 'clicky') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      const freq = Math.random() * 400 + 1900;
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(500, now + 0.03);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.03);
    }
  }

  // 🎵 Procedural Synthwave Battle Music
  startBattleMusic(initialBpm: number = 100) {
    if (this.isMusicPlaying) return;
    this.isMusicPlaying = true;
    this.currentBpm = initialBpm;

    const bassNotes = [110, 110, 130.81, 146.83, 98, 98, 110, 123.47];
    let step = 0;

    const playBeat = () => {
      if (!this.isMusicPlaying) return;
      const ctx = this.getContext();
      if (ctx) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        const freq = bassNotes[step % bassNotes.length];
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.5, ctx.currentTime + 0.15);

        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.2);

        if (step % 2 === 1) {
          const hatOsc = ctx.createOscillator();
          const hatGain = ctx.createGain();
          hatOsc.type = 'square';
          hatOsc.frequency.setValueAtTime(3500, ctx.currentTime);
          hatGain.gain.setValueAtTime(0.025, ctx.currentTime);
          hatGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
          hatOsc.connect(hatGain);
          hatGain.connect(ctx.destination);
          hatOsc.start(ctx.currentTime);
          hatOsc.stop(ctx.currentTime + 0.04);
        }
      }

      step++;
      const intervalMs = (60 / this.currentBpm / 2) * 1000;
      if (this.isMusicPlaying) {
        this.musicInterval = setTimeout(playBeat, intervalMs);
      }
    };

    playBeat();
  }

  setMusicTempo(newBpm: number) {
    this.currentBpm = newBpm;
  }

  stopBattleMusic() {
    this.isMusicPlaying = false;
    if (this.musicInterval) {
      clearTimeout(this.musicInterval);
      this.musicInterval = null;
    }
  }

  playFightStart() {
    const ctx = this.getContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.5);
  }

  playSubmitSound() {
    const ctx = this.getContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, ctx.currentTime);
    osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.5);
  }

  playVictory() {
    const ctx = this.getContext();
    if (!ctx) return;
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.12);
      gain.gain.setValueAtTime(0.25, ctx.currentTime + index * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + index * 0.12 + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + index * 0.12);
      osc.stop(ctx.currentTime + index * 0.12 + 0.4);
    });
  }

  playDefeat() {
    const ctx = this.getContext();
    if (!ctx) return;
    const notes = [329.63, 293.66, 261.63, 220.00, 164.81];
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.22);
      gain.gain.setValueAtTime(0.16, ctx.currentTime + index * 0.22);
      gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + index * 0.22 + 0.45);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + index * 0.22);
      osc.stop(ctx.currentTime + index * 0.22 + 0.45);
    });
  }

  playReactionPop() {
    const ctx = this.getContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.08);
  }
}

export const sfx = new SoundFX();