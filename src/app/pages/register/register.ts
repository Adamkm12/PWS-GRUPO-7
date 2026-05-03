import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {

  name = '';
  lastname = '';
  email = '';
  phone = '';
  country = '';
  birthdate = '';
  password = '';
  confirmPassword = '';
  terms = false;
  newsletter = false;
  errorMessage = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contrasenas no coinciden.';
      return;
    }
    if (!this.terms) {
      this.errorMessage = 'Debes aceptar los terminos y condiciones.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.register(this.email, this.password, `${this.name} ${this.lastname}`.trim())
      .then(() => this.router.navigate(['/home']))
      .catch((err: any) => {
        console.error('Firebase register error:', err);
        this.errorMessage = this.getRegisterErrorMessage(err?.code);
        this.loading = false;
      });
  }

  private getRegisterErrorMessage(code?: string): string {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'Este correo electronico ya esta registrado.';
      case 'auth/invalid-email':
        return 'El correo electronico no es valido.';
      case 'auth/weak-password':
        return 'La contrasena debe tener al menos 6 caracteres.';
      case 'auth/operation-not-allowed':
        return 'El registro con email y contrasena no esta activado en Firebase Authentication.';
      case 'auth/network-request-failed':
        return 'No se pudo conectar con Firebase. Revisa tu conexion e intentalo de nuevo.';
      case 'auth/api-key-not-valid':
      case 'auth/invalid-api-key':
        return 'La configuracion de Firebase no es valida. Revisa la API key del proyecto.';
      case 'auth/app-not-authorized':
        return 'Este dominio no esta autorizado en Firebase Authentication.';
      default:
        return `Error al crear la cuenta${code ? ` (${code})` : ''}. Intentalo de nuevo.`;
    }
  }
}
