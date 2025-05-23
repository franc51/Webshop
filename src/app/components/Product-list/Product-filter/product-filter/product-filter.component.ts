import { Component, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-product-filter',
  standalone: true,
imports: [
  CommonModule,
  FormsModule,
  MatExpansionModule,
  MatSelectModule,
  MatFormFieldModule,
  MatRadioModule
],
  templateUrl: './product-filter.component.html',
  styleUrl: './product-filter.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class ProductFilterComponent {
  @Output() filtersChanged = new EventEmitter<any>();

  categories = [
    { label: 'Phones', value: 'phones' },
    { label: 'Smart-watches', value: 'smart-watches' },
    { label: 'Cameras', value: 'cameras' },
    { label: 'Headphones', value: 'headphones' },
    { label: 'Computers', value: 'computers' },
    { label: 'Gaming', value: 'gaming' },
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
