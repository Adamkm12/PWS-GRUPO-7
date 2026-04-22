import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';
import { BookingService, Booking } from '../../services/booking';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-my-bookings',
  imports: [CommonModule, Header, Footer],
  templateUrl: './my-bookings.html',
  styleUrl: './my-bookings.scss'
})
export class MyBookings implements OnInit {

  bookings: Booking[] = [];
  loading = true;

  constructor(
    private bookingService: BookingService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (!user) { this.loading = false; return; }

    // Cargo las reservas del usuario desde Firestore
    this.bookingService.getUserBookings(user.uid)
      .then(bookings => { this.bookings = bookings; this.loading = false; })
      .catch(() => { this.loading = false; });
  }
}
