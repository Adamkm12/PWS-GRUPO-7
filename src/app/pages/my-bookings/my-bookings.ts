import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';
import { BookingService, Booking } from '../../services/booking';
import { AuthService } from '../../services/auth';
import { ToastService } from '../../services/toast';

type StatusFilter = 'all' | 'active' | 'past' | 'cancelled';

@Component({
  selector: 'app-my-bookings',
  imports: [CommonModule, FormsModule, RouterLink, Header, Footer],
  templateUrl: './my-bookings.html',
  styleUrl: './my-bookings.scss'
})
export class MyBookings implements OnInit {

  bookings: Booking[] = [];
  loading = true;
  filter: StatusFilter = 'all';

  expandedId: string | null = null;
  cancellingId: string | null = null;
  private highlightId: string | null = null;
  private highlightRetry = 0;

  constructor(
    private bookingService: BookingService,
    private authService: AuthService,
    private toast: ToastService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.highlightId = params['highlight'] || null;
    });
    this.loadBookings();
  }

  loadBookings(): void {
    const user = this.authService.getCurrentUser();
    if (!user) { this.loading = false; return; }

    this.loading = true;
    this.bookingService.getUserBookings(user.uid)
      .then(bookings => {
        this.bookings = bookings;
        this.loading = false;

        if (this.highlightId) {
          const found = this.bookings.some(b => b.id === this.highlightId);
          if (found) {
            this.expandedId = this.highlightId;
            // Scroll after render.
            setTimeout(() => {
              const el = document.getElementById(`booking-${this.highlightId}`);
              el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 50);
          } else if (this.highlightRetry < 1) {
            // Firestore can be eventually consistent; retry once.
            this.highlightRetry++;
            setTimeout(() => this.loadBookings(), 900);
          }
        }
      })
      .catch(() => {
        this.loading = false;
        this.toast.error('No se han podido cargar tus reservas.');
      });
  }

  filteredBookings(): Booking[] {
    const today = new Date().toISOString().split('T')[0];
    return this.bookings.filter(b => {
      switch (this.filter) {
        case 'active':    return b.status === 'Confirmada' && b.checkOut >= today;
        case 'past':      return b.status === 'Confirmada' && b.checkOut < today;
        case 'cancelled': return b.status === 'Cancelada';
        default:          return true;
      }
    });
  }

  setFilter(f: StatusFilter): void { this.filter = f; }

  toggleExpand(id: string | undefined): void {
    if (!id) return;
    this.expandedId = this.expandedId === id ? null : id;
  }

  isExpanded(id: string | undefined): boolean {
    return !!id && this.expandedId === id;
  }

  isCancellable(b: Booking): boolean {
    if (b.status !== 'Confirmada') return false;
    const today = new Date().toISOString().split('T')[0];
    return b.checkIn > today;
  }

  async cancel(b: Booking): Promise<void> {
    if (!b.id) return;
    if (!confirm(`Cancelar la reserva de ${b.room}? Esta accion no se puede deshacer.`)) return;

    this.cancellingId = b.id;
    try {
      await this.bookingService.cancelBooking(b.id);
      b.status = 'Cancelada';
      this.toast.success('Reserva cancelada correctamente.');
    } catch {
      this.toast.error('No se ha podido cancelar la reserva.');
    } finally {
      this.cancellingId = null;
    }
  }

  countByStatus(s: StatusFilter): number {
    const today = new Date().toISOString().split('T')[0];
    return this.bookings.filter(b => {
      switch (s) {
        case 'active':    return b.status === 'Confirmada' && b.checkOut >= today;
        case 'past':      return b.status === 'Confirmada' && b.checkOut < today;
        case 'cancelled': return b.status === 'Cancelada';
        default:          return true;
      }
    }).length;
  }

  totalSpent(): number {
    return this.bookings
      .filter(b => b.status === 'Confirmada')
      .reduce((acc, b) => acc + (b.totalPrice || (b.pricePerNight * (b.nights || 0))), 0);
  }

  totalNights(): number {
    return this.bookings
      .filter(b => b.status === 'Confirmada')
      .reduce((acc, b) => acc + (b.nights || 0), 0);
  }

  statusClass(status: string): string {
    if (status === 'Confirmada') return 'status-confirmed';
    if (status === 'Cancelada')  return 'status-cancelled';
    return 'status-pending';
  }

  daysUntil(date: string): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(date);
    target.setHours(0, 0, 0, 0);
    return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  }
}
