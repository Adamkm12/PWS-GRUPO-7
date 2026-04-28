import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast';

@Component({
  selector: 'app-toast',
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrl: './toast.scss'
})
export class Toast {

  toastService = inject(ToastService);

  iconFor(type: string): string {
    switch (type) {
      case 'success': return 'bi-check-circle-fill';
      case 'error':   return 'bi-x-octagon-fill';
      case 'warning': return 'bi-exclamation-triangle-fill';
      default:        return 'bi-info-circle-fill';
    }
  }

  dismiss(id: number): void {
    this.toastService.dismiss(id);
  }
}
