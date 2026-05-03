import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';

interface Service {
  title: string;
  description: string;
  time: string;
  image: string;
  alt: string;
}

@Component({
  selector: 'app-services',
  imports: [CommonModule, Header, Footer],
  templateUrl: './services.html',
  styleUrl: './services.scss'
})
export class Services implements AfterViewInit {

  services: Service[] = [
    {
      title: 'Spa Ritual & Wellness',
      description: 'Tratamientos relajantes con cabinas privadas, circuito termal y zona de descanso pensada para desconectar.',
      time: 'Horario servicio: 08:00 - 22:00',
      image: 'assets/images/room.jpg',
      alt: 'Servicio de spa'
    },
    {
      title: 'Sky Lounge Privado',
      description: 'Espacio exclusivo con cocteleria de autor, vistas panoramicas y ambiente ideal para encuentros nocturnos.',
      time: 'Horario servicio: 12:00 - 01:00',
      image: 'assets/images/casino.jpg',
      alt: 'Servicio de lounge'
    },
    {
      title: 'Chef Table Experience',
      description: 'Menu degustacion preparado al momento por nuestro chef, con maridajes seleccionados y atencion personalizada.',
      time: 'Horario servicio: 19:00 - 23:30',
      image: 'assets/images/restaurant.jpg',
      alt: 'Servicio gourmet'
    },
    {
      title: 'Transfer Premium',
      description: 'Traslados privados desde y hacia puntos clave de la ciudad, con reserva anticipada y seguimiento en tiempo real.',
      time: 'Horario servicio: 24 horas',
      image: 'assets/images/photoHome.jpg',
      alt: 'Servicio transfer'
    },
    {
      title: 'Concierge Signature',
      description: 'Asistencia personalizada para reservas, recomendaciones locales y coordinacion de experiencias a medida.',
      time: 'Horario servicio: 09:00 - 21:00',
      image: 'assets/images/poolHotel.png',
      alt: 'Servicio concierge'
    }
  ];

  // Activo las animaciones de entrada una vez que el DOM esta listo
  ngAfterViewInit(): void {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }
}
