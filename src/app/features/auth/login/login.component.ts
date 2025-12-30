// Importa los decoradores y ciclos de vida de Angular
import { Component, OnInit } from '@angular/core';

// Módulos comunes de Angular (ngIf, ngFor, etc.)
import { CommonModule } from '@angular/common';

// Herramientas para formularios reactivos
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

// Servicio para navegación entre rutas
import { Router } from '@angular/router';

// Servicio de autenticación (aunque aquí se usa HttpClient directo)
import { AuthService } from '../../../core/services/auth';

// Servicio para notificaciones (toasts, alertas, etc.)
import { NotificationService } from '../../../core/services/notification';

// Cliente HTTP para consumir APIs
import { HttpClient } from '@angular/common/http';

@Component({
  // Selector del componente
  selector: 'app-login',

  // Indica que es un componente standalone
  standalone: true,

  // Módulos que usa este componente
  imports: [CommonModule, ReactiveFormsModule],

  // Archivo HTML asociado
  templateUrl: './login.component.html',

  // Archivo SCSS asociado
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  // Formulario reactivo de login
  loginForm!: FormGroup;

  // Variable para controlar el estado de carga
  loading = false;

  // Inyección de dependencias
  constructor(
    private fb: FormBuilder,               // Construcción del formulario
    private authService: AuthService,      // Servicio de autenticación
    private router: Router,                // Navegación
    private notificationService: NotificationService, // Notificaciones
    private http: HttpClient               // Peticiones HTTP
  ) {}

  // Método que se ejecuta al iniciar el componente
  ngOnInit(): void {

    // Inicialización del formulario reactivo
    this.loginForm = this.fb.group({
      // Campo email con validaciones
      email: ['', [Validators.required, Validators.email]],

      // Campo contraseña con validaciones
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // Método que se ejecuta al enviar el formulario
  onSubmit() {

    // Si el formulario es inválido, marca los campos y detiene el proceso
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    // Activa el estado de carga
    this.loading = true;

    // Obtiene las credenciales del formulario
    const credentials = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    // Petición POST a la API de autenticación
    this.http.post<any>(
      'https://api.escuelajs.co/api/v1/auth/login',
      credentials
    ).subscribe({
      // Respuesta exitosa
      next: (res) => {

        // 🔐 Guarda el token de autenticación en el localStorage
        localStorage.setItem('token', res.access_token);

        // Redirecciona a la página de productos
        this.router.navigate(['/products']);
      },

      // Manejo de error (credenciales incorrectas)
      error: () => {
        alert('Credenciales inválidas');
        this.loading = false;
      },

      // Finaliza el proceso (éxito o error)
      complete: () => {
        this.loading = false;
      }
    });
  }

  // Getter para acceder al control email desde el HTML
  get email() {
    return this.loginForm.get('email');
  }

  // Getter para acceder al control password desde el HTML
  get password() {
    return this.loginForm.get('password');
  }
}
