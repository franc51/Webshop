import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-category',
  standalone: true,
  imports: [],
  templateUrl: './product-category.component.html',
  styleUrl: './product-category.component.css'
})
export class ProductCategoryComponent {

  constructor(private router: Router) {}

  goToPhones(){
    this.router.navigate(['/products'], { queryParams: { category: 'phones' } });

}
}
