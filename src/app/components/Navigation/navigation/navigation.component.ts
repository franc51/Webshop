import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

/* Services import */
import { FavoriteService } from '../../Favorites/Favorites-service/favorite.service';
import { CartService } from '../../cart/cart.service';
@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css',
})
export class NavigationComponent {
  menuOpen = false;

  favoriteCount = 0;
  cartCount = 0;

  constructor(
    private http: HttpClient,
    private router: Router,
    private favoriteService: FavoriteService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.updateFavoriteCount();
    this.updatecartCount();
  }
  updateFavoriteCount() {
    this.favoriteService.favoriteCount$.subscribe(count => {
      this.favoriteCount = count
    })
  }
  updatecartCount() {
   this.cartService.cartCount$.subscribe(count => {
      this.cartCount = count
    })
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    const navResponsive = document.querySelector(
      '.nav_responsive'
    ) as HTMLElement | null;

    // Check if the element is not null before accessing its properties
    if (navResponsive) {
      if (this.menuOpen) {
        navResponsive.classList.add('active');
      } else {
        navResponsive.classList.remove('active');
      }
    }
  }

  // Method to close the menu when a link is clicked
  closeMenu() {
    this.menuOpen = false;
    const navResponsive = document.querySelector(
      '.nav_responsive'
    ) as HTMLElement | null;
    if (navResponsive) {
      navResponsive.classList.remove('active');
    }
  }

  checkIfLoggedIn() {
    console.log('checking token...');
    const token = localStorage.getItem('cyber_token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }
    try {
      // Decode JWT payload (middle part of token)
      const payload = JSON.parse(atob(token.split('.')[1]));
      // Check expiration
      const isExpired = payload.exp * 1000 < Date.now();
      if (isExpired) {
        this.router.navigate(['/login']);
      } else {
        this.router.navigate(['/account']);
      }
    } catch (err) {
      console.error('Invalid token format', err);
      this.router.navigate(['/login']);
    }
  }
}
