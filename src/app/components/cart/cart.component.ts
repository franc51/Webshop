import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product, ProductService } from '../Admin/Add-product/product.service';
import { CartService } from './cart.service';
import { SpinnerComponent } from '../Spinner/spinner/spinner.component';
import { ProductCardComponent } from '../Product card/product-card/product-card.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, SpinnerComponent, ProductCardComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  cartProducts: Product[] = [];
  isLoading = false;

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.loadFavorites();
  }

  loadFavorites() {
    const cartIds = this.cartService.getProducts();
    this.isLoading = true;
    this.productService.getProducts().subscribe((allProducts: Product[]) => {
      this.cartProducts = allProducts.filter((product) =>
        cartIds.includes(product._id)
      );
      this.isLoading = false;
    });
  }
}
