import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent, IonIcon, IonSpinner, ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline, alertCircleOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonIcon, IonSpinner]
})
export class LoginPage {
  email    = '';
  password = '';
  loading  = false;
  error    = '';
  showPass = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private toast: ToastController
  ) {
    addIcons({ mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline, alertCircleOutline });
  }

  async onLogin() {
    if (!this.email || !this.password) { this.error = 'Completa todos los campos.'; return; }
    this.loading = true; this.error = '';
    try {
      await this.auth.login(this.email, this.password);
      this.router.navigate(['/peliculas']);
    } catch (e: any) {
      this.error = e.code === 'auth/invalid-credential'
        ? 'Email o contraseña incorrectos.' : 'Error al iniciar sesión.';
    } finally { this.loading = false; }
  }

  goRegister() { this.router.navigate(['/register']); }
}
