import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'crypto-advisor-theme';
  
  private isDarkModeSubject = new BehaviorSubject<boolean>(true);
  public isDarkMode$ = this.isDarkModeSubject.asObservable();

  constructor() {
    this.initTheme();
  }

  private initTheme() {
    const savedTheme = localStorage.getItem(this.THEME_KEY);
    // Default to dark mode if no preference is saved
    const isDark = savedTheme ? savedTheme === 'dark' : true;
    this.setTheme(isDark);
  }

  public toggleTheme() {
    const newTheme = !this.isDarkModeSubject.value;
    this.setTheme(newTheme);
  }

  private setTheme(isDark: boolean) {
    this.isDarkModeSubject.next(isDark);
    localStorage.setItem(this.THEME_KEY, isDark ? 'dark' : 'light');

    if (isDark) {
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
    }
  }
}
