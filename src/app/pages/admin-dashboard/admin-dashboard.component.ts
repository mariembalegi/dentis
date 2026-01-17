import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PublicationService, Article } from '../../services/publication.service';
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
  users: any[] = [
    { id: 1, nom: 'Dupont', prenom: 'Jean', email: 'jean.dupont@email.com', role: 'DENTISTE', status: 'PENDING', diplome: 'diplome_jean.pdf' },
    { id: 2, nom: 'Martin', prenom: 'Sophie', email: 'sophie.martin@email.com', role: 'DENTISTE', status: 'VALIDATED', diplome: 'diplome_sophie.pdf' },
    { id: 3, nom: 'Kefi', prenom: 'Ryma', email: 'ryma.kefi@email.com', role: 'PATIENT' },
    { id: 4, nom: 'Ben Ali', prenom: 'Ahmed', email: 'ahmed.benali@email.com', role: 'PATIENT' },
    { id: 5, nom: 'Admin', prenom: 'Super', email: 'admin@dentis.com', role: 'ADMIN' }
  ];
  filteredUsers: any[] = [];
  userSearchQuery = '';
  
  // Pagination Users
  currentPageUsers = 1;
  pageSize = 20;

  publications: Article[] = [];
  filteredPublications: Article[] = [];
  publicationSearchQuery = '';
  publicationFilter = 'ALL'; // ALL, VALIDATED, PENDING

  // Pagination Publications
  currentPagePublications = 1;

  // Modals
  selectedUser: any = null;
  showUserModal = false;

  selectedPublication: Article | null = null;
  showPublicationModal = false;

  constructor(private publicationService: PublicationService, private router: Router) {
    // Generate dummy users for pagination
    for (let i = 6; i <= 55; i++) {
        const role = i % 2 === 0 ? 'DENTISTE' : 'PATIENT';
        const status = role === 'DENTISTE' ? (i % 3 === 0 ? 'PENDING' : 'VALIDATED') : undefined;
        this.users.push({
            id: i,
            nom: `Nom${i}`,
            prenom: `Prenom${i}`,
            email: `user${i}@example.com`,
            role: role,
            status: status,
            diplome: role === 'DENTISTE' ? `diplome_${i}.pdf` : undefined
        });
    }
  }

  ngOnInit() {
    this.refreshData();
  }

  refreshData() {
    // Publications
    this.publications = this.publicationService.getArticles();
    // Default some to PENDING if not set (for demo)
    this.publications.forEach(p => {
        if (!p.status) p.status = 'VALIDATED';
    });
    
    this.filterPublications();

    // Users
    this.filterUsers();
    this.updateStats();
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

  openUserModal(user: any) {
    this.selectedUser = user;
    this.showUserModal = true;
  }

  closeUserModal() {
    this.selectedUser = null;
    this.showUserModal = false;
  }

  deleteUser(user: any) {
    if(confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
        this.users = this.users.filter(u => u.id !== user.id);
        this.filterUsers();
        this.updateStats();
        this.closeUserModal();
    }
  }

  validateDentist(user: any) {
    user.status = 'VALIDATED';
    this.filterUsers(); // Re-sort
  }

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
            p.title.toLowerCase().includes(q) ||
            p.author.toLowerCase().includes(q)
        );
    }

    // Sort: Pending First
    this.filteredPublications = temp.sort((a, b) => {
        if (a.status === 'PENDING' && b.status !== 'PENDING') return -1;
        if (a.status !== 'PENDING' && b.status === 'PENDING') return 1;
        return 0;
    });

    this.currentPagePublications = 1;
  }

  onPublicationSearch() {
    this.filterPublications();
  }

  openPublicationModal(pub: Article) {
    this.selectedPublication = pub;
    this.showPublicationModal = true;
  }

  closePublicationModal() {
    this.selectedPublication = null;
    this.showPublicationModal = false;
  }

  deletePublication(pub: Article) {
     if(confirm('Êtes-vous sûr de vouloir supprimer cette publication ?')) {
        this.publicationService.deleteArticle(pub.id);
        this.refreshData(); // get fresh list
        this.closePublicationModal();
     }
  }

  validatePublication(pub: Article) {
      this.publicationService.validateArticle(pub.id);
      pub.status = 'VALIDATED'; // Optimistic update
      this.refreshData();
  }
}
