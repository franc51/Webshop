import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SpinnerComponent } from '../../Spinner/spinner/spinner.component';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule, SpinnerComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {

  constructor(private http: HttpClient, private router: Router) {}

  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  isLoading = false;

  onSubmit() {
    this.isLoading = true;
    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    const userData = {
      username: this.name,
      email: this.email,
      password: this.password,
    };

    this.http.post('http://localhost:5000/api/signup', userData).subscribe({
      next: (response) => {
        alert('Signup successful!');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        alert('Signup failed: ' + error.error.message || 'Unknown error');
        console.error(error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
