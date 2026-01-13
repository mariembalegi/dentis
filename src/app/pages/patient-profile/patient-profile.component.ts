import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { PhoneEditModalComponent } from '../../components/phone-edit-modal/phone-edit-modal.component';
import { PasswordEditModalComponent } from '../../components/password-edit-modal/password-edit-modal.component';
import { EmailEditModalComponent } from '../../components/email-edit-modal/email-edit-modal.component';
import { DeleteAccountModalComponent } from '../../components/delete-account-modal/delete-account-modal.component';

@Component({
  selector: 'app-patient-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, PhoneEditModalComponent, PasswordEditModalComponent, EmailEditModalComponent, DeleteAccountModalComponent],
  templateUrl: './patient-profile.component.html',
  styleUrls: ['./patient-profile.component.scss']
})
export class PatientProfileComponent implements OnInit {
  user: User | null = null;
  patientName = 'Mohamed Achref ABDELBARI'; // Default or from service
  patientPhone = '06 51 51 81 96';
  patientEmail = 'mohamed.abdelbari@email.com';

  showPhoneModal = false;
  showEmailModal = false;
  showPasswordModal = false;
  showDeleteModal = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    const currentUser = this.authService.getUser();
    if (currentUser) {
      this.user = currentUser;
      this.patientName = `${currentUser.nom} ${currentUser.prenom}`;
      this.patientEmail = currentUser.email;
      // Phone might not be in the basic User interface, assuming mock for now or extend User
    }
  }

  // Phone Modal
  openPhoneModal() {
    this.showPhoneModal = true;
  }

  closePhoneModal() {
    this.showPhoneModal = false;
  }

  savePhone(newNumber: string) {
    this.patientPhone = newNumber;
    this.closePhoneModal();
    // Here you would typically call a service to update the user's phone number on the backend
  }

  // Email Modal
  openEmailModal() {
    this.showEmailModal = true;
  }

  closeEmailModal() {
    this.showEmailModal = false;
  }

  saveEmail(newEmail: string) {
    this.patientEmail = newEmail;
    this.closeEmailModal();
    // Call service to update email
  }

  // Password Modal
  openPasswordModal() {
    this.showPasswordModal = true;
  }

  closePasswordModal() {
    this.showPasswordModal = false;
  }

  savePassword(data: {old: string, new: string}) {
    console.log('Updating password', data);
    this.closePasswordModal();
    // Call service to update password
  }

  // Delete Account Modal
  openDeleteModal() {
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
  }

  logout() {
    this.authService.logout();
  }
}
