import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';

@Component({
  selector: 'app-about',
  imports: [CommonModule, Header, Footer],
  templateUrl: './about.html',
  styleUrl: './about.scss'
})
export class About {

  values = [
    { icon: 'bi-stars', title: 'Excelencia', desc: 'Cuidamos cada detalle para que tu estancia supere las expectativas.' },
    { icon: 'bi-heart', title: 'Hospitalidad', desc: 'Atencion calida y autentica, como en casa pero con un toque exclusivo.' },
    { icon: 'bi-globe2', title: 'Sostenibilidad', desc: 'Comprometidos con el entorno: energia verde y productos locales.' },
    { icon: 'bi-shield-check', title: 'Confianza', desc: 'Privacidad, seguridad y politicas claras en cada reserva.' }
  ];

  team = [
    { name: 'Adam Kardouchi', role: 'Director de Experiencia', img: 'assets/images/room.jpg' },
    { name: 'Pablo Damas', role: 'Director General', img: 'assets/images/room.jpg' },
    { name: 'Cristian Vega', role: 'Chef Ejecutivo', img: 'assets/images/restaurant.jpg' }
  ];

  milestones = [
    { year: '1998', title: 'Apertura del hotel', desc: 'El Hotel Boutique abre sus puertas en Gran Canaria con 30 habitaciones.' },
    { year: '2007', title: 'Primera ampliacion', desc: 'Inauguramos el spa, las nuevas suites y el restaurante panoramico.' },
    { year: '2018', title: 'Premio "Mejor Boutique"', desc: 'Reconocimiento internacional al diseno y servicio de la propiedad.' },
    { year: '2025', title: 'Renovacion total', desc: 'Reforma completa con domotica, tecnologia y nuevos espacios bienestar.' },
    { year: '2026', title: 'Plataforma digital', desc: 'Lanzamos la nueva web con reservas online y experiencia personalizada.' }
  ];

  stats = [
    { num: '28', label: 'anos de historia' },
    { num: '120', label: 'habitaciones' },
    { num: '4.9', label: 'puntuacion media' },
    { num: '60+', label: 'paises de origen' }
  ];
}
