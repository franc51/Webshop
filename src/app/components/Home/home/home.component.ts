import { Component } from '@angular/core';
import { Navigation } from '@angular/router';
import { NavigationComponent } from "../../Navigation/navigation/navigation.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavigationComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
