import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { ProductService } from '../../../core/services/product';
import { Product } from '../../../core/models/product.model';
import { ProductCardComponent } from '../../products/product-card/product-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  flashProducts: Product[] = [];
  recommendedProducts: Product[] = [];
  loading = false;

  categories = [
    { name: 'T-Shirt', icon: '👕', slug: 't-shirt' },
    { name: 'Jacket', icon: '🧥', slug: 'jacket' },
    { name: 'Jeans', icon: '👖', slug: 'jeans' },
    { name: 'Shoes', icon: '👟', slug: 'shoes' },
    { name: 'Watches', icon: '⌚', slug: 'watches' },
    { name: 'All', icon: '🛍️', slug: 'all' }
  ];

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;

    this.productService.getProducts().subscribe({
      next: (data: Product[]) => {
        this.products = data ?? [];
        this.flashProducts = this.products.slice(0, 4);
        this.recommendedProducts = this.products.slice(0, 8);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  goToProducts(): void {
    this.router.navigate(['/products']);
  }

  goToCategory(slug: string): void {
    if (slug === 'all') {
      this.router.navigate(['/products']);
    } else {
      this.router.navigate(['/products'], {
        queryParams: { category: slug }
      });
    }
  }
}
