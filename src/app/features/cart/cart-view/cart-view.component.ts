import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../../core/services/cart';
import { NotificationService } from '../../../core/services/notification';
import { CartItem } from '../../../core/models/cart.model';
import { CartItemComponent } from '../cart-item/cart-item.component';

@Component({
  selector: 'app-cart-view',
  standalone: true,
  imports: [CommonModule, CartItemComponent],
  templateUrl: './cart-view.component.html',
  styleUrls: ['./cart-view.component.scss']
})
export class CartViewComponent implements OnInit {
  cartItems: CartItem[] = [];
  total = 0;

  constructor(
    private cartService: CartService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe(items => {
      this.cartItems = items;
      this.total = this.cartService.getTotal();
    });
  }

  onUpdateQuantity(productId: number, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity);
  }

  onRemoveItem(productId: number): void {
    this.cartService.removeFromCart(productId);
    this.notificationService.success('Producto eliminado del carrito');
  }

  onCheckout(): void {
    this.notificationService.success('¡Gracias por tu compra! (Demo)');
    // Aquí iría la lógica real de checkout
  }

  navigateToProducts(): void {
    this.router.navigate(['/products']);
  }

  getItemCount(): number {
    return this.cartService.getItemCount();
  }
}