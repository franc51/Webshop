import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../../../backend/src/auth.service';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    // Basic form validation
    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const userData = {
      username: this.name,
      email: this.email,
      password: this.password,
    };

    // Call the backend service to register the user
    this.authService.registerUser(userData).subscribe(
      (response) => {
        console.log('User registered successfully', response);
        alert('Registration successful! You can now log in.');
        this.router.navigate(['/login']); // Redirect to login page after successful registration
      },
      (error) => {
        console.error('Error registering user', error);
        alert('Registration failed. Please try again.');
      }
    );
  }
}
