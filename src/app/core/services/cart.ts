import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../models/cart.model';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartSubject = new BehaviorSubject<CartItem[]>(this.loadCart());
  public cart$ = this.cartSubject.asObservable();

  private loadCart(): CartItem[] {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  }

  private saveCart(cart: CartItem[]): void {
    localStorage.setItem('cart', JSON.stringify(cart));
    this.cartSubject.next(cart);
  }

  addToCart(product: Product): void {
    const cart = this.cartSubject.value;
    const existingItem = cart.find(item => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push({ product, quantity: 1 });
    }

    this.saveCart(cart);
  }

  removeFromCart(productId: number): void {
    const cart = this.cartSubject.value.filter(item => item.product.id !== productId);
    this.saveCart(cart);
  }

  updateQuantity(productId: number, quantity: number): void {
    const cart = this.cartSubject.value;
    const item = cart.find(item => item.product.id === productId);

    if (item) {
      item.quantity = Math.max(1, quantity);
      this.saveCart(cart);
    }
  }

  clearCart(): void {
    this.saveCart([]);
  }

  getTotal(): number {
    return this.cartSubject.value.reduce(
      (total, item) => total + (item.product.price * item.quantity),
      0
    );
  }

  getItemCount(): number {
    return this.cartSubject.value.reduce(
      (count, item) => count + item.quantity,
      0
    );
  }

  getCart(): CartItem[] {
    return this.cartSubject.value;
  }
}