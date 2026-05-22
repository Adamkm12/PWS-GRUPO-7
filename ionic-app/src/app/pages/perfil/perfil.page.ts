import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonIcon,
  IonButton, IonButtons, IonBackButton, IonSpinner,
  ToastController, AlertController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  personOutline, mailOutline, calendarOutline, heartOutline,
  logOutOutline, arrowBackOutline, createOutline, checkmarkOutline,
  closeOutline, filmOutline, starOutline
} from 'ionicons/icons';
import { Firestore, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { SqliteService } from '../../services/sqlite.service';

interface UsuarioPerfil {
  uid: string;
  email: string;
  nombre: string;
  apellidos: string;
  foto: string;
  creadoEn?: any;
}

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule,
    IonContent, IonHeader, IonToolbar, IonTitle, IonIcon,
    IonButton, IonButtons, IonBackButton, IonSpinner]
})
export class PerfilPage implements OnInit {
  usuario: UsuarioPerfil | null = null;
  loading = true;
  editando = false;
  guardando = false;
  numFavoritos = 0;

  // Campos de edición
  editNombre = '';
  editApellidos = '';
  editFoto = '';

  private db = inject(Firestore);

  constructor(
    private auth: AuthService,
    private sqlite: SqliteService,
    private router: Router,
    private toast: ToastController,
    private alert: AlertController
  ) {
    addIcons({
      personOutline, mailOutline, calendarOutline, heartOutline,
      logOutOutline, arrowBackOutline, createOutline, checkmarkOutline,
      closeOutline, filmOutline, starOutline
    });
  }

  async ngOnInit() {
    await this.cargarPerfil();
  }

  async cargarPerfil() {
    this.loading = true;
    const uid = this.auth.currentUser?.uid;
    if (!uid) { this.router.navigate(['/login']); return; }

    try {
      const snap = await getDoc(doc(this.db, 'usuarios', uid));
      if (snap.exists()) {
        this.usuario = snap.data() as UsuarioPerfil;
      } else {
        // Fallback con datos de Auth
        this.usuario = {
          uid,
          email: this.auth.currentUser?.email ?? '',
          nombre: 'Usuario',
          apellidos: '',
          foto: `https://ui-avatars.com/api/?name=Usuario&background=e50914&color=fff&size=128`
        };
      }
      const ids = await this.sqlite.getIds(uid);
      this.numFavoritos = ids.length;
    } finally {
      this.loading = false;
    }
  }

  iniciarEdicion() {
    if (!this.usuario) return;
    this.editNombre = this.usuario.nombre;
    this.editApellidos = this.usuario.apellidos;
    this.editFoto = this.usuario.foto;
    this.editando = true;
  }

  cancelarEdicion() {
    this.editando = false;
  }

  get previewFoto(): string {
    if (this.editFoto.trim()) return this.editFoto.trim();
    const name = [this.editNombre, this.editApellidos].filter(Boolean).join('+') || 'Usuario';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=e50914&color=fff&size=128`;
  }

  async guardarCambios() {
    if (!this.usuario || !this.editNombre.trim()) return;
    this.guardando = true;
    try {
      const fotoFinal = this.editFoto.trim() ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(this.editNombre + ' ' + this.editApellidos)}&background=e50914&color=fff&size=128`;

      await updateDoc(doc(this.db, 'usuarios', this.usuario.uid), {
        nombre: this.editNombre.trim(),
        apellidos: this.editApellidos.trim(),
        foto: fotoFinal
      });

      this.usuario.nombre = this.editNombre.trim();
      this.usuario.apellidos = this.editApellidos.trim();
      this.usuario.foto = fotoFinal;
      this.editando = false;

      const t = await this.toast.create({
        message: '✅ Perfil actualizado correctamente',
        duration: 2500,
        color: 'success',
        position: 'bottom'
      });
      t.present();
    } catch {
      const t = await this.toast.create({
        message: 'Error al guardar los cambios',
        duration: 2000,
        color: 'danger',
        position: 'bottom'
      });
      t.present();
    } finally {
      this.guardando = false;
    }
  }

  async cerrarSesion() {
    const a = await this.alert.create({
      header: 'Cerrar sesión',
      message: '¿Seguro que quieres salir?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Salir', handler: async () => {
            await this.auth.logout();
            this.router.navigate(['/login']);
          }
        }
      ]
    });
    await a.present();
  }

  get fechaRegistro(): string {
    if (!this.usuario?.creadoEn) return 'Desconocida';
    const d = this.usuario.creadoEn?.toDate
      ? this.usuario.creadoEn.toDate()
      : new Date(this.usuario.creadoEn);
    return d.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  }
}
