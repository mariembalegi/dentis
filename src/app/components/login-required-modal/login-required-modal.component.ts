import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-required-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login-required-modal.component.html',
  styleUrls: ['./login-required-modal.component.scss']
})
export class LoginRequiredModalComponent {
  @Output() closeModal = new EventEmitter<void>();

  constructor(private router: Router) {}

  close() {
    this.closeModal.emit();
  }

  navigateToLogin() {
    this.router.navigate(['/signin']); 
    this.close();
  }

  navigateToSignup() {
    this.router.navigate(['/signup']);
    this.close();
  }
}
