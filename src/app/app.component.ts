import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from './components/Navigation/navigation/navigation.component';
import {
  Router,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError,
} from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { initializeApp, FirebaseApp } from "firebase/app";
import { getAnalytics, Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyA0OIwQCMH2lJ0SMirNj7bNghzMKrjRf9E",
  authDomain: "cyber-aed44.firebaseapp.com",
  projectId: "cyber-aed44",
  storageBucket: "cyber-aed44.firebasestorage.app",
  messagingSenderId: "535759361456",
  appId: "1:535759361456:web:f2fcf0901b00e5b8b07275",
  measurementId: "G-R7F3HRY9MT"
};
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavigationComponent, CommonModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {

  title = 'Webshop';
  loading = false;

  private app: FirebaseApp;
  private analytics: Analytics;

  constructor(private router: Router) {
    this.app = initializeApp(firebaseConfig);
    this.analytics = getAnalytics(this.app);
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.loading = true;
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.loading = false;
      }
    });
  }
}
