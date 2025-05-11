import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProductCategoryComponent } from '../../Product-category/product-category/product-category.component';
import { ProductListComponent } from '../../Product-list/product-list/product-list.component';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, ProductCategoryComponent, ProductListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
