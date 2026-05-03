import { Injectable, Injector, inject, runInInjectionContext } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  Timestamp,
  doc,
  updateDoc,
  deleteDoc
} from '@angular/fire/firestore';

export interface BookingExtra {
  label: string;
  price: number;
}

export interface BookingGuestInfo {
  fullName: string;
  email: string;
  phone: string;
  specialRequests?: string;
}

export interface Booking {
  id?: string;
  userId: string;
  room: string;
  roomId?: string;
  pricePerNight: number;
  checkIn: string;
  checkOut: string;
  nights: number;
  adults: number;
  kids: number;
  extras: BookingExtra[];
  totalPrice: number;
  guestInfo?: BookingGuestInfo;
  status: 'Confirmada' | 'Pendiente' | 'Cancelada';
  createdAt?: Timestamp;
}

@Injectable({ providedIn: 'root' })
export class BookingService {

  private firestore = inject(Firestore);
  private injector = inject(Injector);

  // Calculo de noches entre dos fechas en formato yyyy-mm-dd
  static calcNights(checkIn: string, checkOut: string): number {
    if (!checkIn || !checkOut) return 0;
    const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  // Total = (noches * precio habitacion) + extras (precio por noche)
  static calcTotalPrice(pricePerNight: number, nights: number, extras: BookingExtra[]): number {
    const extrasTotal = extras.reduce((acc, e) => acc + e.price, 0);
    return pricePerNight * nights + extrasTotal * nights;
  }

  // Creo una nueva reserva en la coleccion "bookings" de Firestore
  async createBooking(booking: Omit<Booking, 'id' | 'createdAt'>): Promise<string> {
    return runInInjectionContext(this.injector, async () => {
      const ref = collection(this.firestore, 'bookings');
      const docRef = await addDoc(ref, { ...booking, createdAt: Timestamp.now() });
      return docRef.id;
    });
  }

  // Obtengo todas las reservas del usuario autenticado
  async getUserBookings(userId: string): Promise<Booking[]> {
    return runInInjectionContext(this.injector, async () => {
      const ref = collection(this.firestore, 'bookings');
      const q = query(ref, where('userId', '==', userId));
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map(d => ({ id: d.id, ...(d.data() as Omit<Booking, 'id'>) }));
      return items.sort((a, b) => {
        const ta = a.createdAt ? a.createdAt.toMillis() : 0;
        const tb = b.createdAt ? b.createdAt.toMillis() : 0;
        return tb - ta;
      });
    });
  }

  // Cambio el estado a "Cancelada"
  async cancelBooking(bookingId: string): Promise<void> {
    return runInInjectionContext(this.injector, async () => {
      const ref = doc(this.firestore, 'bookings', bookingId);
      await updateDoc(ref, { status: 'Cancelada' });
    });
  }

  // Elimino una reserva por completo
  async deleteBooking(bookingId: string): Promise<void> {
    return runInInjectionContext(this.injector, async () => {
      const ref = doc(this.firestore, 'bookings', bookingId);
      await deleteDoc(ref);
    });
  }
}
