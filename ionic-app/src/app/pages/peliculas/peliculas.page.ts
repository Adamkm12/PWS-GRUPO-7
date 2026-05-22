import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonIcon,
  IonButton, IonButtons, IonSpinner, IonRefresher, IonRefresherContent,
  IonSearchbar, AlertController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  star, starOutline, logOutOutline, filmOutline,
  personCircleOutline, swapVerticalOutline, heartOutline,
  checkmarkCircleOutline, barChartOutline
} from 'ionicons/icons';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { PeliculasService, Pelicula } from '../../services/peliculas.service';
import { SqliteService } from '../../services/sqlite.service';

type SortKey = 'puntuacion' | 'anio' | 'titulo';

@Component({
  selector: 'app-peliculas',
  templateUrl: './peliculas.page.html',
  styleUrls: ['./peliculas.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule,
    IonContent, IonHeader, IonToolbar, IonTitle, IonIcon,
    IonButton, IonButtons, IonSpinner, IonRefresher, IonRefresherContent,
    IonSearchbar]
})
export class PeliculasPage implements OnInit, OnDestroy {
  peliculas: Pelicula[] = [];
  peliculasFiltradas: Pelicula[] = [];
  favIds   = new Set<string>();
  vistoIds = new Set<string>();
  loading = true;
  searchTerm = '';
  generoActivo = '';
  generos: string[] = [];
  soloFavoritos = false;
  ratingMin = 0; // 0 = todos, 7, 8, 9

  // Ordenación
  sortKey: SortKey = 'puntuacion';
  sortAsc = false;
  readonly sortOpciones: { key: SortKey; label: string }[] = [
    { key: 'puntuacion', label: 'Rating' },
    { key: 'anio',       label: 'Año' },
    { key: 'titulo',     label: 'Título' },
  ];

  private sub?: Subscription;

  constructor(
    private auth: AuthService,
    private peliculasSvc: PeliculasService,
    private sqlite: SqliteService,
    private router: Router,
    private alert: AlertController
  ) {
    addIcons({ star, starOutline, logOutOutline, filmOutline,
               personCircleOutline, swapVerticalOutline, heartOutline,
               checkmarkCircleOutline, barChartOutline });
  }

  async ngOnInit() { await this.cargar(); }
  ngOnDestroy() { this.sub?.unsubscribe(); }

  async cargar() {
    this.loading = true;
    const uid = this.auth.currentUser?.uid ?? '';
    const [favs, vistos] = await Promise.all([
      this.sqlite.getIds(uid),
      this.sqlite.getVistosIds(uid)
    ]);
    this.favIds   = new Set(favs);
    this.vistoIds = new Set(vistos);

    this.sub?.unsubscribe();
    this.sub = this.peliculasSvc.getAll().subscribe(p => {
      this.peliculas = p;
      this.generos = [...new Set(p.map(x => x.genero))].sort();
      this.filtrar();
      this.loading = false;
    });
  }

  filtrar() {
    const term = this.searchTerm.toLowerCase().trim();
    let result = this.peliculas.filter(p => {
      const matchesSearch  = !term ||
        p.titulo.toLowerCase().includes(term) ||
        p.director.toLowerCase().includes(term);
      const matchesGenero  = !this.generoActivo || p.genero === this.generoActivo;
      const matchesFav     = !this.soloFavoritos || this.favIds.has(p.id);
      const matchesRating  = !this.ratingMin || p.puntuacion >= this.ratingMin;
      return matchesSearch && matchesGenero && matchesFav && matchesRating;
    });

    result = [...result].sort((a, b) => {
      let cmp = 0;
      if (this.sortKey === 'titulo') {
        cmp = a.titulo.localeCompare(b.titulo);
      } else {
        cmp = (a[this.sortKey] as number) - (b[this.sortKey] as number);
      }
      return this.sortAsc ? cmp : -cmp;
    });

    this.peliculasFiltradas = result;
  }

  setSort(key: SortKey) {
    if (this.sortKey === key) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.sortKey = key;
      this.sortAsc = key === 'titulo';
    }
    this.filtrar();
  }

  setGenero(g: string) { this.generoActivo = g; this.filtrar(); }

  setRatingMin(r: number) {
    this.ratingMin = this.ratingMin === r ? 0 : r;
    this.filtrar();
  }

  toggleSoloFavoritos() { this.soloFavoritos = !this.soloFavoritos; this.filtrar(); }

  clearFilters() {
    this.searchTerm = '';
    this.generoActivo = '';
    this.soloFavoritos = false;
    this.ratingMin = 0;
    this.sortKey = 'puntuacion';
    this.sortAsc = false;
    this.filtrar();
  }

  esFavorito(id: string) { return this.favIds.has(id); }
  esVisto(id: string)    { return this.vistoIds.has(id); }
  get numFavs()   { return this.favIds.size; }
  get numVistos() { return this.vistoIds.size; }

  abrirDetalle(p: Pelicula) { this.router.navigate(['/detalle', p.id]); }
  irPerfil()        { this.router.navigate(['/perfil']); }
  irEstadisticas()  { this.router.navigate(['/estadisticas']); }

  async onRefresh(e: any) { await this.cargar(); e.target.complete(); }

  async cerrarSesion() {
    const a = await this.alert.create({
      header: 'Cerrar sesión',
      message: '¿Seguro que quieres salir?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Salir', handler: async () => { await this.auth.logout(); this.router.navigate(['/login']); } }
      ]
    });
    await a.present();
  }
}
