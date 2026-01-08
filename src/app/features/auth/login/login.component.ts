import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { LoginRequest } from '../../../core/models/user.model';

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
    private router: Router
  ) {}

  // Se ejecuta al iniciar el componente
  ngOnInit(): void {
    this.initForm();
  }

  // Inicializa el formulario
  private initForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // Getters para validaciones en el HTML
  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  // Envío del formulario
  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    this.setLoading(true);

    const credentials = this.getCredentials();
    this.login(credentials);
  }

  // Construye la constante de credenciales (usuario y contraseña)
  private getCredentials(): LoginRequest {
    return {
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value,
    };
  }

  // Llama al servicio de autenticación
  private login(credentials: LoginRequest): void {
    this.authService.login(credentials).subscribe({
      next: () => this.handleLoginSuccess(),
      error: () => this.handleLoginError()
    });
  }

  // Login exitoso
  private handleLoginSuccess(): void {
    this.setLoading(false);
    this.router.navigate(['/home']);
  }

  // Error de login
  private handleLoginError(): void {
    this.setLoading(false);
    alert('Credenciales incorrectas');
  }

  // Utilidades
  private setLoading(value: boolean): void {
    this.loading = value;
  }

  private markAllAsTouched(): void {
    this.loginForm.markAllAsTouched();
  }
}

