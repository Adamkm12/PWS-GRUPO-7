import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';
import { ToastService } from '../../services/toast';

@Component({
  selector: 'app-contact',
  imports: [CommonModule, FormsModule, Header, Footer],
  templateUrl: './contact.html',
  styleUrl: './contact.scss'
})
export class Contact {

  fullName = '';
  email = '';
  phone = '';
  topic: 'reservas' | 'eventos' | 'general' | 'sugerencia' = 'general';
  message = '';
  loading = false;

  faqs = [
    {
      q: 'A que hora puedo hacer check-in?',
      a: 'Nuestro check-in se realiza a partir de las 15:00. Si necesitas un check-in anticipado, ponte en contacto con nosotros y haremos lo posible para acomodarte.'
    },
    {
      q: 'Aceptais mascotas?',
      a: 'Si, somos pet-friendly. Disponemos de habitaciones especiales para huespedes con mascotas con un suplemento de 25 EUR/dia.'
    },
    {
      q: 'Hay parking en el hotel?',
      a: 'Si, contamos con parking privado vigilado 24h. Tiene un coste adicional de 15 EUR/dia y puedes anadirlo como extra al hacer la reserva.'
    },
    {
      q: 'Politica de cancelacion?',
      a: 'Las cancelaciones gratuitas se pueden realizar hasta 48 horas antes de la fecha de check-in. Despues, se cobrara el coste de la primera noche.'
    }
  ];

  expandedFaq: number | null = null;

  constructor(private toast: ToastService) {}

  toggleFaq(i: number): void {
    this.expandedFaq = this.expandedFaq === i ? null : i;
  }

  isFaqOpen(i: number): boolean {
    return this.expandedFaq === i;
  }

  onSubmit(): void {
    if (!this.fullName.trim() || !this.email.trim() || !this.message.trim()) {
      this.toast.warning('Rellena los campos requeridos.');
      return;
    }

    this.loading = true;
    // Simulamos envio
    setTimeout(() => {
      this.loading = false;
      this.toast.success(`Hemos recibido tu mensaje, ${this.fullName.split(' ')[0]}. Te responderemos pronto.`);
      this.fullName = '';
      this.email = '';
      this.phone = '';
      this.message = '';
      this.topic = 'general';
    }, 900);
  }
}
