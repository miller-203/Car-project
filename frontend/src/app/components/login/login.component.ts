import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="auth-page">
      <div class="auth-container">
        <div class="auth-card">
          <h1>Connexion</h1>
          <p class="auth-subtitle">Connectez-vous pour accéder à votre compte</p>
          
          <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
            <div class="form-group">
              <label class="form-label">Email</label>
              <input 
                type="email" 
                class="form-control"
                placeholder="votre@email.com"
                [(ngModel)]="loginRequest.email"
                name="email"
                required
                email
                #email="ngModel"
              >
              <div class="error-message" *ngIf="email.invalid && email.touched">
                Veuillez entrer un email valide
              </div>
            </div>
            
            <div class="form-group">
              <label class="form-label">Mot de passe</label>
              <input 
                type="password" 
                class="form-control"
                placeholder="Votre mot de passe"
                [(ngModel)]="loginRequest.password"
                name="password"
                required
                minlength="6"
                #password="ngModel"
              >
              <div class="error-message" *ngIf="password.invalid && password.touched">
                Le mot de passe doit contenir au moins 6 caractères
              </div>
            </div>
            
            <div class="form-options">
              <div class="checkbox-container">
                <input type="checkbox" id="rememberMe" [(ngModel)]="rememberMe" name="rememberMe">
                <label for="rememberMe">Se souvenir de moi</label>
              </div>
              <a href="#" class="forgot-password">Mot de passe oublié ?</a>
            </div>
            
            <button 
              type="submit" 
              class="btn btn-primary btn-block"
              [disabled]="loginForm.invalid || isLoading"
            >
              <span *ngIf="!isLoading">Se connecter</span>
              <span *ngIf="isLoading" class="spinner-small"></span>
            </button>
          </form>
          
          <div class="auth-footer">
            <p>Vous n'avez pas de compte ? <a routerLink="/register">Créer un compte</a></p>
          </div>
          
          <div class="error-alert" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: calc(100vh - 200px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px 24px;
      background-color: var(--background-color);
    }
    
    .auth-container {
      width: 100%;
      max-width: 420px;
    }
    
    .auth-card {
      background: var(--white);
      border-radius: 12px;
      padding: 40px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }
    
    .auth-card h1 {
      text-align: center;
      margin-bottom: 8px;
      font-size: 1.75rem;
    }
    
    .auth-subtitle {
      text-align: center;
      color: var(--text-muted);
      margin-bottom: 32px;
    }
    
    .form-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      flex-wrap: wrap;
      gap: 12px;
    }
    
    .forgot-password {
      font-size: 13px;
    }
    
    .auth-footer {
      text-align: center;
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid var(--border-color);
    }
    
    .auth-footer p {
      color: var(--text-muted);
      font-size: 14px;
    }
    
    .error-message {
      color: var(--error-color);
      font-size: 12px;
      margin-top: 4px;
    }
    
    .error-alert {
      background-color: #ffebee;
      color: var(--error-color);
      padding: 12px 16px;
      border-radius: 8px;
      margin-top: 16px;
      font-size: 14px;
    }
    
    .spinner-small {
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: var(--white);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      display: inline-block;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    @media (max-width: 480px) {
      .auth-card {
        padding: 24px;
      }
    }
  `]
})
export class LoginComponent {
  loginRequest: LoginRequest = {
    email: '',
    password: ''
  };
  
  rememberMe = false;
  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (this.isLoading) return;
    
    this.isLoading = true;
    this.errorMessage = '';
    
    this.authService.login(this.loginRequest).subscribe({
      next: () => {
        const redirectUrl = localStorage.getItem('redirectAfterLogin');
        if (redirectUrl) {
          localStorage.removeItem('redirectAfterLogin');
          this.router.navigateByUrl(redirectUrl);
          return;
        }
        const currentUser = this.authService.getCurrentUser();
        if (currentUser?.role === 'ADMIN') {
          this.router.navigate(['/admin/cars']);
          return;
        }
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Erreur de connexion. Veuillez réessayer.';
      }
    });
  }
}
