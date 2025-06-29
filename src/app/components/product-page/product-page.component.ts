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
  isFading = false;
  hoverImage: string | null = null;

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

 get currentImage() {
  return this.hoverImage || this.product?.pictureUrls?.[0] || '';
}


  onHover(img: string) {
    this.isFading = true;
    setTimeout(() => {
      this.hoverImage = img;
      this.isFading = false;
    }, 300); // duration matches CSS transition
  }

  onHoverLeave() {
    this.isFading = true;
    setTimeout(() => {
      this.hoverImage = null;
      this.isFading = false;
    }, 300);
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
   getMajorMinorParts(price: number) {
    const [major, minor] = price
      .toFixed(2) // ensures two decimals: "3899.99"
      .replace('.', ',') // convert decimal to comma: "3899,99"
      .split(','); // split into ["3899", "99"]

    const majorFormatted = parseInt(major, 10).toLocaleString('de-DE'); // "3.899"

    return { major: majorFormatted, minor };
  }
}
