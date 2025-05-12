import { Component, Input, Output } from '@angular/core';
import { Product } from '../../Admin/Add-product/product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
@Input() product!: Product;

ngOnChanges() {
    // This will log whenever the input product changes.
    console.log(this.product); // Check if name and price are being passed correctly
  }
}
