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
  products: Product[] = [];        // filtered products
  allProducts: Product[] = [];     // full list fetched from backend
  loading: boolean = false;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const category = params['category'];
      this.fetchProducts(category);
    });
  }

  // Called when filters are changed from the filter component
  onFiltersChanged(filters: any) {
    this.applyFilters(filters);
  }

  // Fetch products (filtered by category server-side if passed)
  fetchProducts(category?: string) {
    this.loading = true;
    this.productService.getProducts(category).subscribe(
      (data) => {
        this.allProducts = data;
        this.products = data; // initially show all
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching products:', error);
        this.loading = false;
      }
    );
  }

  // Apply filters client-side on allProducts
  applyFilters(filters: any) {
    this.products = this.allProducts.filter(product => {
      const matchCategory = !filters.category || product.category === filters.category;
      const matchPriceMin = filters.priceMin == null || product.price >= filters.priceMin;
      const matchPriceMax = filters.priceMax == null || product.price <= filters.priceMax;
      const matchRating = filters.ratingMin == null || product.rating >= filters.ratingMin;

      return matchCategory && matchPriceMin && matchPriceMax && matchRating;
    });
  }
}

