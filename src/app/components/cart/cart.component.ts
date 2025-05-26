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
  imports: [CommonModule, FormsModule, SpinnerComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  cartProducts: Product[] = [];
  total: number = 0;
  isLoading = false;

    quantities: { [productId: string]: number } = {};

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.loadCartProducts();
  }

   loadCartProducts() {
    this.isLoading = true;
    const cartItems = this.cartService.getProducts();
    const ids = Object.keys(cartItems);


    this.productService.getProducts().subscribe({
      next: (allProducts: Product[]) => {
        this.cartProducts = allProducts.filter(product => ids.includes(product._id));
        this.total = this.cartProducts.reduce(
          (sum, p) => sum + p.price * (this.quantities[p._id] || 1), 0);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load cart products', err);
        this.isLoading = false;
      }
    });
  }

   removeFromCart(productId: string) {
    this.cartService.remove(productId);
    this.loadCartProducts();
  }

increaseQuantity(productId: string) {
  const currentQty = this.quantities[productId] || 1;
  this.updateQuantity(productId, currentQty + 1);
}

decreaseQuantity(productId: string) {
  const currentQty = this.quantities[productId] || 1;
  if (currentQty > 1) {
    this.updateQuantity(productId, currentQty - 1);
  } else {
    // Optional: if quantity hits zero, remove product
    this.removeFromCart(productId);
  }
}

updateQuantity(productId: string, qty: number) {
  this.cartService.updateQuantity(productId, qty);
  this.quantities[productId] = qty;
  this.calculateTotal();
}

calculateTotal() {
  this.total = this.cartProducts.reduce(
    (sum, p) => sum + p.price * (this.quantities[p._id] || 1),
    0
  );
}


}
