import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  Timestamp
} from '@angular/fire/firestore';

export interface Booking {
  id?: string;
  userId: string;
  room: string;
  pricePerNight: number;
  checkIn: string;
  checkOut: string;
  adults: number;
  kids: number;
  extras: string[];
  status: string;
  createdAt?: Timestamp;
}

@Injectable({ providedIn: 'root' })
export class BookingService {

  private firestore = inject(Firestore);

  // Creo una nueva reserva en la coleccion "bookings" de Firestore
  async createBooking(booking: Omit<Booking, 'id' | 'createdAt'>): Promise<void> {
    const ref = collection(this.firestore, 'bookings');
    await addDoc(ref, { ...booking, status: 'Confirmada', createdAt: Timestamp.now() });
  }

  // Obtengo todas las reservas del usuario autenticado
  async getUserBookings(userId: string): Promise<Booking[]> {
    const ref = collection(this.firestore, 'bookings');
    const q = query(ref, where('userId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as Omit<Booking, 'id'>) }));
  }
}
