/**
 * Mesin audio chiptune 8-bit menggunakan Web Audio API murni
 * tanpa file MP3 eksternal agar ukuran muat halaman tetap sangat ringan.
 */

class PixelAudioEngine {
  private ctx: AudioContext | null = null;
  private sfxEnabled = true;
  private bgmEnabled = false;
  private bgmTimer: ReturnType<typeof setInterval> | null = null;
  private step = 0;

  // Melodi RPG town/adventure 8-bit bernuansa hangat & nostalgia (Hz)
  private readonly BGM_MELODY = [
    261.63, 329.63, 392.0, 523.25, 392.0, 329.63, 293.66, 349.23,
    440.0, 392.0, 329.63, 293.66, 261.63, 329.63, 392.0, 329.63
  ];

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private playTone(
    freq: number,
    duration = 0.08,
    type: OscillatorType = 'square',
    volume = 0.04,
    delay = 0
  ) {
    if (!this.sfxEnabled && !this.bgmEnabled) return;
    const audio = this.ensureContext();
    if (!audio) return;

    const now = audio.currentTime + delay;
    const osc = audio.createOscillator();
    const gain = audio.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(audio.destination);
    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  isSFXEnabled() {
    return this.sfxEnabled;
  }

  isBGMEnabled() {
    return this.bgmEnabled;
  }

  setSFX(enabled: boolean) {
    this.sfxEnabled = enabled;
    if (enabled) this.playClick();
    return this.sfxEnabled;
  }

  setBGM(enabled: boolean) {
    this.bgmEnabled = enabled;
    if (this.bgmTimer) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
    if (this.bgmEnabled) {
      this.ensureContext();
      this.step = 0;
      this.tickBGM();
      this.bgmTimer = setInterval(() => this.tickBGM(), 260);
    }
    return this.bgmEnabled;
  }

  private tickBGM() {
    if (!this.bgmEnabled) return;
    const audio = this.ensureContext();
    if (!audio) return;

    const freq = this.BGM_MELODY[this.step % this.BGM_MELODY.length];
    const now = audio.currentTime;
    const osc = audio.createOscillator();
    const gain = audio.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.03, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.21);

    osc.connect(gain);
    gain.connect(audio.destination);
    osc.start(now);
    osc.stop(now + 0.23);

    this.step += 1;
  }

  playClick() {
    if (!this.sfxEnabled) return;
    this.playTone(740, 0.05, 'square', 0.03);
  }

  playFlip() {
    if (!this.sfxEnabled) return;
    this.playTone(440, 0.055, 'triangle', 0.04, 0);
    this.playTone(659.25, 0.065, 'square', 0.03, 0.045);
  }

  playStart() {
    if (!this.sfxEnabled) return;
    [392, 523.25, 659.25, 783.99].forEach((freq, idx) => {
      this.playTone(freq, 0.09, 'square', 0.04, idx * 0.065);
    });
  }

  playSuccess() {
    if (!this.sfxEnabled) return;
    this.playTone(587.33, 0.075, 'square', 0.035, 0);
    this.playTone(880, 0.12, 'square', 0.04, 0.07);
  }

  playEasterEgg() {
    if (!this.sfxEnabled) return;
    [523.25, 659.25, 783.99, 1046.5, 880, 1046.5].forEach((freq, idx) => {
      this.playTone(freq, 0.1, 'square', 0.045, idx * 0.08);
    });
  }
}

export const pixelAudio = new PixelAudioEngine();
