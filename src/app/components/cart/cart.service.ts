import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface CartItems {
  [productId: string]: number; // productId => quantity
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private storageKey = 'cartProducts';

  private cartCountSubject = new BehaviorSubject<number>(this.computeCount());
  cartCount$ = this.cartCountSubject.asObservable();

  private getCart(): CartItems {
    return JSON.parse(localStorage.getItem(this.storageKey) || '{}');
  }

 private saveCart(cart: CartItems) {
  console.log('Saving cart to localStorage:', cart);

  if (Object.keys(cart).length === 0) {
    console.warn('⚠️ saveCart called with EMPTY cart! Trace:');
    console.trace(); // 🔍 Show full call stack
  }

  localStorage.setItem(this.storageKey, JSON.stringify(cart));
  this.updateCartCount();
}

  private computeCount(): number {
    const cart = this.getCart();
    return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  }

  private updateCartCount() {
    this.cartCountSubject.next(this.computeCount());
  }

  getProducts(): CartItems {
    return this.getCart();
  }

  getCount(): number {
    return this.computeCount();
  }

 add(id: string, quantity: number = 1) {
  const cart = this.getCart();
  cart[id] = (cart[id] || 0) + quantity;
  console.log('Adding', id, '=>', cart[id]); // 👈 See what's going on
  this.saveCart(cart);
}


  remove(id: string) {
    const cart = this.getCart();
    delete cart[id];
    this.saveCart(cart);
  }

updateQuantity(id: string, quantity: number) {
  if (!id) return; // Defensive check
  const cart = this.getCart();
  if (quantity <= 0 || isNaN(quantity)) {
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
    this.updateCartCount();
  }
}
