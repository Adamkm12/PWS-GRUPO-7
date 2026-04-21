import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes), provideClientHydration(withEventReplay()), provideFirebaseApp(() => initializeApp({ projectId: "pwm---web-hotel", appId: "1:1080021325951:web:b081c01056b5aceb85474a", storageBucket: "pwm---web-hotel.firebasestorage.app", apiKey: "AIzaSyAVNppoBkzBmm434RPcjva_tQf50Kwe3N4", authDomain: "pwm---web-hotel.firebaseapp.com", messagingSenderId: "1080021325951", measurementId: "G-2005HDYS8K", projectNumber: "1080021325951", version: "2" })), provideFirestore(() => getFirestore())
  ]
};
