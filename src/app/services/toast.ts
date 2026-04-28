import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
  duration?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {

  // Lista reactiva de toasts visibles en la app
  toasts = signal<Toast[]>([]);
  private nextId = 0;

  show(message: string, type: Toast['type'] = 'info', title?: string, duration = 4000): void {
    const id = ++this.nextId;
    const toast: Toast = { id, type, title, message, duration };
    this.toasts.update(list => [...list, toast]);
    if (duration > 0) {
      setTimeout(() => this.dismiss(id), duration);
    }
  }

  success(message: string, title = 'Hecho'): void {
    this.show(message, 'success', title);
  }

  error(message: string, title = 'Error'): void {
    this.show(message, 'error', title, 5000);
  }

  info(message: string, title = 'Informacion'): void {
    this.show(message, 'info', title);
  }

  warning(message: string, title = 'Aviso'): void {
    this.show(message, 'warning', title);
  }

  dismiss(id: number): void {
    this.toasts.update(list => list.filter(t => t.id !== id));
  }

  clear(): void {
    this.toasts.set([]);
  }
}
