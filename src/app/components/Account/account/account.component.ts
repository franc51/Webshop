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
import { AuthService } from '../../Navigation/auth.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    OrderHistoryComponent,
    CreditCardsComponent,
    AddressesComponent,
  ],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent implements OnInit {
  name: string = '';
  email: string = '';
  password: string = '';
  newPassword: string = '';
  confirmNewPassword: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private auth: AuthService
  ) {}

  showFeatNotAvailable() {
    alert('Feature not available yet!');
  }

  ngOnInit() {
    this.auth.enforceLogin(); // out if not logged

    this.auth.getUserInfo()?.subscribe({
      next: (user: any) => {
        this.name = user.username;
        this.email = user.email;
      },
      error: (err) => {
        console.error('Failed to fetch user info:', err);
      },
    });
  }

  logOut() {
    localStorage.removeItem('cyber_token');
    this.router.navigate(['/']);
  }
  goToAddProducts() {
    this.router.navigate(['/add-new-product']);
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
    this.http
      .put(`${environment.apiUrl}/api/user`, updatedData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('cyber_token')}`,
        },
      })
      .subscribe({
        next: (response) => {
          console.log('Account updated successfully', response);
          alert('Your account has been updated!');
        },
        error: (error) => {
          console.error('Error updating account', error);
          alert('Failed to update account');
        },
      });
  }
}
