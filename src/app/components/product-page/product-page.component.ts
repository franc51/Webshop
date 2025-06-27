import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../Admin/Add-product/product.service';
import { Product } from '../Admin/Add-product/product.service';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from '../Spinner/spinner/spinner.component';

@Component({
  selector: 'app-product-page',
  standalone: true,
  imports: [CommonModule, SpinnerComponent],
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.css']
})
export class ProductPageComponent implements OnInit {
  product: Product | null = null;
  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadProduct(id);
      }
    });
  }

  loadProduct(id: string) {
    this.loading = true;
    this.productService.getProductById(id).subscribe(
      (data) => {
        this.product = data;
        this.loading = false;
      },
      (error) => {
        console.error('Error loading product:', error);
        this.loading = false;
      }
    );
  }
}
