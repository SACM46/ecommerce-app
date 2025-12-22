import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Product, CreateProductDto, UpdateProductDto } from '../models/product.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${environment.apiUrl}/products`).pipe(
      map(products => products.map(p => ({
        ...p,
        stock: Math.floor(Math.random() * 50) + 10
      })))
    );
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${environment.apiUrl}/products/${id}`).pipe(
      map(p => ({
        ...p,
        stock: Math.floor(Math.random() * 50) + 10
      }))
    );
  }

  createProduct(product: CreateProductDto): Observable<Product> {
    return this.http.post<Product>(`${environment.apiUrl}/products`, product).pipe(
      map(p => ({
        ...p,
        stock: product.stock || 0
      }))
    );
  }

  updateProduct(id: number, product: UpdateProductDto): Observable<Product> {
    return this.http.put<Product>(`${environment.apiUrl}/products/${id}`, product).pipe(
      map(p => ({
        ...p,
        stock: product.stock || 0
      }))
    );
  }

  deleteProduct(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${environment.apiUrl}/products/${id}`);
  }
}