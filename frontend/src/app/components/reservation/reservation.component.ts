import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReservationService } from '../../services/reservation.service';
import { AuthService } from '../../services/auth.service';
import { SearchService } from '../../services/search.service';
import { Car } from '../../models/car.model';
import { ReservationRequest, SearchRequest } from '../../models/reservation.model';

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="reservation-page">
      <div class="container">
        <div class="reservation-grid">
          <!-- Left Column - Forms -->
          <div class="reservation-forms">
            <h1>Finaliser votre réservation</h1>
            
            <!-- Driver Information -->
            <div class="form-section">
              <h2>Informations du conducteur</h2>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Prénom *</label>
                  <input 
                    type="text" 
                    class="form-control"
                    [(ngModel)]="customerFirstName"
                    name="customerFirstName"
                    required
                  >
                </div>
                <div class="form-group">
                  <label class="form-label">Nom *</label>
                  <input 
                    type="text" 
                    class="form-control"
                    [(ngModel)]="customerLastName"
                    name="customerLastName"
                    required
                  >
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Email *</label>
                  <input 
                    type="email" 
                    class="form-control"
                    [(ngModel)]="customerEmail"
                    name="customerEmail"
                    required
                  >
                </div>
                <div class="form-group">
                  <label class="form-label">Téléphone *</label>
                  <input 
                    type="tel" 
                    class="form-control"
                    [(ngModel)]="customerPhone"
                    name="customerPhone"
                    required
                  >
                </div>
              </div>
            </div>
            
            <!-- Payment Information -->
            <div class="form-section">
              <h2>Mode de paiement</h2>
              <div class="payment-options">
                
                <div 
                  class="payment-option" 
                  [class.selected]="paymentType === 'PAY_NOW'"
                  (click)="paymentType = 'PAY_NOW'"
                >
                  <div class="payment-radio">
                    <input type="radio" name="paymentType" value="PAY_NOW" [(ngModel)]="paymentType">
                  </div>
                  <div class="payment-details">
                    <span class="payment-label">Payer maintenant</span>
                    <span class="payment-price">{{ car?.payNowPrice | currency:'MAD':'symbol':'1.2-2' }}</span>
                    <span class="payment-savings">Économisez {{ car?.savings | number:'1.2-2' }} MAD</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Terms -->
            <div class="form-section">
              <div class="checkbox-container terms-checkbox">
                <input type="checkbox" id="terms" [(ngModel)]="acceptTerms" name="acceptTerms">
                <label for="terms">
                  J'accepte les <a href="#">conditions de location</a> et je confirme que le conducteur a 25 ans ou plus et possède un permis de conduire valide.
                </label>
              </div>
            </div>
            
            <!-- Submit Button -->
            <button 
              class="btn btn-primary btn-block btn-large"
              [disabled]="!canSubmit || isLoading"
              (click)="onSubmit()"
            >
              <span *ngIf="!isLoading">CONFIRMER LA RÉSERVATION</span>
              <span *ngIf="isLoading" class="spinner-small"></span>
            </button>
            
            <div class="error-message" *ngIf="errorMessage">
              {{ errorMessage }}
            </div>
          </div>
          
          <!-- Right Column - Summary -->
          <div class="reservation-summary">
            <div class="summary-card">
              <h2>Récapitulatif</h2>
              
              <div class="car-summary" *ngIf="car">
                <div class="car-image-placeholder" *ngIf="!car.imageUrl">
                  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1.5">
                    <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2"></path>
                    <circle cx="6.5" cy="16.5" r="2.5"></circle>
                    <circle cx="16.5" cy="16.5" r="2.5"></circle>
                  </svg>
                </div>
                <img *ngIf="car.imageUrl" [src]="car.imageUrl" [alt]="car.name">
                <div class="car-info">
                  <h3>{{ car.name }}</h3>
                  <p>{{ car.exampleModel || car.model }}</p>
                  <span class="category">{{ car.category.nameFr }}</span>
                </div>
              </div>
              
              <div class="details-summary" *ngIf="searchData">
                <div class="detail-item">
                  <span class="detail-label">Prise en charge</span>
                  <span class="detail-value">{{ searchData.pickupDate | date:'dd/MM/yyyy' }} à {{ searchData.pickupTime }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Retour</span>
                  <span class="detail-value">{{ searchData.returnDate | date:'dd/MM/yyyy' }} à {{ searchData.returnTime }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Durée</span>
                  <span class="detail-value">{{ getDuration() }} jour(s)</span>
                </div>
              </div>
              
              <div class="price-summary">
                <div class="price-item">
                  <span>Prix de base</span>
                  <span>{{ getBasePrice() | currency:'MAD':'symbol':'1.2-2' }}</span>
                </div>
                <div class="price-item discount" *ngIf="searchData?.discountCode">
                  <span>Remise</span>
                  <span>-{{ getDiscount() | currency:'MAD':'symbol':'1.2-2' }}</span>
                </div>
                <div class="price-item total">
                  <span>Total</span>
                  <span>{{ getTotalPrice() | currency:'MAD':'symbol':'1.2-2' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Success Modal -->
    <div class="modal-overlay" *ngIf="showSuccessModal">
      <div class="modal-content">
        <div class="success-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <h2>Réservation confirmée !</h2>
        <p>Votre réservation a été créée avec succès.</p>
        <div class="reservation-number" *ngIf="reservationNumber">
          <span>Numéro de réservation</span>
          <strong>{{ reservationNumber }}</strong>
        </div>
        <button class="btn btn-primary" (click)="goToHome()">Retour à l'accueil</button>
      </div>
    </div>
  `,
  styles: [`
    .reservation-page {
      padding: 40px 24px;
      background-color: var(--background-color);
      min-height: calc(100vh - 200px);
    }
    
    .reservation-grid {
      display: grid;
      grid-template-columns: 1fr 380px;
      gap: 32px;
      max-width: 1100px;
      margin: 0 auto;
    }
    
    .reservation-forms h1 {
      font-size: 1.75rem;
      margin-bottom: 24px;
    }
    
    .form-section {
      background: var(--white);
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 24px;
    }
    
    .form-section h2 {
      font-size: 1.1rem;
      margin-bottom: 20px;
      color: var(--text-color);
    }
    
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 16px;
    }
    
    .form-row:last-child {
      margin-bottom: 0;
    }
    
    .payment-options {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    
    .payment-option {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      border: 2px solid var(--border-color);
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .payment-option:hover {
      border-color: var(--primary-color);
    }
    
    .payment-option.selected {
      border-color: var(--primary-color);
      background: rgba(212, 0, 42, 0.02);
    }
    
    .payment-details {
      display: flex;
      flex-direction: column;
      flex: 1;
    }
    
    .payment-label {
      font-weight: 600;
      font-size: 14px;
    }
    
    .payment-price {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--primary-color);
    }
    
    .payment-savings {
      font-size: 12px;
      color: var(--success-color);
      font-weight: 600;
    }
    
    .terms-checkbox {
      align-items: flex-start;
    }
    
    .terms-checkbox label {
      font-size: 13px;
      line-height: 1.5;
    }
    
    .btn-large {
      padding: 18px 32px;
      font-size: 16px;
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
    
    .error-message {
      background-color: #ffebee;
      color: var(--error-color);
      padding: 12px 16px;
      border-radius: 8px;
      margin-top: 16px;
      font-size: 14px;
    }
    
    /* Summary Card */
    .reservation-summary {
      position: sticky;
      top: 100px;
    }
    
    .summary-card {
      background: var(--white);
      border-radius: 12px;
      padding: 24px;
    }
    
    .summary-card h2 {
      font-size: 1.1rem;
      margin-bottom: 20px;
    }
    
    .car-summary {
      display: flex;
      gap: 16px;
      padding-bottom: 20px;
      border-bottom: 1px solid var(--border-color);
      margin-bottom: 20px;
    }
    
    .car-summary img {
      width: 100px;
      height: 70px;
      object-fit: contain;
      background: #f5f5f5;
      border-radius: 8px;
    }
    
    .car-info h3 {
      font-size: 16px;
      margin-bottom: 4px;
    }
    
    .car-info p {
      font-size: 13px;
      color: var(--text-muted);
      margin-bottom: 4px;
    }
    
    .car-info .category {
      font-size: 11px;
      background: var(--primary-color);
      color: var(--white);
      padding: 2px 8px;
      border-radius: 4px;
    }
    
    .details-summary {
      padding-bottom: 20px;
      border-bottom: 1px solid var(--border-color);
      margin-bottom: 20px;
    }
    
    .detail-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }
    
    .detail-label {
      font-size: 13px;
      color: var(--text-muted);
    }
    
    .detail-value {
      font-size: 13px;
      font-weight: 600;
    }
    
    .price-summary {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .price-item {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
    }
    
    .price-item.discount {
      color: var(--success-color);
    }
    
    .price-item.total {
      font-size: 1.25rem;
      font-weight: 700;
      padding-top: 12px;
      border-top: 1px solid var(--border-color);
      margin-top: 8px;
    }
    
    /* Success Modal */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
    }
    
    .modal-content {
      background: var(--white);
      border-radius: 16px;
      padding: 48px;
      text-align: center;
      max-width: 400px;
      width: 90%;
    }
    
    .success-icon {
      color: var(--success-color);
      margin-bottom: 24px;
    }
    
    .modal-content h2 {
      margin-bottom: 12px;
    }
    
    .modal-content p {
      color: var(--text-muted);
      margin-bottom: 24px;
    }
    
    .reservation-number {
      background: var(--background-color);
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 24px;
    }
    
    .reservation-number span {
      display: block;
      font-size: 12px;
      color: var(--text-muted);
      margin-bottom: 4px;
    }
    
    .reservation-number strong {
      font-size: 1.5rem;
      color: var(--primary-color);
      letter-spacing: 1px;
    }
    
    @media (max-width: 900px) {
      .reservation-grid {
        grid-template-columns: 1fr;
      }
      
      .reservation-summary {
        position: static;
        order: -1;
      }
    }
    
    @media (max-width: 480px) {
      .form-row {
        grid-template-columns: 1fr;
      }
      
      .modal-content {
        padding: 32px 24px;
      }
    }
  `]
})
export class ReservationComponent implements OnInit {
  car: Car | null = null;
  searchData: SearchRequest | null = null;
  paymentType = 'PAY_NOW';
  
  customerFirstName = '';
  customerLastName = '';
  customerEmail = '';
  customerPhone = '';
  acceptTerms = false;
  
  isLoading = false;
  errorMessage = '';
  showSuccessModal = false;
  reservationNumber = '';

  constructor(
    private reservationService: ReservationService,
    private authService: AuthService,
    private searchService: SearchService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      localStorage.setItem('redirectAfterLogin', this.router.url);
      this.router.navigate(['/login']);
      return;
    }

    // Load selected car
    const storedCar = localStorage.getItem('selectedCar');
    const storedPaymentType = localStorage.getItem('paymentType');
    
    if (storedCar) {
      this.car = JSON.parse(storedCar);
    } else {
      this.router.navigate(['/cars']);
      return;
    }
    
    if (storedPaymentType) {
      this.paymentType = storedPaymentType;
    }
    
    this.searchData = this.searchService.getSearchData();
    
    // Pre-fill user info if logged in
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.customerFirstName = currentUser.firstName;
      this.customerLastName = currentUser.lastName;
      this.customerEmail = currentUser.email;
    }
  }

  get canSubmit(): boolean {
    return !!this.customerFirstName && 
           !!this.customerLastName && 
           !!this.customerEmail && 
           !!this.customerPhone && 
           this.acceptTerms;
  }

  getDuration(): number {
    if (!this.searchData) return 1;
    const pickup = new Date(this.searchData.pickupDate);
    const return_date = new Date(this.searchData.returnDate);
    const diffTime = Math.abs(return_date.getTime() - pickup.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1;
  }

  getBasePrice(): number {
    if (!this.car) return 0;
    const pricePerDay = this.paymentType === 'PAY_NOW' ? 
      this.car.payNowPrice : this.car.payAtAgencyPrice;
    return pricePerDay * this.getDuration();
  }

  getDiscount(): number {
    if (!this.searchData?.discountCode) return 0;
    return this.getBasePrice() * 0.10;
  }

  getTotalPrice(): number {
    return this.getBasePrice() - this.getDiscount();
  }

  onSubmit(): void {
    if (!this.canSubmit || !this.car || !this.searchData) return;
    
    this.isLoading = true;
    this.errorMessage = '';
    
    const request: ReservationRequest = {
      carId: this.car.id,
      pickupAgencyId: this.searchData.pickupAgencyId,
      returnAgencyId: this.searchData.returnAgencyId,
      pickupDate: this.searchData.pickupDate,
      pickupTime: this.searchData.pickupTime,
      returnDate: this.searchData.returnDate,
      returnTime: this.searchData.returnTime,
      paymentType: this.paymentType,
      discountCode: this.searchData.discountCode || '',
      driverAge25Plus: this.searchData.driverAge25Plus,
      customerFirstName: this.customerFirstName,
      customerLastName: this.customerLastName,
      customerEmail: this.customerEmail,
      customerPhone: this.customerPhone
    };
    
    this.reservationService.createReservation(request).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.reservationNumber = response.reservationNumber;
        this.showSuccessModal = true;
        this.sendReservationToWhatsApp(response.reservationNumber);
        
        // Clear stored data
        localStorage.removeItem('selectedCar');
        localStorage.removeItem('paymentType');
        this.searchService.clearSearchData();
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Erreur lors de la réservation. Veuillez réessayer.';
      }
    });
  }


  private sendReservationToWhatsApp(reservationNumber: string): void {
    const adminPhone = '212600000000';
    const message = encodeURIComponent(
      `Nouvelle réservation ${reservationNumber} par ${this.customerFirstName} ${this.customerLastName}. Email: ${this.customerEmail}, Téléphone: ${this.customerPhone}`
    );
    window.open(`https://wa.me/${adminPhone}?text=${message}`, '_blank');
  }

  goToHome(): void {
    this.showSuccessModal = false;
    this.router.navigate(['/']);
  }
}
