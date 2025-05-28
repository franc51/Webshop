import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Route } from '@angular/router';
import { Product, ProductService } from '../Admin/Add-product/product.service';
import { SpinnerComponent } from '../Spinner/spinner/spinner.component';
import { OrderConfirmationComponent } from '../order-confirmation/order-confirmation.component';
import { ConfettiService } from '../Shared/confetti.service';
import { CartService } from './cart.service';
import { OrderService } from './order.service';

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
    private cartService: CartService,
    private orderService: OrderService,
    private confetti: ConfettiService,
    private router: Router
  ) {}

    ngOnInit() {
    this.loadCartProducts();
    this.loadSavedAddresses();
    this.loadSavedCards(); // 👈 Load credit cards
  }

loadCartProducts() {
  this.isLoading = true;

  const cartItems = this.cartService.getProducts();
  console.log('Cart items:', cartItems); // Debug

  const ids = Object.keys(cartItems);

  this.productService.getProducts().subscribe({
    next: (allProducts: Product[]) => {
      this.cartProducts = allProducts.filter(product =>
        ids.includes(product._id)
      );

      // 👇 Use quantities only from cartItems to avoid desync
      this.quantities = { ...cartItems };

      this.total = parseFloat(
        this.cartProducts
          .reduce((sum, p) => sum + p.price * (this.quantities[p._id] || 1), 0)
          .toFixed(2)
      );

      this.isLoading = false;
    },
    error: err => {
      console.error('Failed to load cart products', err);
      this.isLoading = false;
    },
  });
}


  removeFromCart(productId: string) {
    this.cartService.remove(productId);
    this.loadCartProducts();
  }

increaseQuantity(productId: string) {
  this.isLoading = true;
  this.cartService.add(productId);
  setTimeout(() => this.loadCartProducts(), 500);
}



  decreaseQuantity(productId: string) {
    this.isLoading = true;
    const currentQty = this.quantities[productId] || 1;
    if (currentQty > 1) {
      this.updateQuantity(productId, currentQty - 1);
    } else {
      // Optional: if quantity hits zero, remove product
      this.removeFromCart(productId);
    }
    this.isLoading = false;
  }

 updateQuantity(productId: string, qty: number) {
  if (qty == null || isNaN(qty)) return;
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

  addresses: string[] = [];
  selectedAddress: string = '';
  creditCards: string[] = [];
  selectedCard: string = '';

  loadSavedAddresses() {
    // Example: replace this with your real service
    this.addresses = [
      '123 Main St, Cityville',
      '456 Oak Dr, Townsville',
      '789 Pine Ln, Hamletburg',
    ];

    // Optionally select the first by default
    this.selectedAddress = this.addresses[0] || '';
  }

  loadSavedCards() {
    // Replace this with your actual card-fetching logic
    this.creditCards = [
      '4111111111111111',
      '5500000000000004',
      '340000000000009',
    ];

    this.selectedCard = this.creditCards[0] || '';
  }

  checkout() {
    this.isLoading = true
   setTimeout(() =>
  {
    this.confetti.launchBasicConfetti();
    this.cartService.clearCart();
    this.cartProducts = [];
    this.quantities = {};
    this.total = 0;
    this.router.navigate(['/order']);
  }, 1000);
  }
}
