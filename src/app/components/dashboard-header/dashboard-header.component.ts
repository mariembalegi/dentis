import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-header.component.html',
  styleUrls: ['./dashboard-header.component.scss']
})
export class DashboardHeaderComponent implements OnInit {
  userName = 'Utilisateur';
  isDropdownOpen = false;
  showAccueil = true;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      if (user) {
        this.userName = `${user.prenom} ${user.nom}`;
        // Hide 'Accueil' if patient and on home
        this.showAccueil = !(user.role === 'PATIENT' && this.router.url === '/');
      } else {
        this.showAccueil = true;
      }
    });
    // Also listen to route changes
    this.router.events.subscribe(() => {
      const user = this.authService.getUser();
      if (user) {
        this.showAccueil = !(user.role === 'PATIENT' && this.router.url === '/');
      } else {
        this.showAccueil = true;
      }
    });
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown() {
    this.isDropdownOpen = false;
  }

  onLogout() {
    this.authService.logout();
    this.isDropdownOpen = false;
  }
}
