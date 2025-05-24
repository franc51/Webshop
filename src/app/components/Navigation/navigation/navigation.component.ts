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
    this.favoriteCount = this.favoriteService.getCount();
  }
  updatecartCount() {
    this.cartCount = this.cartService.getCount();
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
    console.log('checking token...'); // ✅ Confirm it's running
    const token = localStorage.getItem('cyber_token');
    if (token) {
      this.router.navigate(['/account']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
