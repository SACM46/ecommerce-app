// Importa los decoradores principales de Angular
import { Component, Input, Output, EventEmitter } from '@angular/core';

// Módulo común para directivas como *ngIf, *ngFor
import { CommonModule } from '@angular/common';

// Modelo del item del carrito
import { CartItem } from '../../../core/models/cart.model';

@Component({
  // Selector del componente
  selector: 'app-cart-item',

  // Indica que es un componente standalone
  standalone: true,

  // Módulos que utiliza el componente
  imports: [CommonModule],

  // Archivo HTML del componente
  templateUrl: './cart-item.component.html',

  // Archivo SCSS del componente
  styleUrls: ['./cart-item.component.scss']
})
export class CartItemComponent {

  // 📦 Item del carrito recibido desde el componente padre
  @Input() cartItem!: CartItem;

  // 🔄 Evento para actualizar la cantidad del producto
  // Envía el id del producto y la nueva cantidad
  @Output() updateQuantity = new EventEmitter<{
    productId: number,
    quantity: number
  }>();

  // 🗑️ Evento para eliminar el producto del carrito
  // Envía el id del producto
  @Output() removeItem = new EventEmitter<number>();

  // ➕ Aumenta la cantidad del producto
  onIncreaseQuantity(): void {
    this.updateQuantity.emit({
      productId: this.cartItem.product.id,
      quantity: this.cartItem.quantity + 1
    });
  }

  // ➖ Disminuye la cantidad del producto
  // Solo permite disminuir si la cantidad es mayor a 1
  onDecreaseQuantity(): void {
    if (this.cartItem.quantity > 1) {
      this.updateQuantity.emit({
        productId: this.cartItem.product.id,
        quantity: this.cartItem.quantity - 1
      });
    }
  }

  // 🗑️ Elimina el producto del carrito
  onRemove(): void {
    this.removeItem.emit(this.cartItem.product.id);
  }

  // 🖼️ Obtiene la imagen principal del producto
  // Si no existe, devuelve una imagen por defecto
  getImageUrl(): string {
    return this.cartItem.product.images?.[0] || 'https://via.placeholder.com/100';
  }

  // ❌ Maneja el error cuando la imagen no carga
  // Reemplaza la imagen por una genérica
  onImageError(event: any): void {
    event.target.src = 'https://via.placeholder.com/100?text=Sin+Imagen';
  }

  // 💰 Calcula el subtotal del producto
  // Precio unitario × cantidad
  getSubtotal(): number {
    return this.cartItem.product.price * this.cartItem.quantity;
  }
}
