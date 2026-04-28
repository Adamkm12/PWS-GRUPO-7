import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';
import { BookingService } from '../../services/booking';
import { AuthService } from '../../services/auth';

interface Room {
  id: string;
  title: string;
  description: string;
  features: string[];
  extras: { label: string; price: number }[];
  pricePerNight: number;
  services: number;
}

@Component({
  selector: 'app-accommodations',
  imports: [CommonModule, Header, Footer],
  templateUrl: './accommodations.html',
  styleUrl: './accommodations.scss'
})
export class Accommodations implements OnInit, AfterViewInit {

  checkIn = '';
  checkOut = '';
  adults = 1;
  kids = 0;
  successMessage = '';
  errorMessage = '';

  rooms: Room[] = [
    {
      id: 'suite-deluxe',
      title: 'Suite Deluxe',
      description: 'Habitacion espaciosa con vistas al mar, salon privado y bano de marmol con banera de hidromasaje.',
      features: ['Vistas al mar', 'Salon privado', 'Banera de hidromasaje'],
      extras: [
        { label: 'Desayuno', price: 10 },
        { label: 'Desayuno y cena', price: 25 },
        { label: 'Traslado aeropuerto', price: 35 }
      ],
      pricePerNight: 280,
      services: 8
    },
    {
      id: 'junior-suite',
      title: 'Junior Suite',
      description: 'Suite moderna con terraza privada, minibar y zona de trabajo equipada con la ultima tecnologia.',
      features: ['Terraza privada', 'Minibar incluido', 'Zona de trabajo'],
      extras: [
        { label: 'Desayuno', price: 10 },
        { label: 'Desayuno y cena', price: 25 },
        { label: 'Spa 1h', price: 45 }
      ],
      pricePerNight: 195,
      services: 6
    },
    {
      id: 'habitacion-doble',
      title: 'Habitacion Doble',
      description: 'Habitacion confortable y elegante con cama king size, bano completo y acceso a todas las instalaciones.',
      features: ['Cama king size', 'Bano completo', 'Acceso piscina'],
      extras: [
        { label: 'Desayuno', price: 10 },
        { label: 'Desayuno y cena', price: 25 },
        { label: 'Parking', price: 15 }
      ],
      pricePerNight: 130,
      services: 5
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.checkIn  = params['checkIn']  || '';
      this.checkOut = params['checkOut'] || '';
      this.adults   = +params['adults']  || 1;
      this.kids     = +params['kids']    || 0;
    });
  }

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

  getNights(): number {
    if (!this.checkIn || !this.checkOut) return 0;
    const diff = new Date(this.checkOut).getTime() - new Date(this.checkIn).getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  getTotalPrice(pricePerNight: number): number {
    return pricePerNight * this.getNights();
  }

  reserve(room: Room): void {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.getNights() < 3) {
      this.errorMessage = 'La estancia minima es de 3 noches.';
      setTimeout(() => (this.errorMessage = ''), 4000);
      return;
    }

    this.bookingService.createBooking({
      userId: user.uid,
      room: room.title,
      pricePerNight: room.pricePerNight,
      checkIn: this.checkIn,
      checkOut: this.checkOut,
      nights: this.getNights(),
      totalPrice: this.getTotalPrice(room.pricePerNight),
      adults: this.adults,
      kids: this.kids,
      extras: [],
      status: 'Confirmada'
    }).then(() => {
      this.successMessage = `Reserva de "${room.title}" confirmada correctamente.`;
      setTimeout(() => (this.successMessage = ''), 5000);
    }).catch(() => {
      this.errorMessage = 'Ha ocurrido un error al realizar la reserva. Intentalo de nuevo.';
      setTimeout(() => (this.errorMessage = ''), 4000);
    });
  }

  range(n: number): number[] {
    return Array.from({ length: n }, (_, i) => i);
  }
}
