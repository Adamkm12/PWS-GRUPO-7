import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home').then(m => m.Home)
  },
  {
    path: 'accommodations',
    loadComponent: () => import('./pages/accommodations/accommodations').then(m => m.Accommodations)
  },
  {
    path: 'services',
    loadComponent: () => import('./pages/services/services').then(m => m.Services)
  },
  {
    path: 'gallery',
    loadComponent: () => import('./pages/gallery/gallery').then(m => m.Gallery)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then(m => m.Login)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register').then(m => m.Register)
  },
  {
    path: 'my-bookings',
    loadComponent: () => import('./pages/my-bookings/my-bookings').then(m => m.MyBookings),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: 'home' }
];
