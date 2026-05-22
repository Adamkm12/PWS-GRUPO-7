import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { SqliteService } from './services/sqlite.service';
import { PeliculasService } from './services/peliculas.service';

@Component({
  selector: 'app-root',
  template: `<ion-app><ion-router-outlet></ion-router-outlet></ion-app>`,
  standalone: true,
  imports: [IonApp, IonRouterOutlet]
})
export class AppComponent implements OnInit {
  constructor(
    private sqlite: SqliteService,
    private peliculas: PeliculasService
  ) {}

  async ngOnInit() {
    await this.sqlite.init();
    await this.peliculas.seed();
  }
}
