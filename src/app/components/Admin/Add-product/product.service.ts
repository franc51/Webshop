import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// best practice
export interface Product {
  name: string;
  category: string;
  pictureUrl: string;
  price: number;
  newArrival: boolean;
  bestseller: boolean;
  featured: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private postProductsRoute = 'http://localhost:5000/api/add-products';
  private getProductsRoute = 'http://localhost:5000/api/get-all-products';

  constructor(private http: HttpClient) { }

   // Fetch products from the backend
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.getProductsRoute);
  }

  // Method to add a product
  addProduct(product: Product): Observable<any> {
    return this.http.post(this.postProductsRoute, product);
  }
}
