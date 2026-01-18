import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PublicationService, PublicationDTO } from '../../services/publication.service';
import { AuthService, User } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  
  // Stats
  stats = {
    users: 0,
    patients: 0,
    dentists: 0,
    publications: 0
  };

  // Content Toggles
  activeUserTab = 'ALL'; // ALL, DENTISTE, PATIENT, ADMIN
  
  // Data
  users: any[] = [];
  filteredUsers: any[] = [];
  userSearchQuery = '';
  
  // Pagination Users
  currentPageUsers = 1;
  pageSize = 20;

  publications: PublicationDTO[] = [];
  filteredPublications: PublicationDTO[] = [];
  publicationSearchQuery = '';
  publicationFilter = 'ALL'; // ALL, VALIDATED, PENDING

  // Pagination Publications
  currentPagePublications = 1;

  // Modals
  selectedUser: any = null;
  showUserModal = false;

  selectedPublication: PublicationDTO | null = null;
  showPublicationModal = false;

  constructor(
      private publicationService: PublicationService, 
      private authService: AuthService,
      private router: Router,
      private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.refreshData();
  }

  refreshData() {
    // Load ALL publications (Valid + Pending)
    this.publicationService.getAllValidPublications().subscribe(valid => {
        this.publicationService.getPendingPublications().subscribe(pending => {
            this.publications = [...valid, ...pending];
            this.filterPublications();
            this.updateStats(); // Update stats after loading publications
        });
    });

    // Load Users from Backend
    console.log('Tentative de chargement des utilisateurs...');
    this.authService.getAllUsers().subscribe({
        next: (users) => {
             console.log('Utilisateurs reçus du backend:', users);
             if (!users || users.length === 0) {
                 console.warn('Aucun utilisateur trouvé ou liste vide reçue.');
             }
             this.users = users.map(u => ({
                ...u,
                status: u.role === 'DENTISTE' ? (u.verifie ? 'VALIDATED' : 'PENDING') : undefined
            }));
            this.filterUsers();
            this.updateStats();
        },
        error: (err) => {
            console.error('Erreur lors du chargement des utilisateurs:', err);
            if (err.status === 403) {
                 alert('Erreur 403: Vous n\'avez pas la permission de voir les utilisateurs (Admin requis).');
            } else if (err.status === 404) {
                 console.error('Endpoint /userREST/all non trouvé.');
            }
        }
    });
  }

  updateStats() {
    this.stats.users = this.users.length;
    this.stats.patients = this.users.filter(u => u.role === 'PATIENT').length;
    this.stats.dentists = this.users.filter(u => u.role === 'DENTISTE').length;
    this.stats.publications = this.publications.length;
  }

  // --- Users Logic ---

  setUsersTab(tab: string) {
    this.activeUserTab = tab;
    this.filterUsers();
  }

  get paginatedUsers() {
    const startIndex = (this.currentPageUsers - 1) * this.pageSize;
    return this.filteredUsers.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPagesUsers() {
    return Math.ceil(this.filteredUsers.length / this.pageSize);
  }

  get pagesArrayUsers(): number[] {
    return Array.from({ length: this.totalPagesUsers }, (_, i) => i + 1);
  }

  filterUsers() {
    let temp = this.users;
    
    // Filter by Role
    if (this.activeUserTab !== 'ALL') {
        temp = temp.filter(u => u.role === this.activeUserTab);
    }

    // Search
    if (this.userSearchQuery) {
        const q = this.userSearchQuery.toLowerCase();
        temp = temp.filter(u => 
            u.nom.toLowerCase().includes(q) || 
            u.prenom.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q)
        );
    }

    // Sort: Pending Dentists First
    this.filteredUsers = temp.sort((a, b) => {
        if (a.role === 'DENTISTE' && b.role === 'DENTISTE') {
            if (a.status === 'PENDING' && b.status !== 'PENDING') return -1;
            if (a.status !== 'PENDING' && b.status === 'PENDING') return 1;
        }
        return 0;
    });

    this.currentPageUsers = 1; // Reset to first page on filter change
  }

  onUserSearch() {
    this.filterUsers();
  }

  /*
  openUserModal(user: any) {
    this.selectedUser = user;
    this.showUserModal = true;
  }

  closeUserModal() {
    this.selectedUser = null;
    this.showUserModal = false;
  }
  */

  deleteUser(user: any) {
    if(confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
        this.authService.deleteUser(user.id).subscribe({
            next: () => {
                this.users = this.users.filter(u => u.id !== user.id);
                this.filterUsers();
                this.updateStats();
                // this.closeUserModal();
            },
           error: (err) => console.error(err)
        });
    }
  }

  /*
  validateDentist(user: any) {
    user.status = 'VALIDATED';
    this.filterUsers(); // Re-sort
  }
  */

  downloadDiplome(user: any) {
    if (user.diplome) {
         // Create a fake link to simulate download
         // In a real app, this would be a URL to the stored file
         alert(`Simulation du téléchargement du fichier : ${user.diplome}`);
         
         /* 
         // Implementation for real file:
         const link = document.createElement('a');
         link.setAttribute('target', '_blank');
         link.setAttribute('href', 'assets/docs/' + user.diplome); 
         link.setAttribute('download', user.diplome);
         document.body.appendChild(link);
         link.click();
         link.remove();
         */
    }
  }


  // --- Publications Logic ---

  get paginatedPublications() {
    const startIndex = (this.currentPagePublications - 1) * this.pageSize;
    return this.filteredPublications.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPagesPublications() {
    return Math.ceil(this.filteredPublications.length / this.pageSize);
  }

  get pagesArrayPublications(): number[] {
      return Array.from({ length: this.totalPagesPublications }, (_, i) => i + 1);
  }

  filterPublications() {
    let temp = this.publications;

    // Filter by Status (if needed, or just sort)
    if (this.publicationFilter !== 'ALL') {
         // Implement if specific filter needed
    }

    // Search
    if (this.publicationSearchQuery) {
        const q = this.publicationSearchQuery.toLowerCase();
        temp = temp.filter(p => 
            p.titrePub.toLowerCase().includes(q) ||
            (p.dentistName && p.dentistName.toLowerCase().includes(q))
        );
    }

    // Sort: Pending First
    this.filteredPublications = temp.sort((a, b) => {
        if (!a.valide && b.valide) return -1;
        if (a.valide && !b.valide) return 1;
        return 0;
    });

    this.currentPagePublications = 1;
  }

  onPublicationSearch() {
    this.filterPublications();
  }

  openPublicationModal(pub: PublicationDTO) {
    this.selectedPublication = pub;
    this.showPublicationModal = true;
  }

  closePublicationModal() {
    this.selectedPublication = null;
    this.showPublicationModal = false;
  }

  deletePublication(pub: PublicationDTO) {
     if(confirm('Êtes-vous sûr de vouloir supprimer cette publication ?')) {
        if (pub.idPub) {
            this.publicationService.deletePublication(pub.idPub).subscribe({
                next: () => {
                    this.refreshData();
                    this.closePublicationModal();
                },
                error: (err) => console.error('Erreur suppression', err)
            });
        }
     }
  }

  validatePublication(pub: PublicationDTO) {
      console.log('Validating publication:', pub);
      const id = pub.idPub || pub.id;
      
      if (id) {
          this.publicationService.validatePublication(id).subscribe({
              next: () => {
                  console.log('Validation success');
                  this.refreshData();
                  if (this.selectedPublication && (this.selectedPublication.idPub === id || this.selectedPublication.id === id)) {
                      this.closePublicationModal();
                  }
              },
              error: (err) => {
                  console.error('Erreur validation', err);
                  if (err.status === 403) {
                      alert('Accès refusé (403). Session expirée ou droits insuffisants (Admin requis). Veuillez vous reconnecter.');
                  } else {
                      alert('Erreur lors de la validation. Vérifiez la console pour plus de détails.');
                  }
              }
          });
      } else {
          console.error('ID Publication manquant:', pub);
          alert('Impossible de valider : ID de publication manquant.');
      }
  }

  invalidatePublication(pub: PublicationDTO) {
      const id = pub.idPub || pub.id;
      if (id) {
          if(confirm('Annuler la validation de cette publication ? Elle repassera en attente.')) {
            this.publicationService.invalidatePublication(id).subscribe({
                next: () => {
                    alert('Publication dépubliée (remise en attente).');
                    this.refreshData();
                    if (this.selectedPublication && (this.selectedPublication.idPub === id || this.selectedPublication.id === id)) {
                        this.closePublicationModal();
                    }
                },
                error: (err) => {
                    console.error('Erreur invalidation', err);
                    if (err.status === 403) {
                        alert('Accès refusé (403). Session expirée ou droits insuffisants (Admin requis). Veuillez vous reconnecter.');
                    } else {
                        alert('Erreur lors de l\'invalidation.');
                    }
                }
            });
          }
      }
  }


  
  getSafeUrl(url: string | undefined): SafeResourceUrl | undefined {
      if (!url) return undefined;
      return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
