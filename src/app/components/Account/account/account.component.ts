import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { OrderHistoryComponent } from '../../Order History/order-history/order-history.component';
import { CreditCardsComponent } from '../../Credit-cards/credit-cards/credit-cards.component';
import { AddressesComponent } from '../../Addresses/addresses/addresses.component';

import { environment } from '../../../../../environment';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule, OrderHistoryComponent, CreditCardsComponent, AddressesComponent],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent implements OnInit {
  name: string = '';
  email: string = '';
  password: string = '';
  newPassword: string = '';
  confirmNewPassword: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  showFeatNotAvailable(){
    alert("Feature not available yet!");
  }

  ngOnInit() {
    // Load the user's current info from the server when the page loads
    this.getUserInfo();
  }

  logOut() {
    localStorage.removeItem('cyber_token');
    this.router.navigate(['/']);
  }
  goToAddProducts() {
    this.router.navigate(['/add-new-product']);
  }


  getUserInfo() {
    const token = localStorage.getItem('cyber_token');
    console.log('Retrieved token from localStorage:', token); // ✅ Log the token

    if (token) {
      this.http.get('${environment.apiUrl}/api/user', {
        headers: { Authorization: `Bearer ${token}` },
      }).subscribe({
        next: (response: any) => {
          console.log('Fetched user data from backend:', response); // ✅ Log full response
          this.name = response.username;
          this.email = response.email;
          console.log('Updated component state: name =', this.name, ', email =', this.email); // ✅ Log state update
        },
        error: (error) => {
          console.error('❌ Error fetching user info:', error); // ✅ Log full error
          alert('Please Log in');
        }
      });
    } else {
      console.warn('⚠️ No auth_token found in localStorage');
    }
  }


  updateUser() {
    // Validate password fields
    if (this.newPassword && this.newPassword !== this.confirmNewPassword) {
      alert('Passwords do not match!');
      return;
    }

    const updatedData = {
      username: this.name,
      email: this.email,
      password: this.password,
      newPassword: this.newPassword,
    };

    // Send updated data to the backend
    this.http.put('${environment.apiUrl}/api/user', updatedData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('cyber_token')}`,
      },
    }).subscribe({
      next: (response) => {
        console.log('Account updated successfully', response);
        alert('Your account has been updated!');
      },
      error: (error) => {
        console.error('Error updating account', error);
        alert('Failed to update account');
      }
    });
  }
}
