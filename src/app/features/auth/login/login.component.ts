import { Component } from '@angular/core';
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
export class LoginComponent {

  loginForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: [
        '',
        [Validators.required, Validators.email]
      ],
      password: [
        '',
        [Validators.required, Validators.minLength(6)]
      ]
    });
  }

  // getters para el HTML (los usas bien 👍)
  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.loading = true;

    const credentials = this.loginForm.value;

    // ✅ ESTA LÍNEA ES LA CLAVE
    this.authService.login(credentials).subscribe({
      next: () => {
        this.loading = false;

        // ✅ el token$ YA emitió → navbar cambia SIN recargar
        this.router.navigate(['/home']);
      },
      error: () => {
        this.loading = false;
        alert('Credenciales incorrectas');
      }
    });
  }
}
