import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../core/services/product';
import { NotificationService } from '../../../core/services/notification';
import { Product } from '../../../core/models/product.model';

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
  isEditMode = false;
  productId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.checkEditMode();
  }

  initForm(): void {
    this.productForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      price: ['', [Validators.required, Validators.min(0)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      categoryId: [1, [Validators.required, Validators.min(1)]],
      image: ['', [Validators.required, Validators.pattern('https?://.+')]],
      stock: [0, [Validators.required, Validators.min(0)]]
    });
  }

  checkEditMode(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.productId = +params['id'];
        this.loadProduct(this.productId);
      }
    });
  }

  loadProduct(id: number): void {
    this.loading = true;
    this.productService.getProduct(id).subscribe({
      next: (product) => {
        this.productForm.patchValue({
          title: product.title,
          price: product.price,
          description: product.description,
          categoryId: product.category.id,
          image: product.images[0],
          stock: product.stock || 0
        });
        this.loading = false;
      },
      error: (error) => {
        this.notificationService.error('Error al cargar producto');
        console.error('Error loading product:', error);
        this.router.navigate(['/products']);
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    const productData = {
      ...this.productForm.value,
      images: [this.productForm.value.image]
    };

    const request = this.isEditMode && this.productId
      ? this.productService.updateProduct(this.productId, productData)
      : this.productService.createProduct(productData);

    request.subscribe({
      next: () => {
        this.notificationService.success(
          this.isEditMode ? 'Producto actualizado exitosamente' : 'Producto creado exitosamente'
        );
        this.router.navigate(['/products']);
      },
      error: (error) => {
        this.notificationService.error('Error al guardar producto');
        console.error('Error saving product:', error);
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/products']);
  }

  get title() { return this.productForm.get('title'); }
  get price() { return this.productForm.get('price'); }
  get description() { return this.productForm.get('description'); }
  get categoryId() { return this.productForm.get('categoryId'); }
  get image() { return this.productForm.get('image'); }
  get stock() { return this.productForm.get('stock'); }
}