import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { DashboardHeaderComponent } from '../../components/dashboard-header/dashboard-header.component';
import { PublicationCardComponent } from '../../components/publication-card/publication-card.component';
import { PublicationService, PublicationDTO } from '../../services/publication.service';
import { AuthService, User } from '../../services/auth.service';
import { AddPublicationModalComponent } from '../../components/add-publication-modal/add-publication-modal.component';

@Component({
  selector: 'app-publication-category',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, DashboardHeaderComponent, PublicationCardComponent, AddPublicationModalComponent],
  templateUrl: './publication-category.component.html',
  styleUrls: ['./publication-category.component.scss']
})
export class PublicationCategoryComponent implements OnInit {
  isLoggedIn = false;
  isDentist = false;
    isAdmin = false;
    showAddModal = false;
    showMyPublicationsOnly = false;
    currentUser: User | null = null;
    
    // Admin Pending
    pendingPublications: PublicationDTO[] = [];
    
    categoryName: string = 'Actualités/innovation';
    filteredPublications: PublicationDTO[] = [];
    allPublications: PublicationDTO[] = []; // Store all fetched publications
  
    currentPage = 1;
    itemsPerPage = 18;

    constructor(
      private authService: AuthService,
      private route: ActivatedRoute,
      private publicationService: PublicationService
    ) {}

    ngOnInit() {
      this.authService.user$.subscribe(user => {
        this.isLoggedIn = !!user;
      this.isDentist = user?.role === 'DENTISTE';
      this.isAdmin = user?.role === 'ADMIN';
      this.currentUser = user;
      
      this.loadData();
    });

    this.route.params.subscribe(params => {
        if (params['category']) {
            this.categoryName = this.mapSlugToLabel(params['category']);
        } else {
            this.categoryName = 'Actualités/innovation';
        }
        this.currentPage = 1;         
        // Filter when category changes
        this.filterPublications();
    });
  }

  mapSlugToLabel(slug: string): string {
      if (slug === 'Actualités') return 'Actualités/innovation';
      if (slug === 'Lancement produit') return 'Lancement d\'un produit ou service';
      return slug;
  }
  
  loadData() {
      // Load validated publications
      this.publicationService.getAllValidPublications().subscribe({
          next: (data) => {
              this.allPublications = data;
              this.filterPublications();
          },
          error: (err) => console.error('Failed to load publications', err)
      });
      
      // If admin, load pending
      if (this.isAdmin) {
          this.publicationService.getPendingPublications().subscribe({
              next: (data) => {
                  this.pendingPublications = data;
              },
              error: (err) => console.error('Failed to load pending', err)
          });
      }
  }

  openAddModal() {
    this.showAddModal = true;
  }

  closeAddModal() {
    this.showAddModal = false;
  }

  validatePublication(publication: PublicationDTO) {
      // Implement validation logic / API call here
      alert('Implémentez la validation via API');
  }

  rejectPublication(publication: PublicationDTO) {
       // Implement rejection logic / API call here
       alert('Implémentez le rejet via API');
  }
  
  toggleFilter() {
    this.showMyPublicationsOnly = !this.showMyPublicationsOnly;
    this.currentPage = 1;
    this.filterPublications();
  }

  onPublish(newPublication: any) {
    this.closeAddModal();
    this.loadData(); // Refresh list
  }

  filterPublications() {
    // Filter by category
    let publications = this.allPublications.filter(a => a.typePub === this.categoryName);
    
    if (this.showMyPublicationsOnly && this.currentUser) {
        // Filter by user ID if available in DTO
        if (this.currentUser.id) {
             publications = publications.filter(a => a.dentistId === this.currentUser!.id);
        }
    }
    
    this.filteredPublications = publications;
  }

  get filteredPendingPublications() {
      return this.pendingPublications.filter(a => a.typePub === this.categoryName);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredPublications.length / this.itemsPerPage);
  }

  get paginatedPublications(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredPublications.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get pagesArray(): (number | string)[] {
    const total = this.totalPages;
    const current = this.currentPage;
    const delta = 2;
    const range: (number | string)[] = [];
    
    for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
        range.push(i);
    }
    
    if (current - delta > 2) {
        range.unshift('...');
    }
    if (current + delta < total - 1) {
        range.push('...');
    }
    
    range.unshift(1);
    if (total > 1) {
        range.push(total);
    }
    
    return range;
  }

  changePage(page: any) {
    if (page === '...' || page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
