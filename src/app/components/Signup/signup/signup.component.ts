import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SpinnerComponent } from '../../Spinner/spinner/spinner.component';
import { UserModel } from './user.model';
import { environment } from '../../../../../environment';
@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    SpinnerComponent,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  constructor(private http: HttpClient, private router: Router) {}

  isAdmin: boolean = false; // for future features
  isLoading = false;

  name = '';
  email = '';
  password = '';
  confirmPassword = '';

  onSubmit() {
    if (!this.name || !this.email || !this.password || !this.confirmPassword) {
      alert('All fields are required!');
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    this.isLoading = true;

    const userData: UserModel = {
      name: this.name,
      email: this.email,
      password: this.password,
      addresses: [],
      creditCards: [],
      orderHistory: [],
      isAdmin: this.isAdmin,
    };

    this.http.post(`${environment.apiUrl}/api/signup`, userData).subscribe({
      next: () => {
        alert('Signup successful!');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        const message =
          error?.error?.error ||
          error?.error?.message ||
          'Signup failed. Please try again.';
        alert(message);
        console.error('Signup error:', error);
        this.isLoading = false;
        console.log(userData);
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }
}
