import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItem } from '../../../core/models/cart.model';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.scss']
})
export class CartItemComponent {
  @Input() cartItem!: CartItem;
  @Output() updateQuantity = new EventEmitter<{ productId: number, quantity: number }>();
  @Output() removeItem = new EventEmitter<number>();

  onIncreaseQuantity(): void {
    this.updateQuantity.emit({
      productId: this.cartItem.product.id,
      quantity: this.cartItem.quantity + 1
    });
  }

  onDecreaseQuantity(): void {
    if (this.cartItem.quantity > 1) {
      this.updateQuantity.emit({
        productId: this.cartItem.product.id,
        quantity: this.cartItem.quantity - 1
      });
    }
  }

  onRemove(): void {
    this.removeItem.emit(this.cartItem.product.id);
  }

  getImageUrl(): string {
    return this.cartItem.product.images?.[0] || 'https://via.placeholder.com/100';
  }

  onImageError(event: any): void {
    event.target.src = 'https://via.placeholder.com/100?text=Sin+Imagen';
  }

  getSubtotal(): number {
    return this.cartItem.product.price * this.cartItem.quantity;
  }
}