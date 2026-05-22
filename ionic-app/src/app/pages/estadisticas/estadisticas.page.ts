import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonIcon,
  IonButtons, IonBackButton, IonSpinner
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline, starOutline, checkmarkCircleOutline,
  filmOutline, trophyOutline, barChartOutline, heartOutline
} from 'ionicons/icons';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { PeliculasService, Pelicula } from '../../services/peliculas.service';
import { SqliteService } from '../../services/sqlite.service';

interface GeneroStat {
  genero: string;
  count: number;
  pct: number;
  color: string;
}

const COLORES = [
  '#e50914', '#f5c518', '#4ade80', '#60a5fa',
  '#f472b6', '#fb923c', '#a78bfa', '#34d399'
];

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.page.html',
  styleUrls: ['./estadisticas.page.scss'],
  standalone: true,
  imports: [CommonModule,
    IonContent, IonHeader, IonToolbar, IonTitle, IonIcon,
    IonButtons, IonBackButton, IonSpinner]
})
export class EstadisticasPage implements OnInit {
  loading = true;

  // Contadores generales
  totalPeliculas  = 0;
  totalFavoritos  = 0;
  totalVistos     = 0;
  totalConNota    = 0;

  // Rating
  mediaRatingFavs = 0;
  mediaRatingVistos = 0;
  topPelicula: Pelicula | null = null;

  // Géneros
  generosFavoritos: GeneroStat[] = [];
  generosVistos:    GeneroStat[] = [];

  // Películas pendientes (en favs, no vistas)
  pendientesCount = 0;

  constructor(
    private auth:    AuthService,
    private pelSvc:  PeliculasService,
    private sqlite:  SqliteService,
    public router:   Router
  ) {
    addIcons({ arrowBackOutline, starOutline, checkmarkCircleOutline,
               filmOutline, trophyOutline, barChartOutline, heartOutline });
  }

  async ngOnInit() {
    await this.calcular();
  }

  async calcular() {
    this.loading = true;
    const uid = this.auth.currentUser?.uid ?? '';

    // Cargar datos en paralelo
    const [todas, favIds, vistoIds] = await Promise.all([
      firstValueFrom(this.pelSvc.getAll()),
      this.sqlite.getIds(uid),
      this.sqlite.getVistosIds(uid)
    ]);

    const favSet   = new Set(favIds);
    const vistoSet = new Set(vistoIds);

    this.totalPeliculas = todas.length;
    this.totalFavoritos = favIds.length;
    this.totalVistos    = vistoIds.length;

    const favPelis   = todas.filter(p => favSet.has(p.id));
    const vistoPelis = todas.filter(p => vistoSet.has(p.id));

    // Pendientes = favoritas no vistas
    this.pendientesCount = favPelis.filter(p => !vistoSet.has(p.id)).length;

    // Media de rating
    this.mediaRatingFavs   = favPelis.length
      ? +(favPelis.reduce((s, p) => s + p.puntuacion, 0) / favPelis.length).toFixed(1)
      : 0;
    this.mediaRatingVistos = vistoPelis.length
      ? +(vistoPelis.reduce((s, p) => s + p.puntuacion, 0) / vistoPelis.length).toFixed(1)
      : 0;

    // Top película favorita (mayor puntuación)
    this.topPelicula = favPelis.length
      ? favPelis.reduce((best, p) => p.puntuacion > best.puntuacion ? p : best, favPelis[0])
      : (vistoPelis.length ? vistoPelis.reduce((best, p) => p.puntuacion > best.puntuacion ? p : best, vistoPelis[0]) : null);

    // Géneros de favoritas
    this.generosFavoritos = this.buildGeneroStats(favPelis);
    // Géneros de vistas
    this.generosVistos = this.buildGeneroStats(vistoPelis);

    this.loading = false;
  }

  private buildGeneroStats(pelis: Pelicula[]): GeneroStat[] {
    if (!pelis.length) return [];
    const map: Record<string, number> = {};
    pelis.forEach(p => { map[p.genero] = (map[p.genero] ?? 0) + 1; });
    const total = pelis.length;
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([genero, count], i) => ({
        genero,
        count,
        pct: Math.round(count / total * 100),
        color: COLORES[i % COLORES.length]
      }));
  }

  get porcentajeVisto(): number {
    return this.totalPeliculas
      ? Math.round(this.totalVistos / this.totalPeliculas * 100)
      : 0;
  }
}
