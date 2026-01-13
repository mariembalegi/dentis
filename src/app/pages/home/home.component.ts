import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { DashboardHeaderComponent } from '../../components/dashboard-header/dashboard-header.component';
import { InfoCardComponent } from '../../components/info-card/info-card.component';
import { AuthService } from '../../services/auth.service';
import { DentistService, DentistSearchResult } from '../../services/dentist.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HeaderComponent, DashboardHeaderComponent, InfoCardComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isPatientConnected = false;
  
  // Search
  searchTerm = '';
  searchLocation = '';
  
  // Dropdown Data
  dropdownServices: string[] = [];
  dropdownDentists: DentistSearchResult[] = [];
  
  // Legacy/Full Search Data
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
        this.dropdownServices = [];
        this.dropdownDentists = [];
        this.showDropdown = false;
        return;
    }
    
    this.showDropdown = true;
    this.searchTimeout = setTimeout(() => {
        this.fetchDropdown();
    }, 300);
  }

  onFocus() {
    if (this.searchTerm && (this.dropdownServices.length > 0 || this.dropdownDentists.length > 0)) {
      this.showDropdown = true;
    }
  }

  onBlur() {
    // Delay hiding to allow click event on dropdown item to fire first
    setTimeout(() => {
      this.showDropdown = false;
    }, 200);
  }

  fetchDropdown() {
    this.isSearching = true;
    this.searchError = null;

    this.dentistService.getSearchDropdown(this.searchTerm).subscribe({
      next: (res) => {
        this.dropdownServices = res.services || [];
        this.dropdownDentists = res.dentistes || [];
        this.isSearching = false;
        // Keep open even if empty? Or close?
        // if (this.dropdownServices.length === 0 && this.dropdownDentists.length === 0) { }
      },
      error: (err) => {
        console.error('Dropdown Search failed', err);
        this.isSearching = false;
      }
    });
  }

  // Called when clicking "Rechercher" button - legacy full search
  onSearch() {
    if (!this.searchTerm && !this.searchLocation) {
        return;
    }
    
    // Logic for full search result page could go here
    // For now, let's just trigger the dropdown fetch again or do nothing if already fetched
    if (this.showDropdown) return; 
    
    this.fetchDropdown();
    
    // Optionally: this.router.navigate(['/search-results'], { queryParams: ... })
  }

  selectService(serviceName: string) {
      this.searchTerm = serviceName;
      this.showDropdown = false;
      // Maybe filter map by service? or navigate
      console.log('Selected service:', serviceName);
  }

  selectDentist(dentist: DentistSearchResult) {
      this.searchTerm = `Dr. ${dentist.prenom} ${dentist.nom}`;
      this.showDropdown = false;
      // Navigate to profile page
      this.router.navigate(['/dashboard/dentist', dentist.id]);
  }
}