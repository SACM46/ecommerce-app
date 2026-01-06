import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';

import { ProductService } from '../../../core/services/product';
import { CartService } from '../../../core/services/cart';
import { NotificationService } from '../../../core/services/notification';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.scss'],
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  loading = true;

  fallback = 'https://picsum.photos/640/480';
  selectedImage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private notification: NotificationService
  ) {}

  // ✅ Getter de imágenes (array)
  get images(): string[] {
    const imgs: any = (this.product as any)?.images;
    return Array.isArray(imgs) ? imgs : [];
  }

  // ✅ Getters para NO usar "as any" en el HTML
  get categoryName(): string {
    const cat: any = (this.product as any)?.category;
    return cat?.name || 'Sin categoría';
  }

  get stockValue(): number {
    const stock: any = (this.product as any)?.stock;
    return typeof stock === 'number' ? stock : 0;
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.router.navigate(['/products']);
      return;
    }

    this.productService.getProductById(id).subscribe({
      next: (p: any) => {
        this.product = p;
        this.selectedImage = this.images[0] || this.fallback;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.router.navigate(['/products']);
      },
    });
  }

  selectImage(img: string): void {
    this.selectedImage = img;
  }

  imgError(event: Event): void {
    (event.target as HTMLImageElement).src = this.fallback;
  }

  addToCart(): void {
    if (!this.product) return;
    this.cartService.addToCart(this.product as any);
    this.notification.success('Producto agregado al carrito');
  }
}
