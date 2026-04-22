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
        this.errorMessage = err.code === 'auth/email-already-in-use'
          ? 'Este correo electronico ya esta registrado.'
          : 'Error al crear la cuenta. Intentalo de nuevo.';
        this.loading = false;
      });
  }
}
