import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BookingService, BookingExtra } from '../../services/booking';
import { AuthService } from '../../services/auth';
import { ToastService } from '../../services/toast';

interface Room {
  id: string;
  title: string;
  description: string;
  features: string[];
  pricePerNight: number;
  image: string;
  capacity: number;
  badge?: string;
}

@Component({
  selector: 'app-booking',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './booking.html',
  styleUrl: './booking.scss'
})
export class Booking implements OnInit {

  // ====== ESTADO DE LA RESERVA ======
  step = 1;
  totalSteps = 5;

  checkIn = '';
  checkOut = '';
  adults = 1;
  kids = 0;

  selectedRoom: Room | null = null;
  selectedExtras: BookingExtra[] = [];

  fullName = '';
  email = '';
  phone = '';
  specialRequests = '';
  paymentMethod: 'card' | 'transfer' | 'paypal' = 'card';
  cardNumber = '';
  cardName = '';
  cardExpiry = '';
  cardCvv = '';

  termsAccepted = false;

  loading = false;
  bookingConfirmedId: string | null = null;
  errorMessage = '';

  // ====== CATALOGO ======
  rooms: Room[] = [
    {
      id: 'suite-deluxe',
      title: 'Suite Deluxe',
      description: 'Habitacion espaciosa con vistas al mar, salon privado y bano de marmol con banera de hidromasaje.',
      features: ['Vistas al mar', 'Salon privado', 'Banera de hidromasaje', '60 m2'],
      pricePerNight: 280,
      image: 'assets/images/room.jpg',
      capacity: 4,
      badge: 'Mas reservada'
    },
    {
      id: 'junior-suite',
      title: 'Junior Suite',
      description: 'Suite moderna con terraza privada, minibar y zona de trabajo equipada con la ultima tecnologia.',
      features: ['Terraza privada', 'Minibar incluido', 'Zona de trabajo', '42 m2'],
      pricePerNight: 195,
      image: 'assets/images/room.jpg',
      capacity: 3
    },
    {
      id: 'habitacion-doble',
      title: 'Habitacion Doble',
      description: 'Habitacion confortable y elegante con cama king size, bano completo y acceso a todas las instalaciones.',
      features: ['Cama king size', 'Bano completo', 'Acceso piscina', '32 m2'],
      pricePerNight: 130,
      image: 'assets/images/room.jpg',
      capacity: 2
    }
  ];

  availableExtras: BookingExtra[] = [
    { label: 'Desayuno buffet', price: 18 },
    { label: 'Media pension', price: 35 },
    { label: 'Pension completa', price: 60 },
    { label: 'Traslado aeropuerto', price: 45 },
    { label: 'Spa premium 1h', price: 55 },
    { label: 'Parking vigilado', price: 15 },
    { label: 'Late check-out', price: 25 }
  ];

