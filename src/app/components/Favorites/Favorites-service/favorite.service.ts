import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private storageKey = 'favoriteProducts';

  getFavorites(): string[] {
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }

  getCount(): number {
    return this.getFavorites().length;
  }

  add(id: string) {
    const favs = this.getFavorites();
    if (!favs.includes(id)) {
      favs.push(id);
      localStorage.setItem(this.storageKey, JSON.stringify(favs));
    }
  }

  remove(id: string) {
    const favs = this.getFavorites().filter(f => f !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(favs));
  }

  isFavorite(id: string): boolean {
    return this.getFavorites().includes(id);
  }
}
