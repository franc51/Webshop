import { Component, Input, Output } from '@angular/core';
import { Product } from '../../Admin/Add-product/product.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
})
export class ProductCardComponent {
  @Input() product!: Product;

    isFavorite = false;

  ngOnInit() {
    this.loadFavoriteState();
  }

  loadFavoriteState() {
    const favorites = JSON.parse(localStorage.getItem('favoriteProducts') || '[]');
    this.isFavorite = favorites.includes(this.product._id);
  }

  toggleFavorite() {
    let favorites: string[] = JSON.parse(localStorage.getItem('favoriteProducts') || '[]');

    if (this.isFavorite) {
      favorites = favorites.filter(id => id !== this.product._id);
    } else {
      favorites.push(this.product._id);
    }

    localStorage.setItem('favoriteProducts', JSON.stringify(favorites));
    this.isFavorite = !this.isFavorite;
  }


  getMajorMinorParts(price: number) {
    const [major, minor] = price
      .toFixed(2) // ensures two decimals: "3899.99"
      .replace('.', ',') // convert decimal to comma: "3899,99"
      .split(','); // split into ["3899", "99"]

    const majorFormatted = parseInt(major, 10).toLocaleString('de-DE'); // "3.899"

    return { major: majorFormatted, minor };
  }

  ngOnChanges() {
    // This will log whenever the input product changes.
    console.log(this.product); // Check if name and price are being passed correctly
  }
}
