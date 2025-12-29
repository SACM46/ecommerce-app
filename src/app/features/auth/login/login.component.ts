import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { NotificationService } from '../../../core/services/notification';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService,
    private http: HttpClient

  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
  if (this.loginForm.invalid) {
    this.loginForm.markAllAsTouched();
    return;
  }

  this.loading = true;

  const credentials = {
    email: this.loginForm.value.email,
    password: this.loginForm.value.password
  };

  this.http.post<any>(
    'https://api.escuelajs.co/api/v1/auth/login',
    credentials
  ).subscribe({
    next: (res) => {
      // 🔐 Guardar token real
      localStorage.setItem('token', res.access_token);

      // navegar a productos
      this.router.navigate(['/products']);
    },
    error: () => {
      alert('Credenciales inválidas');
      this.loading = false;
    },
    complete: () => {
      this.loading = false;
    }
  });
}


  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}