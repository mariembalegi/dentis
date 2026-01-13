import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-password-edit-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './password-edit-modal.component.html',
  styleUrls: ['./password-edit-modal.component.scss']
})
export class PasswordEditModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<{old: string, new: string}>();

  oldPassword = '';
  newPassword = '';
  
  showOldPassword = false;
  showNewPassword = false;

  toggleOldPasswordVisibility() {
    this.showOldPassword = !this.showOldPassword;
  }

  toggleNewPasswordVisibility() {
    this.showNewPassword = !this.showNewPassword;
  }

  onClose() {
    this.close.emit();
  }

  onSave() {
    // Basic validation could be added here
    this.save.emit({ old: this.oldPassword, new: this.newPassword });
  }
}
