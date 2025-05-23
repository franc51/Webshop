import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// best practice
export interface Product {
  _id: string;
  name: string;
  category: string;
  pictureUrl: string;
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
  private postProductsRoute = 'http://localhost:5000/api/add-products';
  private getProductsRoute = 'http://localhost:5000/api/get-all-products';

  constructor(private http: HttpClient) {}

  // Fetch products from the backend, optionally filtered
  getProducts(category?: string): Observable<Product[]> {
    let params = new HttpParams();
    if (category) {
      params = params.set('category', category);
    }
    return this.http.get<Product[]>(this.getProductsRoute, { params });
  }

  // Method to add a product
  addProduct(product: Product): Observable<any> {
    return this.http.post(this.postProductsRoute, product);
  }
}
