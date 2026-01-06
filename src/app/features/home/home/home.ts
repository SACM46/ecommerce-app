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
  styleUrls: ['./home.scss'],
})
export class HomeComponent implements OnInit {

  loading = true;

  products: Product[] = [];
  flashProducts: Product[] = [];

  categories = [
    { name: 'T-Shirt', icon: '👕', slug: 'clothes' },
    { name: 'Jacket', icon: '🧥', slug: 'clothes' },
    { name: 'Jeans', icon: '👖', slug: 'clothes' },
    { name: 'Shoes', icon: '👟', slug: 'shoes' },
    { name: 'Watches', icon: '⌚', slug: 'others' },
    { name: 'All', icon: '🛍️', slug: 'all' },
  ];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;

    this.productService.getProducts().subscribe({
      next: (data: any[]) => {

        // 🔑 NORMALIZAMOS IMÁGENES (MUY IMPORTANTE)
        this.products = data.map(p => {
          let imgs = p.images;

          // Si viene como string tipo '["url"]'
          if (typeof imgs === 'string') {
            try {
              imgs = JSON.parse(imgs);
            } catch {
              imgs = [];
            }
          }

          return {
            ...p,
            images: Array.isArray(imgs) ? imgs : []
          };
        });

        // ⚡ Ofertas relámpago = primeros 6 productos reales
        this.flashProducts = this.products.slice(0, 6);

        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  goToCategory(slug: string): void {
    if (slug === 'all') {
      // redirigir a todos los productos
      window.location.href = '/products';
      return;
    }

    window.location.href = `/products?category=${slug}`;
  }}