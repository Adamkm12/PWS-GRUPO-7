import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {

  private readonly KEY = 'theme';

  // Aplico el tema guardado en localStorage al arrancar
  applyStoredTheme(): void {
    if (localStorage.getItem(this.KEY) === 'dark') {
      document.body.classList.add('dark-theme');
    }
  }

  toggle(): void {
    const isDark = document.body.classList.toggle('dark-theme');
    localStorage.setItem(this.KEY, isDark ? 'dark' : 'light');
  }

  isDark(): boolean {
    return document.body.classList.contains('dark-theme');
  }
}
