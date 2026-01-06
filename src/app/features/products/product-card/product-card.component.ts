import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent implements OnInit {
  @Input() product!: Product;
  @Input() showActions = true;

  @Output() addToCart = new EventEmitter<Product>();
  @Output() edit = new EventEmitter<Product>();
  @Output() delete = new EventEmitter<Product>();

  isAdmin = false;
  private fallback = 'https://via.placeholder.com/300x200?text=Sin+Imagen';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // ✅ usa tu método real
    this.isAdmin = this.authService.isAuthenticated();
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

  // ✅ Imagen principal (primera del array)
  getImageUrl(): string {
    const imgs: any = (this.product as any)?.images;
    if (Array.isArray(imgs) && imgs.length > 0) return imgs[0];
    if (typeof imgs === 'string' && imgs.length > 0) return imgs;
    return this.fallback;
  }

  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src = this.fallback;
  }

  // Acciones
  onAddToCart(): void {
    this.addToCart.emit(this.product);
  }

  onEdit(): void {
    if (!this.isAdmin) return;
    this.edit.emit(this.product);
  }

  onDelete(): void {
    if (!this.isAdmin) return;
    this.delete.emit(this.product);
  }
}
