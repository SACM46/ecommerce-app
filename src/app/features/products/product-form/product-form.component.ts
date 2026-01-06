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

  // preview de la imagen principal (primera URL)
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

      // ✅ ahora es texto (1 URL por línea)
      imagesText: ['', Validators.required],

      description: ['', Validators.required]
    });

    // ✅ Preview: toma la PRIMERA línea como imagen principal
    this.subs.add(
      this.productForm.get('imagesText')!.valueChanges.subscribe((val: string) => {
        const first = this.getFirstImageFromText(val);
        this.imagePreview = first || 'https://picsum.photos/640/480';
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
          const imagesText = Array.isArray((product as any).images)
            ? (product as any).images.join('\n')
            : '';

          this.productForm.patchValue({
            title: (product as any).title ?? '',
            price: (product as any).price ?? 0,
            // ✅ soporta category como objeto o categoryId
            categoryId: (product as any).category?.id ?? (product as any).categoryId ?? '',
            imagesText,
            description: (product as any).description ?? ''
          });

          const firstImg = this.getFirstImageFromText(imagesText);
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

  private parseImages(text: string): string[] {
    const list = (text || '')
      .split('\n')
      .map(x => x.trim())
      .filter(x => x.length > 0);

    // fallback si el usuario deja vacío
    return list.length ? list : ['https://via.placeholder.com/300x200?text=Sin+Imagen'];
  }

  private getFirstImageFromText(text: string): string {
    const arr = this.parseImages(text);
    return arr[0] || '';
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    const images = this.parseImages(this.productForm.value.imagesText);

    const dto: CreateProductDto = {
      title: this.productForm.value.title,
      price: Number(this.productForm.value.price),
      description: this.productForm.value.description,
      images, // ✅ ahora es array de URLs
      categoryId: Number(this.productForm.value.categoryId)
    };

    // EDITAR
    if (this.isEditMode && this.productId) {
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

    // CREAR
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
