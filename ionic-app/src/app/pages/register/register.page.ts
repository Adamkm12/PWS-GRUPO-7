import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent, IonIcon, IonSpinner, ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  personOutline, mailOutline, lockClosedOutline,
  eyeOutline, eyeOffOutline, imageOutline, alertCircleOutline
} from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonIcon, IonSpinner]
})
export class RegisterPage {
  nombre    = '';
  apellidos = '';
  email     = '';
  password  = '';
  foto      = '';
  loading   = false;
  error     = '';
  showPass  = false;

  get avatarUrl(): string {
    if (this.foto.trim()) return this.foto.trim();
    const name = [this.nombre, this.apellidos].filter(Boolean).join('+') || 'Nuevo+Usuario';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=e50914&color=fff&size=128`;
  }

  updateAvatar() { /* triggers ngOnChanges for avatar preview */ }

  get strengthClass(): string {
    const l = this.password.length;
    if (l < 6)  return 'weak';
    if (l < 10) return 'medium';
    return 'strong';
  }

  get strengthLabel(): string {
    return { weak: 'Débil', medium: 'Media', strong: 'Fuerte' }[this.strengthClass] ?? '';
  }

  get strengthWidth(): string {
    const l = this.password.length;
    if (l === 0) return '0%';
    if (l < 6)   return '33%';
    if (l < 10)  return '66%';
    return '100%';
  }

  constructor(
    private auth: AuthService,
    private router: Router,
    private toast: ToastController
  ) {
    addIcons({ personOutline, mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline, imageOutline, alertCircleOutline });
  }

  async onRegister() {
    if (!this.nombre || !this.apellidos || !this.email || !this.password) {
      this.error = 'Todos los campos marcados con * son obligatorios.';
      return;
    }
    if (this.password.length < 6) {
      this.error = 'La contraseña debe tener al menos 6 caracteres.';
      return;
    }

    this.loading = true;
    this.error = '';
    const fotoFinal = this.avatarUrl;

    try {
      await this.auth.register(this.email, this.password, this.nombre, this.apellidos, fotoFinal);
      const t = await this.toast.create({
        message: `¡Bienvenido, ${this.nombre}! 🎬`,
        duration: 2500,
        color: 'success',
        position: 'top'
      });
      await t.present();
      this.router.navigate(['/peliculas']);
    } catch (e: any) {
      this.error = e.code === 'auth/email-already-in-use'
        ? 'Este email ya está registrado.'
        : 'Error al crear la cuenta. Inténtalo de nuevo.';
    } finally {
      this.loading = false;
    }
  }

  goLogin() { this.router.navigate(['/login']); }
}
