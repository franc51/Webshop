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

    this.http.post('${environment.apiUrl}/api/signup', userData).subscribe({
      next: (response) => {
        alert('Signup successful!');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        alert('Signup failed: ' + error.error.message || 'Unknown error');
        console.error(error);
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }
}
