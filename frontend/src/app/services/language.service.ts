import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type AppLanguage = 'fr' | 'en' | 'ar';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly storageKey = 'appLanguage';
  private readonly defaultLanguage: AppLanguage = 'fr';

  readonly options: { value: AppLanguage; label: string }[] = [
    { value: 'fr', label: 'Français' },
    { value: 'en', label: 'English' },
    { value: 'ar', label: 'العربية' }
  ];

  private languageSubject = new BehaviorSubject<AppLanguage>(this.getInitialLanguage());
  language$ = this.languageSubject.asObservable();

  constructor() {
    this.applyDirection(this.languageSubject.value);
  }

  get currentLanguage(): AppLanguage {
    return this.languageSubject.value;
  }

  setLanguage(language: AppLanguage): void {
    this.languageSubject.next(language);
    localStorage.setItem(this.storageKey, language);
    this.applyDirection(language);
  }

  private getInitialLanguage(): AppLanguage {
    const fromStorage = localStorage.getItem(this.storageKey) as AppLanguage | null;
    return fromStorage && ['fr', 'en', 'ar'].includes(fromStorage) ? fromStorage : this.defaultLanguage;
  }

  private applyDirection(language: AppLanguage): void {
    const html = document.documentElement;
    html.setAttribute('lang', language);
    html.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
  }
}
