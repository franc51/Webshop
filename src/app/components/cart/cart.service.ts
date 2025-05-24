import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CartService {
  private storageKey = 'cartProducts';

  getProducts(): string[] {
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }

  getCount(): number {
    return this.getProducts().length;
  }

  add(id: string) {
    const favs = this.getProducts();
    if (!favs.includes(id)) {
      favs.push(id);
      localStorage.setItem(this.storageKey, JSON.stringify(favs));
    }
  }

  remove(id: string) {
    const favs = this.getProducts().filter((f) => f !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(favs));
  }

  isInCart(id: string): boolean {
    return this.getProducts().includes(id);
  }
}
