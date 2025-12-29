import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ProductService } from '../../../core/services/product';
import { NotificationService } from '../../../core/services/notification';
import { CreateProductDto } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {

  productForm!: FormGroup;
  loading = false;

  // Categorías reales desde la API
  categories: any[] = [];

  // Preview de imagen
  imagePreview = 'https://picsum.photos/640/480';

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCategories();

    // Preview en vivo cuando cambia el input de imagen
    this.productForm.get('image')?.valueChanges.subscribe((val) => {
      const url = (val ?? '').toString().trim();
      this.imagePreview = url ? url : 'https://picsum.photos/640/480';
    });
  }

  initForm(): void {
    this.productForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      price: [null, [Validators.required, Validators.min(1)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      categoryId: [null, Validators.required],
      image: ['', Validators.required],
    });
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (cats) => {
        this.categories = cats;

        // Si no hay categoría seleccionada, pone la primera
        const current = this.productForm.get('categoryId')?.value;
        if ((!current || Number(current) < 1) && cats.length) {
          this.productForm.patchValue({ categoryId: cats[0].id });
        }
      },
      error: (e) => {
        console.error('Error loading categories:', e);
        this.notificationService.error('No se pudieron cargar las categorías');
      }
    });
  }

  // Validación simple para mostrar mensajes
  isInvalid(name: string): boolean {
    const c = this.productForm.get(name);
    return !!(c && c.invalid && (c.dirty || c.touched));
  }

  // Si la imagen falla, ponemos una por defecto
  onImgError(): void {
    this.imagePreview = 'https://picsum.photos/640/480';
  }

  // Nombre de categoría para el preview
  getCategoryName(id: any): string {
    const cid = Number(id);
    const cat = this.categories.find(c => Number(c.id) === cid);
    return cat?.name ?? '';
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    const v = this.productForm.value;

    // ✅ Payload compatible con escuelajs
    const productData: CreateProductDto = {
      title: (v.title ?? '').toString().trim(),
      price: Number(v.price),
      description: (v.description ?? '').toString().trim(),
      categoryId: Number(v.categoryId),
      images: [(v.image ?? '').toString().trim()],
    };

    console.log('ENVIANDO PRODUCTO:', productData);

    this.productService.createProduct(productData).subscribe({
      next: () => {
        this.notificationService.success('Producto creado correctamente');
        this.router.navigate(['/products']);
      },
      error: (err) => {
        console.error('Error saving product:', err);
        // si el backend manda mensaje, lo mostramos en consola
        console.log('Backend says:', err?.error);
        this.notificationService.error('Error al guardar producto');
        this.loading = false;
      }
    });
  }
}
