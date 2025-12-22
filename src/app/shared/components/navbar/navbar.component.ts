import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { CartService } from '../../../core/services/cart';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isAuthenticated$!: Observable<string | null>;
  cartCount = 0;

  constructor(
    private authService: AuthService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.isAuthenticated$ = this.authService.token$;
    
    this.cartService.cart$.subscribe(() => {
      this.cartCount = this.cartService.getItemCount();
    });
  }

  logout(): void {
    this.authService.logout();
  }
}