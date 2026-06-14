// Web Audio API Sound Synthesizer for DreamForge AI
// Zero-dependency, native chiptune music and sound effect generator.

class AudioManager {
  private ctx: AudioContext | null = null;
  private ambientOscs: { osc: OscillatorNode; gain: GainNode }[] = [];
  private ambientGain: GainNode | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.5; // 0 to 1
  private ambientPlaying: boolean = false;
  private currentChordIndex: number = 0;
  private ambientInterval: any = null;

  constructor() {
    // AudioContext is initialized lazily upon user interaction to comply with browser autoplay policies.
  }

  private init() {
    if (this.ctx) return;
    const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
    if (AudioContextClass) {
      this.ctx = new AudioContextClass();
    }
  }

  private getContext(): AudioContext | null {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Play a retro synth tone
  public playTone(
    freqs: number[],
    type: OscillatorType,
    dur: number,
    vol: number,
    glide?: { startFreq: number; endFreq: number }
  ) {
    const context = this.getContext();
    if (!context || this.isMuted) return;

    const now = context.currentTime;
    const gainNode = context.createGain();
    gainNode.gain.setValueAtTime(vol * this.volume, now);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    gainNode.connect(context.destination);

    freqs.forEach((freq) => {
      const osc = context.createOscillator();
      osc.type = type;
      if (glide) {
        osc.frequency.setValueAtTime(glide.startFreq, now);
        osc.frequency.exponentialRampToValueAtTime(glide.endFreq, now + dur);
      } else {
        osc.frequency.setValueAtTime(freq, now);
      }
      osc.connect(gainNode);
      osc.start(now);
      osc.stop(now + dur);
    });
  }

  // Set Mute
  public setMute(mute: boolean) {
    this.isMuted = mute;
    if (this.ambientGain) {
      this.ambientGain.gain.setValueAtTime(mute ? 0 : this.volume * 0.15, this.ctx?.currentTime || 0);
    }
  }

  // Set Volume
  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.ambientGain && !this.isMuted) {
      this.ambientGain.gain.setValueAtTime(this.volume * 0.15, this.ctx?.currentTime || 0);
    }
  }

  public getMute() {
    return this.isMuted;
  }

  public getVolume() {
    return this.volume;
  }

  // Chiptune Sound Effects

  // Quest Accepted: Arpeggio (low to high, e.g. C4-E4-G4-C5)
  public playQuestAccepted() {
    const context = this.getContext();
    if (!context) return;
    const now = context.currentTime;
    const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone([freq], 'triangle', 0.25, 0.4);
      }, idx * 100);
    });
  }

  // Quest Completed: Triumphant fanfare chord swell
  public playQuestCompleted() {
    const context = this.getContext();
    if (!context) return;
    const now = context.currentTime;
    // Ascending mini scale followed by major chord
    const notes = [523.25, 587.33, 659.25, 783.99, 1046.50]; // C5, D5, E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        if (idx === notes.length - 1) {
          // Major chord swell
          this.playTone([523.25, 659.25, 783.99, 1046.50], 'sawtooth', 0.8, 0.3);
        } else {
          this.playTone([freq], 'square', 0.12, 0.25);
        }
      }, idx * 80);
    });
  }

  // World Generated: Celestial sci-fi chime sequence
  public playWorldGenerated() {
    const context = this.getContext();
    if (!context) return;
    // Rapid laser arpeggio up then high chord
    const freqs = [150, 300, 600, 1200, 2400];
    freqs.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone([freq], 'sine', 0.15, 0.3, { startFreq: freq / 2, endFreq: freq });
      }, idx * 60);
    });
    setTimeout(() => {
      this.playTone([880, 1109, 1318.5, 1760], 'triangle', 1.0, 0.35);
    }, freqs.length * 60 + 50);
  }

  // Door Unlocked: Bright lock chime (E5 -> G5 -> C6)
  public playDoorUnlocked() {
    const context = this.getContext();
    if (!context) return;
    const now = context.currentTime;
    const notes = [659.25, 783.99, 1046.50]; // E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone([freq], 'sine', 0.2, 0.3);
      }, idx * 100);
    });
  }

  // Boss Encounter: Heavy tremolo menacing rumble
  public playBossEncounter() {
    const context = this.getContext();
    if (!context) return;
    const now = context.currentTime;
    // Low frequency rumble with a square pitch glide
    this.playTone([65.41, 82.41, 98.00], 'sawtooth', 1.2, 0.5, { startFreq: 110, endFreq: 55 });
    // Pitch pulse
    for (let i = 0; i < 4; i++) {
      setTimeout(() => {
        this.playTone([110], 'square', 0.15, 0.3);
      }, i * 200 + 300);
    }
  }

  // Ambient Loop: Play soft slow background pad progression
  public startAmbient() {
    if (this.ambientPlaying) return;
    const context = this.getContext();
    if (!context) return;

    this.ambientPlaying = true;
    
    // Create global ambient gain node
    this.ambientGain = context.createGain();
    this.ambientGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume * 0.15, context.currentTime);
    this.ambientGain.connect(context.destination);

    // Chords: Cmaj7 (C3-E3-G3-B3), Fmaj7 (F3-A3-C4-E4), Am7 (A2-C3-E3-G3), G7 (G2-B2-D3-F3)
    const chords = [
      [130.81, 164.81, 196.00, 246.94], // Cmaj7
      [174.61, 220.00, 261.63, 329.63], // Fmaj7
      [110.00, 130.81, 164.81, 196.00], // Am7
      [98.00, 123.47, 146.83, 174.61]   // G7
    ];

    const playChord = () => {
      if (!this.ambientPlaying || !this.ambientGain || this.isMuted) return;
      const currentChord = chords[this.currentChordIndex];
      const now = context.currentTime;

      // Clean old nodes
      this.ambientOscs = this.ambientOscs.filter((item) => {
        try {
          item.osc.stop();
        } catch(e) {}
        return false;
      });

      // Start new oscs for the chord pad
      currentChord.forEach((freq) => {
        const osc = context.createOscillator();
        const localGain = context.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        
        // Gentle swell in and out
        localGain.gain.setValueAtTime(0.0001, now);
        localGain.gain.linearRampToValueAtTime(0.25, now + 1.5);
        localGain.gain.setValueAtTime(0.25, now + 4.5);
        localGain.gain.exponentialRampToValueAtTime(0.0001, now + 6.0);

        osc.connect(localGain);
        localGain.connect(this.ambientGain!);
        
        osc.start(now);
        osc.stop(now + 6.0);

        this.ambientOscs.push({ osc, gain: localGain });
      });

      this.currentChordIndex = (this.currentChordIndex + 1) % chords.length;
    };

    // Trigger immediately and then loop every 5.8 seconds (giving 0.2s crossfade overlap)
    playChord();
    this.ambientInterval = setInterval(playChord, 5800);
  }

  public stopAmbient() {
    this.ambientPlaying = false;
    if (this.ambientInterval) {
      clearInterval(this.ambientInterval);
      this.ambientInterval = null;
    }
    this.ambientOscs.forEach((item) => {
      try {
        item.osc.stop();
      } catch (e) {}
    });
    this.ambientOscs = [];
    if (this.ambientGain) {
      this.ambientGain.disconnect();
      this.ambientGain = null;
    }
  }

  public isAmbientPlaying() {
    return this.ambientPlaying;
  }
}

// Export a single instance to be used globally in client side code
let globalAudio: AudioManager | null = null;

export const getAudio = (): AudioManager => {
  if (typeof window === 'undefined') {
    // Return a dummy placeholder on SSR
    return {
      playQuestAccepted: () => {},
      playQuestCompleted: () => {},
      playWorldGenerated: () => {},
      playDoorUnlocked: () => {},
      playBossEncounter: () => {},
      startAmbient: () => {},
      stopAmbient: () => {},
      setMute: () => {},
      setVolume: () => {},
      getMute: () => false,
      getVolume: () => 0.5,
      isAmbientPlaying: () => false
    } as any;
  }
  if (!globalAudio) {
    globalAudio = new AudioManager();
  }
  return globalAudio;
};
