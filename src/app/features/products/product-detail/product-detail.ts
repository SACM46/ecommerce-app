import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';

import { ProductService } from '../../../core/services/product';
import { Product } from '../../../core/models/product.model';
import { CartService } from '../../../core/services/cart'; // ajusta si tu servicio se llama distinto
import { NotificationService } from '../../../core/services/notification';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.scss']
})
export class ProductDetailComponent implements OnInit {

  product: Product | null = null;
  loading = true;
  fallback = 'https://picsum.photos/640/480';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.router.navigate(['/products']);
      return;
    }

    this.productService.getProductById(id).subscribe({
      next: (p) => {
        this.product = p;
        this.loading = false;
      },
      error: (e) => {
        console.error(e);
        this.loading = false;
        this.router.navigate(['/products']);
      }
    });
  }

  imgError(ev: Event) {
    (ev.target as HTMLImageElement).src = this.fallback;
  }

  addToCart() {
    if (!this.product) return;
    this.cartService.addToCart(this.product); // si tu método se llama diferente, me dices y lo ajusto
    this.notification.success('Producto agregado al carrito');
  }
}
