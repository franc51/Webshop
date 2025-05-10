import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProductCategoryComponent } from '../../Product-category/product-category/product-category.component';
import { ProductCardComponent } from '../../Product card/product-card/product-card.component';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, ProductCategoryComponent, ProductCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
