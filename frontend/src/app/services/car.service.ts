import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Car, CarCategory } from '../models/car.model';
import { SearchRequest } from '../models/reservation.model';

export interface CreateCarRequest {
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

@Injectable({
  providedIn: 'root'
})
export class CarService {
  private apiUrl = 'http://localhost:8080/api/cars';

  constructor(private http: HttpClient) {}

  getAllCars(): Observable<Car[]> {
    return this.http.get<Car[]>(this.apiUrl);
  }

  getCarById(id: number): Observable<Car> {
    return this.http.get<Car>(`${this.apiUrl}/${id}`);
  }

  searchCars(searchRequest: SearchRequest): Observable<Car[]> {
    return this.http.post<Car[]>(`${this.apiUrl}/search`, searchRequest);
  }

  getAllCategories(): Observable<CarCategory[]> {
    return this.http.get<CarCategory[]>(`${this.apiUrl}/categories`);
  }

  createCar(request: CreateCarRequest): Observable<Car> {
    return this.http.post<Car>(this.apiUrl, request);
  }
}
