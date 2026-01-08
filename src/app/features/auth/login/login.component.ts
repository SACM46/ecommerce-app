import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

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

  // 1) ngOnInit: aquí llamas lo que se necesita al iniciar el componente
  ngOnInit(): void {
    this.initForm();
  }

  // 2) Función para inicializar el formulario
  private initForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // 3) Getters para usar en el HTML (validaciones)
  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  // 4) Función que se ejecuta al enviar el formulario
  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    this.setLoading(true);
    const credentials = this.getCredentials();

    this.login(credentials);
  }

  // 5) Función para obtener credenciales del form (más ordenado)
  private getCredentials() {
    return this.loginForm.value; // { email, password }
  }

  // 6) Función para hacer el login con el service
  private login(credentials: any): void {
    this.authService.login(credentials).subscribe({
      next: () => this.handleLoginSuccess(),
      error: () => this.handleLoginError()
    });
  }

  // 7) Éxito
  private handleLoginSuccess(): void {
    this.setLoading(false);
    this.router.navigate(['/home']);
  }

  // 8) Error
  private handleLoginError(): void {
    this.setLoading(false);
    alert('Credenciales incorrectas');
  }

  // 9) Utilidades
  private setLoading(value: boolean): void {
    this.loading = value;
  }

  private markAllAsTouched(): void {
    this.loginForm.markAllAsTouched();
  }
}
