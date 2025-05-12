import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-product-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-filter.component.html',
  styleUrl: './product-filter.component.css',
})
export class ProductFilterComponent {
  @Output() filtersChanged = new EventEmitter<any>();

  categories = [
    { label: 'phones', value: 'phones' },
    { label: 'smart-watches', value: 'smart-watches' },
    { label: 'cameras', value: 'cameras' },
    { label: 'headphones', value: 'headphones' },
    { label: 'computers', value: 'computers' },
    { label: 'gaming', value: 'gaming' },
  ];

  selectedCategory = '';
  priceMin: number | null = null;
  priceMax: number | null = null;
  ratingMin: number | null = null;

  phoneFilters = {
    screenSize: '',
    battery: '',
    ram: null,
    camera: '',
  };

  onCategoryChange() {
    // emit the category filter change to the parent component
    this.emitFilters();
  }

  emitFilters() {
    const filters: any = {
      category: this.selectedCategory,
      priceMin: this.priceMin,
      priceMax: this.priceMax,
      ratingMin: this.ratingMin,
    };

    if (this.selectedCategory === 'phones') {
      Object.assign(filters, this.phoneFilters);
    }

    this.filtersChanged.emit(filters);
  }
}
