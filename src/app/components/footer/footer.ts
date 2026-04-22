import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  imports: [CommonModule, RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.scss'
})
export class Footer {

  modalVisible = false;

  openModal(): void {
    this.modalVisible = true;
  }

  closeModal(event?: MouseEvent): void {
    if (!event || (event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.modalVisible = false;
    }
  }
}
