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
    
    // Edit Mode
    publicationToEdit: PublicationDTO | null = null;
    
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
      
      // If admin or dentist, load pending (Dentist needs to see their own)
      if (this.isAdmin || this.isDentist) {
          this.publicationService.getPendingPublications().subscribe({
              next: (data) => {
                  this.pendingPublications = data;
              },
              error: (err) => console.error('Failed to load pending', err)
          });
      }
  }

  openAddModal(pub: PublicationDTO | null = null) {
    this.publicationToEdit = pub;
    this.showAddModal = true;
  }

  closeAddModal() {
    this.showAddModal = false;
    this.publicationToEdit = null;
  }

  validatePublication(publication: PublicationDTO) {
      const id = publication.idPub || publication.id;
      if (id) {
          this.publicationService.validatePublication(id).subscribe({
              next: () => {
                  this.loadData();
              },
              error: (err) => console.error('Failed to validate', err)
          });
      } else {
        console.error('ID Publication manquant:', publication);
      }
  }

  rejectPublication(publication: PublicationDTO) {
       const id = publication.idPub || publication.id;
       if (confirm('Voulez-vous vraiment rejeter/supprimer cette publication ?') && id) {
           this.publicationService.deletePublication(id).subscribe({
               next: () => {
                   this.loadData();
               },
               error: (err) => console.error('Failed to reject', err)
           });
       }
  }

  deleteMyPublication(publication: PublicationDTO) {
      const id = publication.idPub || publication.id;
      if (confirm('Voulez-vous vraiment supprimer votre publication ?') && id) {
           this.publicationService.deletePublication(id).subscribe({
               next: () => {
                   this.loadData();
               },
               error: (err) => console.error('Failed to delete', err)
           });
      }
  }

  editPublication(publication: PublicationDTO) {
      this.openAddModal(publication);
  }
  
  toggleFilter() {
    this.showMyPublicationsOnly = !this.showMyPublicationsOnly;
    this.currentPage = 1;
    
    if (this.showMyPublicationsOnly) {
         this.publicationService.getMyPublications().subscribe({
             next: (data) => {
                 // For the main list, we only want "Valid" ones if we follow the pattern that
                 // pending ones are shown in the specific pending section.
                 // However, "My Publications" view usually implies seeing everything.
                 // But the pending section logic is independent of the main list logic.
                 // The main list `allPublications` is currently filtered by category.
                 
                 // If we populate `allPublications` with `data` (which is ALL my pubs),
                 // `filterPublications` will filter by category.
                 // This allows seeing "My Publications" for the specific category active.
                 // Note: filtering by "Valid" or not?
                 // `allPublications` (original) only had valid.
                 // If `getMyPublications` returns everything, we might see duplicates if we don't handle it.
                 // Pending are shown in `pendingPublications`.
                 // So we should probably filter `data` to only show `valide == true` in the main grid.
                 
                 this.allPublications = data.filter(p => p.valide);
                 this.filterPublications();
                 
                 // Also, we should probably update `pendingPublications`?
                 // The pending logic for dentist is:
                 /*
                   if (this.isAdmin || this.isDentist) {
                        this.publicationService.getPendingPublications().subscribe(...)
                   }
                 */
                 // `getPendingPublications` (Backend) returns ALL pending for Admin, maybe ALL for Dentist too?
                 // Or separate logic?
                 // If `getPendingPublications` returns correct pending list, we don't need to touch it.
                 // But `getMyPublications` might be a more up-to-date source for the specific user.
                 
                 // Let's just update the main grid for now.
             },
             error: (err) => console.error('Failed to load my publications', err)
         });
    } else {
        this.loadData();
    }
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
      let pubs = this.pendingPublications.filter(a => a.typePub === this.categoryName);
      // If dentist (and not admin), show only their own
      if (this.isDentist && !this.isAdmin && this.currentUser?.id) {
          pubs = pubs.filter(a => a.dentistId === this.currentUser!.id);
      }
      return pubs;
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
