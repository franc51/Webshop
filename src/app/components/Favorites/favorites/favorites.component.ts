import { Component, OnInit } from '@angular/core';
import { Product, ProductService } from '../../Admin/Add-product/product.service';
import { FavoriteService } from '../Favorites-service/favorite.service';
import { ProductCardComponent } from '../../Product card/product-card/product-card.component';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [NgIf, NgFor, ProductCardComponent],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})
export class FavoritesComponent implements OnInit {
  favoriteProducts: Product[] = [];

  constructor(
    private productService: ProductService,
    private favoriteService: FavoriteService
  ) {}

  ngOnInit() {
    this.loadFavorites();
  }

  loadFavorites() {
    const favoriteIds = this.favoriteService.getFavorites();
    this.productService.getProducts().subscribe((allProducts: Product[]) => {
      this.favoriteProducts = allProducts.filter(product =>
        favoriteIds.includes(product._id)
      );
    });
  }
}
