// order.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { orderModel } from './order.model'; // Adjust the path

@Injectable({ providedIn: 'root' })
export class OrderService {
  constructor(private http: HttpClient) {}

  createOrder(order: orderModel) {
    return this.http.post<orderModel>('/api/orders', order);
  }
}
