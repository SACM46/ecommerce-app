import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';

import { CartService } from '../../../core/services/cart';
import { NotificationService } from '../../../core/services/notification';
import { CartItem } from '../../../core/models/cart.model';
import { CartItemComponent } from '../cart-item/cart-item.component';

// Servicio que contiene la fuente real de productos
import { ProductService } from '../../../core/services/product';

@Component({
  selector: 'app-cart-view',
  standalone: true,
  imports: [CommonModule, CartItemComponent],
  templateUrl: './cart-view.component.html',
  styleUrls: ['./cart-view.component.scss']
})
export class CartViewComponent implements OnInit, OnDestroy {

  // Lista de productos que se muestran en el carrito
  cartItems: CartItem[] = [];

  // Total del carrito
  total = 0;

  // Subject para manejar correctamente las suscripciones
  // y evitar fugas de memoria
  private destroy$ = new Subject<void>();

  // Bandera de control para evitar bucles infinitos
  // cuando se eliminan productos automáticamente
  private isSyncing = false;

  constructor(
    private cartService: CartService,
    private productService: ProductService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  /**
   * Se ejecuta cuando el componente se inicializa.
   * Aquí solo llamamos los métodos principales
   * para mantener el código limpio y legible.
   */
  ngOnInit(): void {
    this.listenToCartChanges();
  }

  /**
   * Se ejecuta cuando el componente se destruye.
   * Cerramos las suscripciones para evitar
   * consumo innecesario de memoria.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  // SECCIÓN: LÓGICA PRINCIPAL DEL CARRITO
  /**
   * Escucha cualquier cambio que ocurra en el carrito.
   * Cada vez que el carrito cambia:
   * 1. Se actualiza la vista
   * 2. Se valida que los productos sigan existiendo
   */
  private listenToCartChanges(): void {
    this.cartService.cart$
      .pipe(takeUntil(this.destroy$))
      .subscribe(items => {

        // Si estamos en proceso de sincronización,
        // solo actualizamos la vista y salimos
        if (this.isSyncing) {
          this.updateCartState(items);
          return;
        }

        // Actualizamos el estado visual del carrito
        this.updateCartState(items);

        // Validamos que los productos aún existan
        this.validateCartProducts(items);
      });
  }

  /**
   * Actualiza los datos visibles del carrito
   * (lista de productos y total).
   */
  private updateCartState(items: CartItem[]): void {
    this.cartItems = items;
    this.total = this.cartService.getTotal();
  }

  /**
   * Verifica que los productos del carrito
   * sigan existiendo en el catálogo real.
   * Si no existen, se eliminan automáticamente.
   */
  private validateCartProducts(items: CartItem[]): void {
    this.productService.getProducts()
      .pipe(take(1))
      .subscribe({
        next: (products) => {
          // Creamos un set con los IDs válidos del catálogo
          const validProductIds = new Set(products.map(p => p.id));

          // Obtenemos los IDs del carrito que ya no existen
          const invalidIds = this.getInvalidProductIds(items, validProductIds);

          // Si todo está bien, no hacemos nada
          if (invalidIds.length === 0) return;

          // Eliminamos los productos inválidos del carrito
          this.removeInvalidProducts(invalidIds);

          // Informamos al usuario lo ocurrido
          this.notificationService.success(
            `Se eliminaron ${invalidIds.length} producto(s) del carrito porque ya no existen.`
          );
        },
        error: () => {
          // Si ocurre un error al consultar el catálogo,
          // evitamos romper el carrito y simplemente
          // no realizamos la validación
        }
      });
  }

  /**
   * Retorna los IDs de los productos del carrito
   * que no existen en el catálogo.
   */
  private getInvalidProductIds(
    items: CartItem[],
    validIds: Set<number>
  ): number[] {
    return items
      .map(item => item?.product?.id)
      .filter(
        (id): id is number =>
          typeof id === 'number' && !validIds.has(id)
      );
  }

  /**
   * Elimina del carrito los productos inválidos
   * sin generar bucles de actualización.
   */
  private removeInvalidProducts(invalidIds: number[]): void {
    this.isSyncing = true;
    invalidIds.forEach(id => this.cartService.removeFromCart(id));
    this.isSyncing = false;
  }
  // SECCIÓN: ACCIONES DE LA INTERFAZ
  /**
   * Actualiza la cantidad de un producto en el carrito.
   */
  onUpdateQuantity(productId: number, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity);
  }

  /**
   * Elimina manualmente un producto del carrito.
   */
  onRemoveItem(productId: number): void {
    this.cartService.removeFromCart(productId);
    this.notificationService.success('Producto eliminado del carrito');
  }

  /**
   * Acción simulada de checkout.
   * Aquí se conectaría la lógica real de pago.
   */
  onCheckout(): void {
    this.notificationService.success('¡Gracias por tu compra! (Demo)');
  }

  /**
   * Redirige al usuario a la vista de productos.
   */
  navigateToProducts(): void {
    this.router.navigate(['/products']);
  }

  /**
   * Retorna la cantidad total de productos
   * (sumando cantidades).
   */
  getItemCount(): number {
    return this.cartService.getItemCount();
  }
}