  steps = [
    { id: 1, label: 'Fechas', icon: 'bi-calendar2-week' },
    { id: 2, label: 'Habitacion', icon: 'bi-door-open' },
    { id: 3, label: 'Extras', icon: 'bi-stars' },
    { id: 4, label: 'Datos', icon: 'bi-person-vcard' },
    { id: 5, label: 'Confirmar', icon: 'bi-check2-circle' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingService,
    private authService: AuthService,
    private toast: ToastService
  ) {}

  get currentUser(): any {
    return this.authService.getCurrentUser();
  }

  get userName(): string {
    const u = this.currentUser;
    if (!u) return '';
    return u.displayName || (u.email ? u.email.split('@')[0] : '');
  }

  logout(): void {
    this.authService.logout().then(() => {
      this.router.navigate(['/home']);
    });
  }

  ngOnInit(): void {
    // Pre-relleno del formulario desde el buscador del home
    this.route.queryParams.subscribe(params => {
      this.checkIn  = params['checkIn']  || this.defaultCheckIn();
      this.checkOut = params['checkOut'] || this.defaultCheckOut();
      this.adults   = +params['adults']  || 1;
      this.kids     = +params['kids']    || 0;
      const roomId  = params['roomId'];
      if (roomId) {
        const r = this.rooms.find(x => x.id === roomId);
        if (r) {
          this.selectedRoom = r;
          this.step = 3;
        }
      }
    });

    const u = this.authService.getCurrentUser();
    if (u) {
      this.fullName = u.displayName || '';
      this.email = u.email || '';
    }
  }

  private defaultCheckIn(): string {
    return new Date().toISOString().split('T')[0];
  }

  private defaultCheckOut(): string {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  }

  // ====== NAVEGACION ======
  maxUnlockedStep(): number {
    // Highest step the user is allowed to navigate to, based on completed requirements.
    // Example: if step 1 is valid -> step 2 unlocked; if step 2 valid -> step 3 unlocked; etc.
    let unlocked = 1;
    for (let s = 1; s < this.totalSteps; s++) {
      if (!this.canAdvanceFrom(s)) break;
      unlocked = s + 1;
    }
    return unlocked;
  }

  progressPercent(): number {
    // Completion should not go backwards if the user returns to edit previous steps.
    const unlocked = this.maxUnlockedStep();
    return ((unlocked - 1) / (this.totalSteps - 1)) * 100;
  }

  goTo(step: number): void {
    if (step < 1 || step > this.totalSteps) return;
    if (step > this.maxUnlockedStep()) {
      this.toast.warning('Completa los pasos anteriores para continuar.');
      return;
    }
    this.step = step;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  next(): void {
    if (!this.canAdvanceFrom(this.step)) return;
    if (this.step < this.totalSteps) {
      this.step++;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  prev(): void {
    if (this.step > 1) {
      this.step--;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  canAdvanceFrom(step: number): boolean {
    switch (step) {
      case 1: return this.getNights() >= 3 && this.adults >= 1;
      case 2: return !!this.selectedRoom;
      case 3: return true;
      case 4: return this.isStep4Valid();
      default: return true;
    }
  }

  // ====== CALCULOS ======
  getNights(): number {
    return BookingService.calcNights(this.checkIn, this.checkOut);
  }

  getRoomSubtotal(): number {
    if (!this.selectedRoom) return 0;
    return this.selectedRoom.pricePerNight * this.getNights();
  }

  getExtrasSubtotal(): number {
    return this.selectedExtras.reduce((acc, e) => acc + e.price, 0) * this.getNights();
  }

  getTaxes(): number {
    return Math.round((this.getRoomSubtotal() + this.getExtrasSubtotal()) * 0.10);
  }

  getTotalPrice(): number {
    return this.getRoomSubtotal() + this.getExtrasSubtotal() + this.getTaxes();
  }

  // ====== ACCIONES STEP 1 ======
  changeAdults(delta: number): void {
    this.adults = Math.max(1, Math.min(10, this.adults + delta));
  }

  changeKids(delta: number): void {
    this.kids = Math.max(0, Math.min(10, this.kids + delta));
  }

  // ====== ACCIONES STEP 2 ======
  selectRoom(room: Room): void {
    if (room.capacity < this.adults + this.kids) {
      this.toast.warning(`Esta habitacion admite hasta ${room.capacity} huespedes.`);
      return;
    }
    this.selectedRoom = room;
    this.toast.success(`Has seleccionado ${room.title}`);
  }

  isRoomSelected(room: Room): boolean {
    return this.selectedRoom?.id === room.id;
  }

  // ====== ACCIONES STEP 3 ======
  toggleExtra(extra: BookingExtra): void {
    const idx = this.selectedExtras.findIndex(e => e.label === extra.label);
    if (idx >= 0) {
      this.selectedExtras.splice(idx, 1);
    } else {
      this.selectedExtras.push(extra);
    }
  }

  isExtraSelected(extra: BookingExtra): boolean {
    return this.selectedExtras.some(e => e.label === extra.label);
  }

  // ====== ACCIONES STEP 4 ======
  isStep4Valid(): boolean {
    if (!this.fullName.trim() || !this.email.trim() || !this.phone.trim()) return false;
    if (this.paymentMethod === 'card') {
      return this.cardNumber.replace(/\s/g, '').length >= 12
        && !!this.cardName.trim()
        && /^\d{2}\/\d{2}$/.test(this.cardExpiry)
        && /^\d{3,4}$/.test(this.cardCvv);
    }
    return true;
  }

  // ====== CONFIRMACION ======
  async confirm(): Promise<void> {
    if (!this.termsAccepted) {
      this.toast.error('Debes aceptar los terminos y condiciones para continuar.');
      return;
    }
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.toast.warning('Inicia sesion para finalizar tu reserva.');
      this.router.navigate(['/login']);
      return;
    }
    if (!this.selectedRoom || this.getNights() < 3) {
      this.toast.error('Estancia minima de 3 noches.');
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    try {
      const id = await this.withTimeout(
        this.bookingService.createBooking({
        userId: user.uid,
        room: this.selectedRoom.title,
        roomId: this.selectedRoom.id,
        pricePerNight: this.selectedRoom.pricePerNight,
        checkIn: this.checkIn,
        checkOut: this.checkOut,
        nights: this.getNights(),
        adults: this.adults,
        kids: this.kids,
        extras: this.selectedExtras,
        totalPrice: this.getTotalPrice(),
        guestInfo: {
          fullName: this.fullName,
          email: this.email,
          phone: this.phone,
          specialRequests: this.specialRequests
        },
        status: 'Confirmada'
      }),
        12000,
        'La confirmacion esta tardando demasiado. Revisa tu conexion e intentalo de nuevo.'
      );
      this.bookingConfirmedId = id;
      this.toast.success('Tu reserva se ha confirmado correctamente.');
      // Go straight to "My Bookings" and highlight this new booking.
      this.router.navigate(['/my-bookings'], { queryParams: { highlight: id } });
    } catch (e) {
      console.error(e);
      this.errorMessage = 'Ha ocurrido un error al guardar la reserva. Intentalo de nuevo.';
      this.toast.error(this.errorMessage);
    } finally {
      this.loading = false;
    }
  }

  goToBookings(): void {
    this.router.navigate(['/my-bookings']);
  }

  resetFlow(): void {
    this.step = 1;
    this.selectedRoom = null;
    this.selectedExtras = [];
    this.bookingConfirmedId = null;
    this.termsAccepted = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  formatCardNumber(): void {
    this.cardNumber = this.cardNumber
      .replace(/\D/g, '')
      .substring(0, 19)
      .replace(/(.{4})/g, '$1 ')
      .trim();
  }

  private withTimeout<T>(p: Promise<T>, ms: number, message: string): Promise<T> {
    let t: any;
    const timeout = new Promise<never>((_, reject) => {
      t = setTimeout(() => reject(new Error(message)), ms);
    });
    return Promise.race([p, timeout]).finally(() => clearTimeout(t));
  }
}
