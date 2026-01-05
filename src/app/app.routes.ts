import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { ProductDetailComponent } from './features/products/product-detail/product-detail';
export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
    import('./features/home/home/home').then(m => m.HomeComponent)
  },
{
  path: 'home',
  loadComponent: () =>
    import('./features/home/home/home').then(m => m.HomeComponent)
},

  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'products',
    loadComponent: () => import('./features/products/product-list/product-list.component').then(m => m.ProductListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'products/new',
    loadComponent: () => import('./features/products/product-form/product-form.component').then(m => m.ProductFormComponent),
    canActivate: [authGuard]
  },
  {
    path: 'products/:id/edit',
    loadComponent: () => import('./features/products/product-form/product-form.component').then(m => m.ProductFormComponent),
    canActivate: [authGuard]
  },
  {
    path: 'cart',
    loadComponent: () => import('./features/cart/cart-view/cart-view.component').then(m => m.CartViewComponent),
    canActivate: [authGuard]
  },
  { path: 'products/:id', component: ProductDetailComponent },
  {
    path: '**',
    redirectTo: 'products'
  }
];