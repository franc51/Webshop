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
  apiKey: "AIzaSyAawFBsnx5c696Zu18cuq0vFpPWE1sank4",
  authDomain: "velto-70ff8.firebaseapp.com",
  projectId: "velto-70ff8",
  storageBucket: "velto-70ff8.firebasestorage.app",
  messagingSenderId: "700798167297",
  appId: "1:700798167297:web:f34a1c4a2eb7fc484b1300",
  measurementId: "G-JJRLEQHMZ3"
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
