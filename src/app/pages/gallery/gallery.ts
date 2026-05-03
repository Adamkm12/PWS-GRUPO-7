import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';

@Component({
  selector: 'app-gallery',
  imports: [CommonModule, Header, Footer],
  templateUrl: './gallery.html',
  styleUrl: './gallery.scss'
})
export class Gallery {

  images: { src: string; alt: string }[] = [
    { src: 'assets/images/gallery/hotel01.jpg',       alt: 'Hotel vista exterior 1' },
    { src: 'assets/images/gallery/hotel02.jpg',       alt: 'Hotel vista exterior 2' },
    { src: 'assets/images/gallery/casino01.jpg',      alt: 'Casino 1' },
    { src: 'assets/images/gallery/casino02.jpg',      alt: 'Casino 2' },
    { src: 'assets/images/gallery/piscina.jpg',       alt: 'Piscina exterior' },
    { src: 'assets/images/gallery/spa01.jpg',         alt: 'Spa' },
    { src: 'assets/images/gallery/piscinaInterna.jpg',alt: 'Piscina interior' },
    { src: 'assets/images/gallery/recepcion.jpg',     alt: 'Recepcion' },
    { src: 'assets/images/gallery/jardin.jpg',        alt: 'Jardin' }
  ];
}
