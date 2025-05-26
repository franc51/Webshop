import { Injectable } from '@angular/core';
import confetti from 'canvas-confetti';

@Injectable({
  providedIn: 'root',
})
export class ConfettiService {
  launchBasicConfetti() {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }

  launchCelebration() {
    // Fancier variant
    confetti({
      angle: 60,
      spread: 100,
      particleCount: 80,
      origin: { x: 0 },
    });

    confetti({
      angle: 120,
      spread: 100,
      particleCount: 80,
      origin: { x: 1 },
    });
  }
}
