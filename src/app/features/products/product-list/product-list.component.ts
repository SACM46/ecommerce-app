import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product';
import { CartService } from '../../../core/services/cart';
import { NotificationService } from '../../../core/services/notification';
import { Product } from '../../../core/models/product.model';
import { ProductCardComponent } from '../product-card/product-card.component';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCardComponent, LoadingComponent],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchQuery = '';
  loading = false;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.filteredProducts = products;
        this.loading = false;
      },
      error: (error) => {
        this.notificationService.error('Error al cargar productos');
        console.error('Error loading products:', error);
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    const query = this.searchQuery.toLowerCase().trim();
    
    if (!query) {
      this.filteredProducts = this.products;
      return;
    }

    this.filteredProducts = this.products.filter(product =>
      product.title.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.category.name.toLowerCase().includes(query)
    );
  }

  onAddToCart(product: Product): void {
    this.cartService.addToCart(product);
    this.notificationService.success('Producto agregado al carrito');
  }

  onEdit(product: Product): void {
    this.router.navigate(['/products', product.id, 'edit']);
  }

  onDelete(product: Product): void {
    if (!confirm(`¿Estás seguro de eliminar "${product.title}"?`)) {
      return;
    }

    this.productService.deleteProduct(product.id).subscribe({
      next: () => {
        this.products = this.products.filter(p => p.id !== product.id);
        this.filteredProducts = this.filteredProducts.filter(p => p.id !== product.id);
        this.notificationService.success('Producto eliminado exitosamente');
      },
      error: (error) => {
        this.notificationService.error('Error al eliminar producto');
        console.error('Error deleting product:', error);
      }
    });
  }

  navigateToCreate(): void {
    this.router.navigate(['/products/new']);
  }
}