import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { SpinnerComponent } from '../../Spinner/spinner/spinner.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule, SpinnerComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  email = '';
  password = '';
  isLoading = false;

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    this.isLoading = true;
    console.log('Logging in with:', this.email, this.password);

    const loginData = {
      email: this.email,
      password: this.password,
    };

    this.http.post('http://127.0.0.1:5000/api/login', loginData).subscribe({
      next: (response: any) => {
        console.log('Login successful', response);

        // ✅ Store the token in localStorage
        if (response.token) {
          localStorage.setItem('cyber_token', response.token);
          console.log('Token stored in localStorage');
        } else {
          console.warn('No token received in response');
        }

        // Redirect to account or home page
        this.router.navigate(['/account']);
      },
      error: (error) => {
        console.error('Login failed', error);
        alert('Invalid email or password');
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
