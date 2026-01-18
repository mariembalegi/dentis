import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-users-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users-management.component.html',
  styleUrls: ['./users-management.component.scss']
})
export class UsersManagementComponent implements OnInit {
  activeTab = 'DENTISTE'; // DENTISTE, PATIENT, ADMIN
  
  stats = {
    dentists: 0,
    patients: 0,
    admins: 0
  };

  users: any[] = [];
  filteredUsers: any[] = [];

  // Modal State
  showAddAdminModal = false;
  newAdmin = { nom: '', prenom: '', email: '', password: '' };



  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.authService.getAllUsers().subscribe({
        next: (response) => {
            this.users = response;
            this.calculateStats();
            this.filterUsers();
        },
        error: (err) => {
            console.error('Error loading users', err);
        }
    });
  }

  calculateStats() {
    this.stats.dentists = this.users.filter(u => u.role === 'DENTISTE').length;
    this.stats.patients = this.users.filter(u => u.role === 'PATIENT').length;
    this.stats.admins = this.users.filter(u => u.role === 'ADMIN').length;
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
    // TODO: Implement backend creation for Admin
    if(this.newAdmin.email && this.newAdmin.password) {
        console.warn('Backend creation for Admin not implemented yet. Updating UI only.');
        const fakeAdmin = {
            id: -1, 
            nom: this.newAdmin.nom,
            prenom: this.newAdmin.prenom,
            email: this.newAdmin.email,
            role: 'ADMIN'
        };
        this.users.push(fakeAdmin);
        this.calculateStats();
        this.filterUsers();
        this.closeAddAdminModal();
    }
  }


}
