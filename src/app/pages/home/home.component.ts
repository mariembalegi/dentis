import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { DashboardHeaderComponent } from '../../components/dashboard-header/dashboard-header.component';
import { InfoCardComponent } from '../../components/info-card/info-card.component';
import { AuthService } from '../../services/auth.service';
import { DentistService, DentistSearchResult } from '../../services/dentist.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, DashboardHeaderComponent, InfoCardComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isPatientConnected = false;
  
  // Search
  searchTerm = '';
  searchLocation = '';
  searchResults: DentistSearchResult[] | null = null;
  isSearching = false;
  searchError: string | null = null;
  showDropdown = false;
  private searchTimeout: any;

  // Placeholder if image is missing
  defaultAvatar = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIiBmaWxsPSJub25lIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNFMEUwRTAiLz4KPHBhdGggZD0iTTIwIDEyQzE3Ljc5MDkgMTIgMTYgMTMuNzkwOSAxNiAxNkMxNiAxOC4yMDkxIDE3Ljc5MDkgMjAgMjAgMjBDMjIuMjA5MSAyMCAyNCAxOC4yMDkxIDIzLjE3MTYgMTZDMjQgMTMuNzkwOSAyMi4yMDkxIDEyIDIwIDEybTAtMkMyMy4zMTM3IDEwIDI2IDEyLjY4NjMgMjYgMTZDMjYgMTkuMzEzNyAyMy4zMTM3IDIyIDIwIDIyQzE2LjY4NjMgMjIgMTQgMTkuMzEzNyAxNCAxNkMxNCAxMi42ODYzIDE2LjY4NjMgMTAgMjAgMTBabTAgMjZDMjYuNjI3NCAzNiAzMiAzMC42Mjc0IDMyIDI0SDhDMzIgMzAuNjI3NCA4IDM2IDIwIDM2WiIgZmlsbD0iI0JEQkJEQiIvPgo8L3N2Zz4=';

  constructor(
    private authService: AuthService,
    private dentistService: DentistService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.user$.subscribe(user => {
        // Adjust condition as needed - e.g. check if user exists and is a PATIENT
        this.isPatientConnected = !!user && user.role === 'PATIENT';
    });
  }

  onSearchInput() {
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
    
    // Clear results if input is empty
    if (!this.searchTerm) {
        this.searchResults = null;
        this.showDropdown = false;
        return;
    }
    
    this.showDropdown = true;
    this.searchTimeout = setTimeout(() => {
        this.onSearch();
    }, 300);
  }

  onFocus() {
    if (this.searchTerm && this.searchResults) {
      this.showDropdown = true;
    }
  }

  onBlur() {
    // Delay hiding to allow click event on dropdown item to fire first
    setTimeout(() => {
      this.showDropdown = false;
    }, 200);
  }

  onSearch() {
    if (!this.searchTerm && !this.searchLocation) {
        return;
    }
    
    this.isSearching = true;
    this.searchError = null;
    this.showDropdown = true;

    this.dentistService.searchDentists(this.searchTerm, this.searchLocation).subscribe({
      next: (results) => {
        this.searchResults = results;
        this.isSearching = false;
      },
      error: (err) => {
        console.error('Search failed', err);
        // Silent error for dropdown usually, or minimal
        this.isSearching = false;
      }
    });
  }

  selectDentist(dentist: DentistSearchResult) {
      this.searchTerm = `Dr. ${dentist.prenom} ${dentist.nom}`;
      this.showDropdown = false;
      // Navigate to booking page
      this.router.navigate(['/booking'], { queryParams: { dentistId: dentist.id } });
  }
}