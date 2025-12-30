import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { ProductService } from '../../../core/services/product';
import { NotificationService } from '../../../core/services/notification';
import { Product, CreateProductDto } from '../../../core/models/product.model';

type Category = { id: number; name: string };

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit, OnDestroy {

  productForm!: FormGroup;
  loading = false;

  isEditMode = false;
  productId: number | null = null;

  categories: Category[] = [];

  imagePreview = 'https://picsum.photos/640/480';

  private subs = new Subscription();

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      title: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(1)]],
      categoryId: ['', Validators.required],
      images: ['', Validators.required], // 👈 string para el input
      description: ['', Validators.required]
    });

    // Preview cuando cambia la URL
    this.subs.add(
      this.productForm.get('images')!.valueChanges.subscribe((val: string) => {
        const url = (val || '').trim();
        this.imagePreview = url || 'https://picsum.photos/640/480';
      })
    );

    // Categorías
    this.subs.add(
      this.productService.getCategories().subscribe({
        next: (cats: any[]) => {
          this.categories = (cats || []).map(c => ({
            id: Number(c.id),
            name: String(c.name)
          }));
        },
        error: () => this.notificationService.error('No se pudieron cargar las categorías')
      })
    );

    // Detectar edición
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.productId = Number(idParam);
      this.loadProduct(this.productId);
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  private loadProduct(id: number): void {
    this.loading = true;

    this.subs.add(
      this.productService.getProductById(id).subscribe({
        next: (product: Product) => {
          const firstImg =
            Array.isArray(product.images) && product.images.length > 0
              ? product.images[0]
              : '';

          this.productForm.patchValue({
            title: product.title ?? '',
            price: product.price ?? 0,
            categoryId: (product as any).categoryId ?? '',
            images: firstImg, // 👈 STRING
            description: product.description ?? ''
          });

          this.imagePreview = (firstImg || 'https://picsum.photos/640/480').trim();
          this.loading = false;
        },
        error: () => {
          this.notificationService.error('No se pudo cargar el producto');
          this.loading = false;
          this.router.navigate(['/products']);
        }
      })
    );
  }

  isInvalid(field: string): boolean {
    const control = this.productForm.get(field);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  getCategoryName(categoryId: any): string {
    const id = Number(categoryId);
    return this.categories.find(c => c.id === id)?.name || '';
  }

  onImgError(): void {
    this.imagePreview = 'https://picsum.photos/640/480';
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    const imgText = (this.productForm.value.images || '').trim();

    const dto: CreateProductDto = {
      title: this.productForm.value.title,
      price: Number(this.productForm.value.price),
      description: this.productForm.value.description,
      images: imgText ? [imgText] : [], // 👈 vuelve a array
      categoryId: Number(this.productForm.value.categoryId)
    };

    if (this.isEditMode && this.productId !== null) {
      this.subs.add(
        this.productService.updateProduct(this.productId, dto).subscribe({
          next: () => {
            this.notificationService.success('Producto actualizado');
            this.loading = false;
            this.router.navigate(['/products']);
          },
          error: () => {
            this.notificationService.error('Error al actualizar');
            this.loading = false;
          }
        })
      );
      return;
    }

    this.subs.add(
      this.productService.createProduct(dto).subscribe({
        next: () => {
          this.notificationService.success('Producto creado');
          this.loading = false;
          this.router.navigate(['/products']);
        },
        error: () => {
          this.notificationService.error('Error al crear');
          this.loading = false;
        }
      })
    );
  }
}
