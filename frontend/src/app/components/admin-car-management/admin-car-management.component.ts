import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarCategory } from '../../models/car.model';
import { CarService } from '../../services/car.service';

interface CreateCarRequest {
  categoryId: number;
  name: string;
  model: string;
  exampleModel: string;
  year: number;
  seats: number;
  doors: number;
  transmission: string;
  fuelType: string;
  hybrid: boolean;
  hasAirConditioning: boolean;
  imageUrl: string;
  payAtAgencyPrice: number;
  payNowPrice: number;
  available: boolean;
}

@Component({
  selector: 'app-admin-car-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-page">
      <div class="container">
        <h1>Admin - Add a car</h1>
        <p class="subtitle">Create a new car that will appear in the public cars list.</p>

        <form (ngSubmit)="createCar()" class="admin-form">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Category</label>
              <select class="form-control" [(ngModel)]="request.categoryId" name="categoryId" required>
                <option [ngValue]="0" disabled>Select a category</option>
                <option *ngFor="let category of categories" [ngValue]="category.id">{{ category.nameFr }}</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Name</label>
              <input class="form-control" [(ngModel)]="request.name" name="name" required>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Model</label>
              <input class="form-control" [(ngModel)]="request.model" name="model" required>
            </div>
            <div class="form-group">
              <label class="form-label">Example model</label>
              <input class="form-control" [(ngModel)]="request.exampleModel" name="exampleModel">
            </div>
          </div>

          <div class="form-row three-cols">
            <div class="form-group"><label class="form-label">Year</label><input type="number" class="form-control" [(ngModel)]="request.year" name="year" required></div>
            <div class="form-group"><label class="form-label">Seats</label><input type="number" class="form-control" [(ngModel)]="request.seats" name="seats" required></div>
            <div class="form-group"><label class="form-label">Doors</label><input type="number" class="form-control" [(ngModel)]="request.doors" name="doors" required></div>
          </div>

          <div class="form-row">
            <div class="form-group"><label class="form-label">Transmission</label><input class="form-control" [(ngModel)]="request.transmission" name="transmission" required></div>
            <div class="form-group"><label class="form-label">Fuel type</label><input class="form-control" [(ngModel)]="request.fuelType" name="fuelType"></div>
          </div>

          <div class="form-row">
            <div class="form-group"><label class="form-label">Image URL</label><input class="form-control" [(ngModel)]="request.imageUrl" name="imageUrl"></div>
            <div class="form-group"><label class="form-label">Pay at agency (MAD/day)</label><input type="number" step="0.01" class="form-control" [(ngModel)]="request.payAtAgencyPrice" name="payAtAgencyPrice" required></div>
          </div>

          <div class="form-row">
            <div class="form-group"><label class="form-label">Pay now (MAD/day)</label><input type="number" step="0.01" class="form-control" [(ngModel)]="request.payNowPrice" name="payNowPrice" required></div>
            <div class="form-group checkbox-group">
              <label><input type="checkbox" [(ngModel)]="request.hybrid" name="hybrid"> Hybrid</label>
              <label><input type="checkbox" [(ngModel)]="request.hasAirConditioning" name="hasAirConditioning"> Air conditioning</label>
              <label><input type="checkbox" [(ngModel)]="request.available" name="available"> Available</label>
            </div>
          </div>

          <button class="btn btn-primary" [disabled]="isLoading">{{ isLoading ? 'Saving...' : 'Add car' }}</button>
        </form>

        <div class="success" *ngIf="successMessage">{{ successMessage }}</div>
        <div class="error" *ngIf="errorMessage">{{ errorMessage }}</div>
      </div>
    </div>
  `,
  styles: [`
    .admin-page { padding: 40px 24px; background: var(--background-color); min-height: calc(100vh - 200px); }
    .container { max-width: 900px; margin: 0 auto; }
    .subtitle { color: var(--text-muted); margin-bottom: 24px; }
    .admin-form { background: var(--white); border-radius: 12px; padding: 24px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
    .three-cols { grid-template-columns: repeat(3, 1fr); }
    .checkbox-group { display: flex; flex-direction: column; gap: 10px; justify-content: center; }
    .success { margin-top: 16px; background: #e8f5e9; padding: 12px; border-radius: 8px; color: #2e7d32; }
    .error { margin-top: 16px; background: #ffebee; padding: 12px; border-radius: 8px; color: var(--error-color); }
    @media (max-width: 768px) { .form-row, .three-cols { grid-template-columns: 1fr; } }
  `]
})
export class AdminCarManagementComponent implements OnInit {
  categories: CarCategory[] = [];
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  request: CreateCarRequest = this.getDefaultRequest();

  constructor(private carService: CarService) {}

  ngOnInit(): void {
    this.carService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        if (categories.length > 0) {
          this.request.categoryId = categories[0].id;
        }
      }
    });
  }

  createCar(): void {
    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.carService.createCar(this.request).subscribe({
      next: () => {
        this.successMessage = 'Car has been added successfully.';
        this.request = this.getDefaultRequest(this.request.categoryId);
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to add car.';
        this.isLoading = false;
      }
    });
  }

  private getDefaultRequest(categoryId = 0): CreateCarRequest {
    return {
      categoryId,
      name: '',
      model: '',
      exampleModel: '',
      year: new Date().getFullYear(),
      seats: 5,
      doors: 5,
      transmission: 'Automatique',
      fuelType: 'Essence',
      hybrid: false,
      hasAirConditioning: true,
      imageUrl: '',
      payAtAgencyPrice: 0,
      payNowPrice: 0,
      available: true
    };
  }
}
