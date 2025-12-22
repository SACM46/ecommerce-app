import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { LoginRequest, LoginResponse, User } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenSubject = new BehaviorSubject<string | null>(this.getToken());
  private userSubject = new BehaviorSubject<User | null>(this.getUser());

  public token$ = this.tokenSubject.asObservable();
  public user$ = this.userSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${environment.apiUrl}/auth/login`,
      credentials
    ).pipe(
      tap(response => {
        this.setToken(response.access_token);
        const user: User = { id: 1, email: credentials.email };
        this.setUser(user);
        this.tokenSubject.next(response.access_token);
        this.userSubject.next(user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.tokenSubject.next(null);
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  private getUser(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  private setUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }
}