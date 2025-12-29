import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product, CreateProductDto } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) {}

  // ✅ LISTAR PRODUCTOS
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(
      `${environment.apiUrl}/products`
    );
  }

  // ✅ OBTENER 1 PRODUCTO
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(
      `${environment.apiUrl}/products/${id}`
    );
  }

  // ✅ CREAR PRODUCTO (DTO -> Product)
  createProduct(product: CreateProductDto): Observable<Product> {
    return this.http.post<Product>(
      `${environment.apiUrl}/products`,
      product
    );
  }

  // ✅ ACTUALIZAR PRODUCTO
  updateProduct(id: number, product: Partial<CreateProductDto>): Observable<Product> {
    return this.http.put<Product>(
      `${environment.apiUrl}/products/${id}`,
      product
    );
  }

  // ✅ ELIMINAR PRODUCTO
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(
      `${environment.apiUrl}/products/${id}`
    );
  }

  // ✅ CATEGORÍAS REALES
  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(
      `${environment.apiUrl}/categories`
    );
  }
}
