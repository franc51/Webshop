import { Component, OnInit } from '@angular/core';
import { ProductCardComponent } from '../../Product card/product-card/product-card.component';
import { ProductFilterComponent } from '../Product-filter/product-filter/product-filter.component';
import { ActivatedRoute } from '@angular/router';
import {
  ProductService,
  Product,
} from '../../Admin/Add-product/product.service';
import { Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from '../../Spinner/spinner/spinner.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    ProductCardComponent,
    ProductFilterComponent,
    CommonModule,
    SpinnerComponent,
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  products: Product[] = []; // Array to hold products
  loading: boolean = false;

  constructor(private productService: ProductService, private route: ActivatedRoute) {}

ngOnInit() {
  this.route.queryParams.subscribe(params => {
    const category = params['category'];
    console.log('Category from query params:', category);

    // Call fetchProducts with category to filter the products
    this.fetchProducts(category);
  });
}

  // This method will be called when filters change (category, price, etc.)
  onFiltersChanged(filters: any) {
    // If a category is selected, fetch products by category
    if (filters.category) {
      this.fetchProducts(filters.category);
    }
  }

  // Fetch products by category (or all products if no category is specified)
  fetchProducts(category?: string) {
    this.loading = true; // Set loading to true before fetching data

    // Call the service to get products by category
    this.productService.getProducts(category).subscribe(
      (data) => {
        console.log('API Response:', data); // Log the full response
        console.log(category);
        // Assign data to products
        this.products = data;

        console.log('Products:', this.products); // Log the processed products array
        this.loading = false; // Set loading to false after fetching data
      },
      (error) => {
        console.error('Error fetching products:', error);
        this.loading = false; // Set loading to false even in case of error
      }
    );
  }
}
