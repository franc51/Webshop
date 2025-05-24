import {
  Component,
  EventEmitter,
  Output,
  ViewEncapsulation,
} from '@angular/core';
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
    MatRadioModule,
  ],
  templateUrl: './product-filter.component.html',
  styleUrl: './product-filter.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class ProductFilterComponent {
  @Output() filtersChanged = new EventEmitter<any>();

  categories = [
    { label: 'God give me anything', value: '' },
    { label: 'Phones', value: 'phones' },
    { label: 'Smart-watches', value: 'smart-watches' },
    { label: 'Cameras', value: 'cameras' },
    { label: 'Headphones', value: 'headphones' },
    { label: 'Computers', value: 'computers' },
    { label: 'Gaming', value: 'gaming' },
  ];
  priceRanges = [
    { label: 'Any price', value: { min: 0, max: 6000 } },
    { label: '0 - 500', value: { min: 0, max: 500 } },
    { label: '500 - 1000', value: { min: 500, max: 1000 } },
    { label: '1000 - 2000', value: { min: 1000, max: 2000 } },
    { label: '2000 - 3000', value: { min: 2000, max: 3000 } },
    { label: '3000 - 6000', value: { min: 3000, max: 6000 } },
  ];
  selectedPriceRange: { min: number; max: number } | null = null;

  selectedCategory = '';
  priceMin: number | null = null;
  priceMax: number | null = null;
  ratingMin: number | null = null;

  phoneScreenSizes = [
    { label: 'Any', value: '' },
    { label: 'Min. 5.5"', value: '5.5"' },
    { label: 'Min. 6"', value: '6"' },
    { label: 'Min. 6.5"', value: '6.5"' },
    { label: 'Min. 7"', value: '7"' },
  ];

  phoneBatteries = [
    { label: 'Any', value: '' },
    { label: 'Min. 3000mAh', value: '3000mAh' },
    { label: 'Min. 4000mAh', value: '4000mAh' },
    { label: 'Min. 5000mAh', value: '5000mAh' },
  ];

  phoneRAMs = [
    { label: 'Any', value: null },
    { label: 'Min. 4 GB', value: 4 },
    { label: 'Min. 6 GB', value: 6 },
    { label: 'Min. 8 GB', value: 8 },
  ];

  phoneCameras = [
    { label: 'Any', value: '' },
    { label: 'Min. 12 MP', value: '12 MP' },
    { label: 'Min. 48 MP', value: '48 MP' },
    { label: 'Min. 108 MP', value: '108 MP' },
  ];

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
      priceMin: this.selectedPriceRange ? this.selectedPriceRange.min : null,
      priceMax: this.selectedPriceRange ? this.selectedPriceRange.max : null,
      ratingMin: this.ratingMin,
    };

    if (this.selectedCategory === 'phones') {
      Object.assign(filters, this.phoneFilters);
    }

    this.filtersChanged.emit(filters);
  }
}
