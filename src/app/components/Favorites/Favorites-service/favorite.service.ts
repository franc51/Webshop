import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  private storageKey = 'favoriteProducts';

  private favoriteSubject = new BehaviorSubject<number>(this.getCount())
  favoriteCount$ = this.favoriteSubject.asObservable();

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
      this.favoriteSubject.next(favs.length); // emit count
    }
  }

  remove(id: string) {
    const favs = this.getFavorites().filter((f) => f !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(favs));
    this.favoriteSubject.next(favs.length);
  }

  isFavorite(id: string) {
  return this.favoriteCount$.pipe(
    startWith(this.getCount()),
    map(() => this.getFavorites().includes(id))
  );
}

  toggleFavorite(id: string) {
  if (this.getFavorites().includes(id)) {
    this.remove(id);
  } else {
    this.add(id);
  }
}

}
