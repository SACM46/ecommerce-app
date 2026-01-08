import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ProductService } from '../../core/services/product';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.scss'],
})
export class AdminHomeComponent implements OnInit, OnDestroy {

  /** ======================
   * Estado de UI
   * ====================== */
  loading = false;
  search = '';
  categoryFilter: string = 'Todos';

  /** ======================
   * Datos (API)
   * ====================== */
  products: Product[] = [];

  /** Control de subscripciones */
  private destroy$ = new Subject<void>();

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /** ======================
   * Cargar productos reales
   * ====================== */
  private loadProducts(): void {
    this.loading = true;

    this.productService.getProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.products = data ?? [];
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
  }

  /** ======================
   * Categorías dinámicas
   * ====================== */
  get categories(): string[] {
    const set = new Set<string>();

    this.products.forEach(p => {
      if (p.category?.name) set.add(p.category.name);
    });

    return ['Todos', ...Array.from(set)];
  }

  /** ======================
   * Filtro/Búsqueda completa
   * ====================== */
  get filteredProducts(): Product[] {
    const q = this.search.trim().toLowerCase();

    let list = this.products.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.name.toLowerCase().includes(q)
    );

    if (this.categoryFilter !== 'Todos') {
      list = list.filter(p => p.category.name === this.categoryFilter);
    }

    return list;
  }

  clearSearch(): void {
    this.search = '';
    this.categoryFilter = 'Todos';
  }

  /** ======================
   * Acciones Admin (CRUD)
   * ====================== */

  addProduct(): void {
  this.router.navigate(['/products/new']);
}

editProduct(product: Product): void {
  this.router.navigate(['/products', product.id, 'edit']);
}


  deleteProduct(product: Product): void {
    const ok = confirm(`¿Seguro que deseas eliminar "${product.title}"?`);
    if (!ok) return;

    this.productService.deleteProduct(product.id).subscribe({
      next: () => {
        // Actualizamos la tabla sin recargar
        this.products = this.products.filter(p => p.id !== product.id);
      },
      error: () => {
        alert('No se pudo eliminar el producto. Intenta de nuevo.');
      }
    });
  }

  /** Si una imagen falla, ponemos una genérica */
  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src = 'https://picsum.photos/80/80';
  }
}
