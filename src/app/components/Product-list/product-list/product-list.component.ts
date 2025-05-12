import { Component, OnInit } from '@angular/core';
import { ProductCardComponent } from '../../Product card/product-card/product-card.component';
import { ProductService, Product } from '../../Admin/Add-product/product.service';
import { Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [ProductCardComponent, CommonModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent implements OnInit {

  products: Product[] = []; // Array to hold products
  loading: boolean = false;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.fetchProducts();
  }

  fetchProducts() {
    this.loading = true; // Set loading to true before fetching data
    this.productService.getProducts().subscribe(
      (data) => {
        console.log('API Response:', data); // Log the full response

        // Directly assign data to products, as data is already an array
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
