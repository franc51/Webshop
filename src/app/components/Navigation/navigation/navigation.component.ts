import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css',
})
export class NavigationComponent {

menuOpen = false;
toggleMenu() {
  this.menuOpen = !this.menuOpen;
  const navResponsive = document.querySelector('.nav_responsive') as HTMLElement | null;

  // Check if the element is not null before accessing its properties
  if (navResponsive) {
    if (this.menuOpen) {
      navResponsive.classList.add('active');
    } else {
      navResponsive.classList.remove('active');
    }
  }
}

  constructor(private http: HttpClient, private router: Router) {}

  checkIfLoggedIn() {
    console.log('Image clicked, checking token...'); // ✅ Confirm it's running
    const token = localStorage.getItem('cyber_token');
    if (token) {
      this.router.navigate(['/account']);
    } else {
      this.router.navigate(['/login']);
    }
  }

}
