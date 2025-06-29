import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../../environment';

// best practice
export interface Product {
  _id: string;
  name: string;
  category: string;
  pictureUrls: ['','',''];
  rating: number;
  price: number;
  newArrival: boolean;
  bestseller: boolean;
  featured: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private postProductsRoute = `${environment.apiUrl}/api/add-products`;
  private getProductsRoute = `${environment.apiUrl}/api/get-all-products`;
  private getProductRoute = `${environment.apiUrl}/api/get-product`;

  constructor(private http: HttpClient) {}

  // Fetch products from the backend, optionally filtered
  getProducts(category?: string): Observable<Product[]> {
    let params = new HttpParams();
    if (category) {
      params = params.set('category', category);
    }
    return this.http.get<Product[]>(this.getProductsRoute, { params });
  }

  getProductById(id: string): Observable<Product> {
  return this.http.get<Product>(`${this.getProductRoute}/${id}`);
}

  // Method to add a product
  addProduct(product: Product): Observable<any> {
    return this.http.post(this.postProductsRoute, product);
  }
}
