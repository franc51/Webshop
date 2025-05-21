import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Product, ProductService } from '../product.service';

@Component({
  selector: 'app-add-products',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule],
  templateUrl: './add-products.component.html',
  styleUrl: './add-products.component.css',
})
export class AddProductsComponent {
  // Define a product object that holds the form data
  product: Product = {
    _id: '',
    name: '',
    category: '',
    pictureUrl: '',
    price: 0,
    newArrival: false,
    bestseller: false,
    featured: false,
  };

  // Inject the ProductService into the component
  constructor(private productService: ProductService) {}

  // Method that handles form submission
  onSubmit(form: any) {
    if (form.valid) {
      this.productService.addProduct(this.product).subscribe({
        next: (response) => {
          console.log('Product added successfully:', response);
          // Handle success, e.g., show a message, clear form, etc.
        },
        error: (err) => {
          console.error('Error adding product:', err);
          // Handle error, e.g., show an error message
        },
      });
    } else {
      console.log('Form is invalid');
    }
  }
}
