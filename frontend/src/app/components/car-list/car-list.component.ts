import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CarService } from '../../services/car.service';
import { SearchService } from '../../services/search.service';
import { AuthService } from '../../services/auth.service';
import { Car } from '../../models/car.model';
import { SearchRequest } from '../../models/reservation.model';

@Component({
  selector: 'app-car-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="car-list-page">
      <!-- Search Summary -->
      <div class="search-summary" *ngIf="searchData">
        <div class="container">
          <div class="summary-content">
            <div class="summary-item">
              <span class="summary-label">Départ</span>
              <span class="summary-value">{{ searchData.pickupDate | date:'dd/MM/yyyy' }} à {{ searchData.pickupTime }}</span>
            </div>
            <div class="summary-arrow">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </div>
            <div class="summary-item">
              <span class="summary-label">Retour</span>
              <span class="summary-value">{{ searchData.returnDate | date:'dd/MM/yyyy' }} à {{ searchData.returnTime }}</span>
            </div>
            <button class="btn btn-outline btn-sm" (click)="modifySearch()">Modifier</button>
          </div>
        </div>
      </div>
      
      <!-- Results Header -->
      <div class="results-header">
        <div class="container">
          <div class="results-info">
            <h1>{{ cars.length }} véhicule{{ cars.length > 1 ? 's' : '' }} disponible{{ cars.length > 1 ? 's' : '' }}</h1>
            <p *ngIf="searchData">À partir de {{ getLowestPrice() | currency:'MAD':'symbol':'1.2-2' }}</p>
          </div>
          
          <div class="sort-options">
            <label>Trier par :</label>
            <select class="form-control" [(ngModel)]="sortBy" (change)="sortCars()">
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="category">Catégorie</option>
            </select>
          </div>
        </div>
      </div>
      
      <!-- Loading State -->
      <div class="loading-container" *ngIf="isLoading">
        <div class="loading-spinner">
          <div class="spinner"></div>
        </div>
        <p>Recherche des meilleures offres...</p>
      </div>
      
      <!-- Car List -->
      <div class="car-list-container" *ngIf="!isLoading">
        <div class="container">
          <div class="car-grid">
            <div class="car-card" *ngFor="let car of cars">
              <div class="car-image">
                <div class="car-category-badge">{{ car.category.nameFr }}</div>
                <div class="car-placeholder" *ngIf="!car.imageUrl">
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1.5">
                    <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2"></path>
                    <circle cx="6.5" cy="16.5" r="2.5"></circle>
                    <circle cx="16.5" cy="16.5" r="2.5"></circle>
                  </svg>
                </div>
                <img *ngIf="car.imageUrl" [src]="car.imageUrl" [alt]="car.name">
              </div>
              
              <div class="car-content">
                <div class="car-header">
                  <h3 class="car-name">{{ car.name }}</h3>
                  <p class="car-model">{{ car.exampleModel || car.model }}</p>
                </div>
                
                <div class="car-specs">
                  <div class="spec-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    <span>{{ car.seats }} places</span>
                  </div>
                  <div class="spec-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="9" y1="3" x2="9" y2="21"></line>
                    </svg>
                    <span>{{ car.doors }} portes</span>
                  </div>
                  <div class="spec-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    <span>{{ car.transmission }}</span>
                  </div>
                </div>
                
                <div class="car-pricing">
                  <div class="pricing-option pay-now">
                    <div class="pricing-header">
                      <span class="pricing-label">PAYER MAINTENANT</span>
                    </div>
                    <div class="pricing-amount">
                      <span class="currency">MAD</span>
                      <span class="price">{{ car.payNowPrice | number:'1.2-2' }}</span>
                    </div>
                    <button class="btn btn-primary btn-block" (click)="selectCar(car, 'PAY_NOW')">
                      RÉSERVER
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- No Results -->
      <div class="no-results" *ngIf="!isLoading && cars.length === 0">
        <div class="container">
          <div class="no-results-content">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
            <h2>Aucun véhicule disponible</h2>
            <p>Essayez de modifier vos critères de recherche</p>
            <button class="btn btn-primary" routerLink="/">Modifier la recherche</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .car-list-page {
      min-height: calc(100vh - 200px);
      background-color: var(--background-color);
    }
    
    .search-summary {
      background-color: var(--white);
      border-bottom: 1px solid var(--border-color);
      padding: 16px 24px;
    }
    
    .summary-content {
      display: flex;
      align-items: center;
      gap: 24px;
      flex-wrap: wrap;
    }
    
    .summary-item {
      display: flex;
      flex-direction: column;
    }
    
    .summary-label {
      font-size: 11px;
      text-transform: uppercase;
      color: var(--text-muted);
      font-weight: 600;
    }
    
    .summary-value {
      font-size: 14px;
      font-weight: 600;
      color: var(--text-color);
    }
    
    .summary-arrow {
      color: var(--primary-color);
    }
    
    .results-header {
      background-color: var(--white);
      padding: 24px;
      border-bottom: 1px solid var(--border-color);
    }
    
    .results-header .container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
    }
    
    .results-info h1 {
      font-size: 1.5rem;
      margin-bottom: 4px;
    }
    
    .results-info p {
      color: var(--text-muted);
      font-size: 14px;
    }
    
    .sort-options {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .sort-options label {
      font-size: 13px;
      color: var(--text-muted);
    }
    
    .sort-options select {
      width: auto;
      min-width: 150px;
    }
    
    .loading-container {
      text-align: center;
      padding: 60px 24px;
    }
    
    .loading-container p {
      color: var(--text-muted);
      margin-top: 16px;
    }
    
    .car-list-container {
      padding: 24px;
    }
    
    .car-grid {
      display: flex;
      flex-direction: column;
      gap: 24px;
      max-width: 900px;
      margin: 0 auto;
    }
    
    .car-card {
      background: var(--white);
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      display: grid;
      grid-template-columns: 280px 1fr;
    }
    
    .car-image {
      position: relative;
      background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 180px;
    }
    
    .car-image img {
      max-width: 100%;
      max-height: 160px;
      object-fit: contain;
    }
    
    .car-placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 160px;
    }
    
    .car-category-badge {
      position: absolute;
      top: 12px;
      left: 12px;
      background: var(--primary-color);
      color: var(--white);
      padding: 4px 12px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
    }
    
    .car-content {
      padding: 24px;
      display: flex;
      flex-direction: column;
    }
    
    .car-header {
      margin-bottom: 16px;
    }
    
    .car-name {
      font-size: 1.25rem;
      font-weight: 700;
      margin-bottom: 4px;
    }
    
    .car-model {
      color: var(--text-muted);
      font-size: 14px;
    }
    
    .car-specs {
      display: flex;
      gap: 16px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }
    
    .spec-item {
      display: flex;
      align-items: center;
      gap: 6px;
      color: var(--text-light);
      font-size: 13px;
    }
    
    .car-pricing {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-top: auto;
    }
    
    .pricing-option {
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;
    }
    
    .pay-now {
      border-color: var(--primary-color);
      background: rgba(212, 0, 42, 0.02);
    }
    
    .pricing-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      flex-wrap: wrap;
      gap: 4px;
    }
    
    .pricing-label {
      font-size: 10px;
      font-weight: 700;
      color: var(--text-muted);
      letter-spacing: 0.5px;
    }
    
    .savings-badge {
      font-size: 10px;
      font-weight: 600;
      color: var(--success-color);
      background: rgba(40, 167, 69, 0.1);
      padding: 2px 8px;
      border-radius: 4px;
    }
    
    .pricing-amount {
      margin-bottom: 12px;
    }
    
    .pricing-amount .currency {
      font-size: 12px;
      font-weight: 600;
      color: var(--text-muted);
    }
    
    .pricing-amount .price {
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--text-color);
    }
    
    .no-results {
      padding: 60px 24px;
    }
    
    .no-results-content {
      text-align: center;
      max-width: 400px;
      margin: 0 auto;
    }
    
    .no-results-content svg {
      color: var(--text-muted);
      margin-bottom: 16px;
    }
    
    .no-results-content h2 {
      margin-bottom: 8px;
    }
    
    .no-results-content p {
      color: var(--text-muted);
      margin-bottom: 24px;
    }
    
    @media (max-width: 768px) {
      .car-card {
        grid-template-columns: 1fr;
      }
      
      .car-image {
        min-height: 150px;
      }
      
      .car-pricing {
        grid-template-columns: 1fr;
      }
      
      .summary-content {
        flex-direction: column;
        align-items: flex-start;
      }
      
      .summary-arrow {
        transform: rotate(90deg);
      }
    }
  `]
})
export class CarListComponent implements OnInit {
  cars: Car[] = [];
  searchData: SearchRequest | null = null;
  isLoading = true;
  sortBy = 'price-asc';

  constructor(
    private carService: CarService,
    private searchService: SearchService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.searchData = this.searchService.getSearchData();
    
    if (this.searchData) {
      this.loadCars();
    } else {
      this.loadAllCars();
    }
  }

  loadCars(): void {
    this.isLoading = true;
    this.carService.searchCars(this.searchData!).subscribe({
      next: (cars) => {
        this.cars = cars;
        this.sortCars();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading cars:', error);
        this.isLoading = false;
      }
    });
  }

  loadAllCars(): void {
    this.isLoading = true;
    this.carService.getAllCars().subscribe({
      next: (cars) => {
        this.cars = cars;
        this.sortCars();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading cars:', error);
        this.isLoading = false;
      }
    });
  }

  sortCars(): void {
    switch (this.sortBy) {
      case 'price-asc':
        this.cars.sort((a, b) => a.payNowPrice - b.payNowPrice);
        break;
      case 'price-desc':
        this.cars.sort((a, b) => b.payNowPrice - a.payNowPrice);
        break;
      case 'category':
        this.cars.sort((a, b) => (a.category.displayOrder || 0) - (b.category.displayOrder || 0));
        break;
    }
  }

  getLowestPrice(): number {
    if (this.cars.length === 0) return 0;
    return Math.min(...this.cars.map(c => c.payNowPrice));
  }

  selectCar(car: Car, paymentType: string): void {
    if (!this.authService.isLoggedIn()) {
      localStorage.setItem('redirectAfterLogin', `/reservation/${car.id}`);
      this.router.navigate(['/login']);
      return;
    }

    localStorage.setItem('selectedCar', JSON.stringify(car));
    localStorage.setItem('paymentType', paymentType);
    this.router.navigate(['/reservation', car.id]);
  }

  modifySearch(): void {
    this.router.navigate(['/']);
  }
}
