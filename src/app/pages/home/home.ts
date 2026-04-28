import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule, Header, Footer],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {

  checkIn: string = '';
  checkOut: string = '';
  adults: number = 1;
  kids: number = 0;
  promoCode: string = '';

  constructor(private router: Router) {
    const today = new Date();
    const checkout = new Date(today);
    checkout.setDate(checkout.getDate() + 3);
    this.checkIn = today.toISOString().split('T')[0];
    this.checkOut = checkout.toISOString().split('T')[0];
  }

  changeAdults(delta: number): void {
    this.adults = Math.max(1, this.adults + delta);
  }

  changeKids(delta: number): void {
    this.kids = Math.max(0, this.kids + delta);
  }

  search(): void {
    this.router.navigate(['/booking'], {
      queryParams: {
        checkIn: this.checkIn,
        checkOut: this.checkOut,
        adults: this.adults,
        kids: this.kids
      }
    });
  }
}
