import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonIcon,
  IonButton, IonButtons, IonBackButton, IonSpinner,
  ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  heart, heartOutline, arrowBackOutline,
  shareSocialOutline, filmOutline, personOutline,
  calendarOutline, starOutline, personCircleOutline,
  checkmarkCircle, checkmarkCircleOutline,
  createOutline, trashOutline, saveOutline
} from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';
import { PeliculasService, Pelicula } from '../../services/peliculas.service';
import { SqliteService } from '../../services/sqlite.service';

// Sugerencias por género
const SIMILARES: Record<string, string[]> = {
  'Ciencia Ficción': ['Matrix', 'Blade Runner 2049', 'Arrival', 'Dune'],
  'Aventura':        ['Gravity', 'The Martian', 'Ad Astra', 'Moon'],
  'Acción':          ['Mad Max: Fury Road', 'John Wick', 'Heat', 'Speed'],
  'Drama':           ['Whiplash', 'Marriage Story', '1917', 'Joker'],
  'Crimen':          ['Goodfellas', 'Se7en', 'Prisoners', 'Zodiac'],
  'Historia':        ['Dunkirk', 'Darkest Hour', 'Lincoln', 'Braveheart'],
  'Thriller':        ['Gone Girl', 'Rear Window', 'Oldboy', 'Memento'],
  'Bélico':          ['Saving Private Ryan', 'Full Metal Jacket', 'Apocalypse Now'],
  'Animación':       ['Princess Mononoke', 'Your Name', 'Grave of the Fireflies'],
  'Romance':         ['La La Land', 'Casablanca', 'Before Sunrise', 'Eternal Sunshine'],
};

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule,
    IonContent, IonHeader, IonToolbar, IonTitle, IonIcon,
    IonButton, IonButtons, IonBackButton, IonSpinner]
})
export class DetallePage implements OnInit {
  pelicula: Pelicula | null = null;
  esFav        = false;
  esVisto      = false;
  loading      = true;
  favLoading   = false;
  vistoLoading = false;
  similares: string[] = [];

  // Notas personales
  nota           = '';
  notaEditando   = '';
  notaModificada = false;
  notaGuardando  = false;
  mostrarNota    = false;

  constructor(
    private route:        ActivatedRoute,
    private router:       Router,
    private auth:         AuthService,
    private peliculasSvc: PeliculasService,
    private sqlite:       SqliteService,
    private toast:        ToastController
  ) {
    addIcons({
      heart, heartOutline, arrowBackOutline,
      shareSocialOutline, filmOutline, personOutline,
      calendarOutline, starOutline, personCircleOutline,
      checkmarkCircle, checkmarkCircleOutline,
      createOutline, trashOutline, saveOutline
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.peliculasSvc.getById(id).subscribe(async p => {
      this.pelicula = p;
      this.loading  = false;
      const uid = this.auth.currentUser?.uid ?? '';
      [this.esFav, this.esVisto, this.nota] = await Promise.all([
        this.sqlite.isFav(id, uid),
        this.sqlite.isVisto(id, uid),
        this.sqlite.getNota(id, uid)
      ]);
      this.notaEditando = this.nota;
      // Sugerencias del mismo género
      const pool = SIMILARES[p?.genero ?? ''] ?? [];
      this.similares = pool.filter(t => t !== p?.titulo).slice(0, 4);
      if (this.similares.length === 0) {
        this.similares = ['Inception', 'The Godfather', 'Parasite'].filter(t => t !== p?.titulo);
      }
    });
  }

  // ── Favorito ──
  async toggleFav() {
    if (!this.pelicula) return;
    const uid = this.auth.currentUser?.uid ?? '';
    this.favLoading = true;
    try {
      if (this.esFav) {
        await this.sqlite.removeFav(this.pelicula.id, uid);
        this.esFav = false;
        this.showToast('Eliminada de favoritos', 'medium');
      } else {
        await this.sqlite.addFav(this.pelicula.id, uid);
        this.esFav = true;
        this.showToast('¡Añadida a favoritos! ⭐', 'success');
      }
    } finally { this.favLoading = false; }
  }

  // ── Visto ──
  async toggleVisto() {
    if (!this.pelicula) return;
    const uid = this.auth.currentUser?.uid ?? '';
    this.vistoLoading = true;
    try {
      if (this.esVisto) {
        await this.sqlite.removeVisto(this.pelicula.id, uid);
        this.esVisto = false;
        this.showToast('Marcada como no vista', 'medium');
      } else {
        await this.sqlite.addVisto(this.pelicula.id, uid);
        this.esVisto = true;
        this.showToast('¡Marcada como vista! ✅', 'success');
      }
    } finally { this.vistoLoading = false; }
  }

  // ── Notas ──
  toggleNota() {
    this.mostrarNota = !this.mostrarNota;
    if (this.mostrarNota) this.notaEditando = this.nota;
  }

  onNotaChange() {
    this.notaModificada = this.notaEditando !== this.nota;
  }

  async guardarNota() {
    if (!this.pelicula) return;
    const uid = this.auth.currentUser?.uid ?? '';
    this.notaGuardando = true;
    try {
      await this.sqlite.saveNota(this.pelicula.id, uid, this.notaEditando);
      this.nota = this.notaEditando;
      this.notaModificada = false;
      this.showToast('📝 Nota guardada', 'success');
    } finally { this.notaGuardando = false; }
  }

  async borrarNota() {
    if (!this.pelicula) return;
    const uid = this.auth.currentUser?.uid ?? '';
    await this.sqlite.deleteNota(this.pelicula.id, uid);
    this.nota = '';
    this.notaEditando = '';
    this.notaModificada = false;
    this.showToast('Nota eliminada', 'medium');
  }

  // ── Compartir ──
  async compartir() {
    if (!this.pelicula) return;
    const msg = `🎬 ${this.pelicula.titulo} (${this.pelicula.anio}) — ⭐ ${this.pelicula.puntuacion}/10\nDirector: ${this.pelicula.director}`;
    if (navigator.share) {
      await navigator.share({ title: this.pelicula.titulo, text: msg }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(msg).catch(() => {});
      this.showToast('¡Copiado al portapapeles!', 'primary');
    }
  }

  private async showToast(msg: string, color: string) {
    const t = await this.toast.create({ message: msg, duration: 2000, color, position: 'bottom' });
    t.present();
  }
}
