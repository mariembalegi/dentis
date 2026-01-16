import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-users-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users-management.component.html',
  styleUrls: ['./users-management.component.scss']
})
export class UsersManagementComponent implements OnInit {
  activeTab = 'DENTISTE'; // DENTISTE, PATIENT, ADMIN
  
  // Mock Data
  stats = {
    dentists: 15,
    patients: 120,
    admins: 2
  };

  users = [
    { id: 1, nom: 'Dupont', prenom: 'Jean', email: 'jean.dupont@email.com', role: 'DENTISTE', status: 'PENDING', diplome: 'diplome_jean.pdf' },
    { id: 2, nom: 'Martin', prenom: 'Sophie', email: 'sophie.martin@email.com', role: 'DENTISTE', status: 'VALIDATED', diplome: 'diplome_sophie.pdf' },
    { id: 3, nom: 'Kefi', prenom: 'Ryma', email: 'ryma.kefi@email.com', role: 'PATIENT' },
    { id: 4, nom: 'Ben Ali', prenom: 'Ahmed', email: 'ahmed.benali@email.com', role: 'PATIENT' },
    { id: 5, nom: 'Admin', prenom: 'Super', email: 'admin@dentis.com', role: 'ADMIN' }
  ];

  filteredUsers: any[] = [];

  // Modal State
  showAddAdminModal = false;
  newAdmin = { nom: '', prenom: '', email: '', password: '' };

  // Verification Modal State
  showVerificationModal = false;
  selectedDentist: any = null;

  ngOnInit() {
    this.filterUsers();
  }

  setTab(tab: string) {
    this.activeTab = tab;
    this.filterUsers();
  }

  filterUsers() {
    this.filteredUsers = this.users.filter(u => u.role === this.activeTab);
  }

  // Admin Creation
  openAddAdminModal() {
    this.showAddAdminModal = true;
  }

  closeAddAdminModal() {
    this.showAddAdminModal = false;
    this.newAdmin = { nom: '', prenom: '', email: '', password: '' };
  }

  saveNewAdmin() {
    if(this.newAdmin.email && this.newAdmin.password) {
        // Add mock admin
        this.users.push({
            id: this.users.length + 1,
            nom: this.newAdmin.nom,
            prenom: this.newAdmin.prenom,
            email: this.newAdmin.email,
            role: 'ADMIN'
        });
        this.stats.admins++;
        this.filterUsers();
        this.closeAddAdminModal();
    }
  }

  // Dentist Verification
  openVerificationModal(dentist: any) {
      this.selectedDentist = dentist;
      this.showVerificationModal = true;
  }

  closeVerificationModal() {
      this.selectedDentist = null;
      this.showVerificationModal = false;
  }

  validateDentist() {
      if(this.selectedDentist) {
          this.selectedDentist.status = 'VALIDATED';
          this.closeVerificationModal();
      }
  }
}
