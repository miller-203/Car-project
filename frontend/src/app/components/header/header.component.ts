import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { LanguageService, AppLanguage } from '../../services/language.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <header class="header">
      <div class="header-container">
        <div class="header-left">
          <button class="menu-btn" (click)="toggleMenu()">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <a routerLink="/" class="logo"><span class="logo-text">Moussaid Car</span></a>
        </div>

        <div class="header-right">
          <select class="language-select" [ngModel]="selectedLanguage" (ngModelChange)="onLanguageChange($event)">
            <option *ngFor="let option of languageService.options" [ngValue]="option.value">{{ option.label }}</option>
          </select>

          <ng-container *ngIf="currentUser$ | async as user; else loginTemplate">
            <a *ngIf="user.role === 'ADMIN'" routerLink="/admin/cars" class="btn btn-outline btn-sm">Admin Cars</a>
            <div class="user-menu">
              <span class="user-name">{{ user.firstName }}</span>
              <button class="btn btn-outline btn-sm" (click)="logout()">{{ t('logout') }}</button>
            </div>
          </ng-container>
          <ng-template #loginTemplate>
            <button class="btn btn-outline btn-sm" routerLink="/login">{{ t('login') }}</button>
          </ng-template>
        </div>
      </div>

      <div class="mobile-menu" [class.open]="menuOpen">
        <nav class="mobile-nav">
          <a routerLink="/" (click)="closeMenu()">{{ t('home') }}</a>
          <a routerLink="/cars" (click)="closeMenu()">{{ t('cars') }}</a>
          <a routerLink="/my-reservations" (click)="closeMenu()" *ngIf="currentUser$ | async">{{ t('reservations') }}</a>
          <a routerLink="/admin/cars" (click)="closeMenu()" *ngIf="(currentUser$ | async)?.role === 'ADMIN'">Admin Cars</a>
        </nav>
      </div>
    </header>
  `,
  styles: [`
    .header { background-color: var(--white); box-shadow: 0 2px 4px rgba(0,0,0,.1); position: sticky; top: 0; z-index: 1000; }
    .header-container { display:flex; align-items:center; justify-content:space-between; padding:12px 24px; max-width:1400px; margin:0 auto; }
    .header-left { display:flex; align-items:center; gap:16px; }
    .menu-btn { background:none; border:none; cursor:pointer; padding:8px; display:flex; align-items:center; justify-content:center; color:var(--text-color); }
    .logo { text-decoration:none; }
    .logo-text { font-size:20px; font-weight:700; color:var(--primary-color); }
    .header-right { display:flex; align-items:center; gap:12px; }
    .language-select { border:1px solid var(--border-color); border-radius:8px; padding:7px 10px; font-size:13px; }
    .user-menu { display:flex; align-items:center; gap:12px; }
    .mobile-menu { display:none; background-color:var(--white); border-top:1px solid var(--border-color); padding:16px 24px; }
    .mobile-menu.open { display:block; }
    .mobile-nav { display:flex; flex-direction:column; gap:16px; }
    .btn-sm { padding:8px 16px; font-size:12px; }
    @media (max-width:768px){ .header-container{padding:12px 16px;} .logo-text{font-size:18px;} .user-name{display:none;} }
  `]
})
export class HeaderComponent {
  menuOpen = false;
  currentUser$ = this.authService.currentUser$;
  selectedLanguage: AppLanguage;

  private readonly translations: Record<AppLanguage, Record<string, string>> = {
    fr: { login: 'Se connecter', logout: 'Déconnexion', home: 'Accueil', cars: 'Nos véhicules', reservations: 'Mes réservations' },
    en: { login: 'Login', logout: 'Logout', home: 'Home', cars: 'Cars', reservations: 'My reservations' },
    ar: { login: 'تسجيل الدخول', logout: 'تسجيل الخروج', home: 'الرئيسية', cars: 'السيارات', reservations: 'حجوزاتي' }
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    public languageService: LanguageService
  ) {
    this.selectedLanguage = languageService.currentLanguage;
  }

  t(key: string): string {
    return this.translations[this.selectedLanguage][key] || key;
  }

  onLanguageChange(language: AppLanguage): void {
    this.selectedLanguage = language;
    this.languageService.setLanguage(language);
  }

  toggleMenu(): void { this.menuOpen = !this.menuOpen; }
  closeMenu(): void { this.menuOpen = false; }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
