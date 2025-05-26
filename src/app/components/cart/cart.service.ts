import { Injectable } from '@angular/core';

interface CartItems {
  [productId: string]: number; // productId => quantity
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private storageKey = 'cartProducts';

  private getCart(): CartItems {
    return JSON.parse(localStorage.getItem(this.storageKey) || '{}');
  }

  private saveCart(cart: CartItems) {
    localStorage.setItem(this.storageKey, JSON.stringify(cart));
  }

  getProducts(): CartItems {
    return this.getCart();
  }

  getCount(): number {
    const cart = this.getCart();
    return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  }

  add(id: string, quantity: number = 1) {
    const cart = this.getCart();
    if (cart[id]) {
      cart[id] += quantity;
    } else {
      cart[id] = quantity;
    }
    this.saveCart(cart);
  }

  remove(id: string) {
    const cart = this.getCart();
    delete cart[id];
    this.saveCart(cart);
  }

  updateQuantity(id: string, quantity: number) {
    const cart = this.getCart();
    if (quantity <= 0) {
      delete cart[id];
    } else {
      cart[id] = quantity;
    }
    this.saveCart(cart);
  }

  isInCart(id: string): boolean {
    const cart = this.getCart();
    return cart.hasOwnProperty(id);
  }

  getQuantity(id: string): number {
    const cart = this.getCart();
    return cart[id] || 0;
  }
  clearCart() {
  localStorage.removeItem(this.storageKey);
}
}
