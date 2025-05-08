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
