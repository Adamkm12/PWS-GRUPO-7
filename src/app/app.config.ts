import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { routes } from './app.routes';

const firebaseConfig = {
  projectId: 'pwm---web-hotel',
  appId: '1:1080021325951:web:a81c2f1c4cd110a685474a',
  storageBucket: 'pwm---web-hotel.firebasestorage.app',
  apiKey: 'AIzaSyAVNppoBkzBmm434RPcjva_tQf50Kwe3N4',
  authDomain: 'pwm---web-hotel.firebaseapp.com',
  messagingSenderId: '1080021325951',
  measurementId: 'G-BFXF8ZVLHG',
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ]
};
