import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { DashboardHeaderComponent } from '../../components/dashboard-header/dashboard-header.component';
import { PublicationCardComponent } from '../../components/publication-card/publication-card.component';
import { PublicationService } from '../../services/publication.service';
import { AuthService, User } from '../../services/auth.service';
import { AddPublicationModalComponent } from '../../components/add-publication-modal/add-publication-modal.component';

@Component({
  selector: 'app-publication-category',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, DashboardHeaderComponent, PublicationCardComponent, AddPublicationModalComponent],
  template: `
    <app-dashboard-header *ngIf="isLoggedIn; else publicHeader" customBackgroundColor="#1A3251" textColor="white"></app-dashboard-header>
    <ng-template #publicHeader>
      <app-header backgroundColor="#1A3251"></app-header>
    </ng-template>

    <div class="category-page">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-shape shape-1"></div>
        <div class="hero-shape shape-2"></div>
        <div class="hero-shape shape-3"></div>
        
        <div class="hero-container">
          <h1 class="hero-title">{{ categoryName }}</h1>

          <div class="hero-nav-pills">
            <a [routerLink]="['/publication', 'Article scientifique']" class="nav-pill" [class.active]="categoryName === 'Article scientifique'">
                <i class="fas fa-microscope"></i> Article scientifique
            </a>
            <a [routerLink]="['/publication', 'Étude de cas']" class="nav-pill" [class.active]="categoryName === 'Étude de cas'">
                <i class="fas fa-file-medical-alt"></i> Étude de cas
            </a>
            <a [routerLink]="['/publication', 'Lancement produit']" class="nav-pill" [class.active]="categoryName === 'Lancement produit'">
                <i class="fas fa-rocket"></i> Lancement d'un produit ou service
            </a>
            <a [routerLink]="['/publication', 'Actualités']" class="nav-pill" [class.active]="categoryName === 'Actualités'">
                <i class="far fa-lightbulb"></i> Actualités/innovation
            </a>
          </div>
        </div>
      </section>

      <!-- Add Button Bar -->
      <div class="add-btn-container" *ngIf="isDentist">
          <button class="btn-filter" (click)="toggleFilter()" [class.active]="showMyPublicationsOnly" 
                  title="{{ showMyPublicationsOnly ? 'Voir toutes les publications' : 'Filtrer mes publications' }}">
              <i class="fas fa-filter"></i>
          </button>
          
          <button class="btn-add-pub" (click)="openAddModal()" title="Ajouter une publication">
              <i class="fas fa-plus"></i>
          </button>
      </div>

      <!-- Admin Validation Section -->
      <section class="validation-section" *ngIf="isAdmin && filteredPendingArticles.length > 0">
        <div class="articles-container">  
           <h2 class="pending-section-title">
               <i class="fas fa-tasks"></i> Publications en attente de validation
           </h2>
           <div class="articles-grid">
               <!-- Card mimics app-publication-card structure -->
               <div class="article-card pending-card" 
                    *ngFor="let article of filteredPendingArticles"
                    [routerLink]="['/publication', 'article', article.id]">
                    <div class="card-image" [style.backgroundImage]="'url(' + article.image + ')'">
                    </div>
                    <div class="card-content">
                        <h3 class="card-title">{{ article.title }}</h3>
                        <div class="card-meta">
                            <span class="date"><i class="far fa-calendar"></i> {{ article.date }}</span>
                            <span class="meta-separator">|</span>
                            <span class="author"><i class="far fa-user"></i> {{ article.author }}</span>
                        </div>
                        
                        <div class="admin-actions">
                            <button class="btn-validate" (click)="$event.stopPropagation(); validateArticle(article)">
                                <i class="fas fa-check"></i> Valider
                            </button>
                            <button class="btn-reject" (click)="$event.stopPropagation(); rejectArticle(article)">
                                <i class="fas fa-times"></i> Rejeter
                            </button>
                        </div>
                    </div>
               </div>
           </div>
        </div>
      </section>

      <!-- Articles Grid Section -->
      <section class="articles-section">
        <div class="articles-container">
          <div class="articles-grid">
            <app-publication-card 
              *ngFor="let article of paginatedArticles" 
              [article]="article">
            </app-publication-card>
          </div>
          
          <div *ngIf="filteredArticles.length === 0" class="no-articles">
            <p>Aucune publication disponible pour cette catégorie.</p>
          </div>

          <!-- Pagination -->
          <div class="pagination-container" *ngIf="totalPages > 1">
             <button *ngFor="let page of pagesArray" 
                     class="page-btn" 
                     [class.active]="page === currentPage"
                     [class.ellipsis]="page === '...'"
                     [disabled]="page === '...'"
                     (click)="changePage(page)">
               {{ page }}
             </button>
             
             <button class="page-btn next-btn" 
                     (click)="changePage(currentPage + 1)"
                     [disabled]="currentPage === totalPages">
                >>
             </button>
          </div>
        </div>
      </section>

      <!-- Add Modal -->
      <app-add-publication-modal
        *ngIf="showAddModal"
        (close)="closeAddModal()"
        (publish)="onPublish($event)">
      </app-add-publication-modal>

    </div>
  `,
  styles: [`
    .category-page {
      font-family: 'Roboto', sans-serif;
      background-color: #f8fcfd;
      min-height: 100vh;
    }

    /* Add Pub Button */
    .add-btn-container {
        display: flex;
        justify-content: flex-end; /* Right aligned */
        align-items: center;
        gap: 15px;
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px 20px 0; /* Top padding separates from hero */
        position: relative;
        z-index: 10;
    }

    .btn-filter {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background-color: white;
      color: #1A3251;
      border: none;
      box-shadow: 0 4px 10px rgba(0,0,0,0.2);
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 20px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-filter:hover {
      transform: scale(1.1);
      color: #0596DE;
    }

    .btn-filter.active {
      background-color: #0596DE;
      color: white;
    }

    .btn-add-pub {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: #1A3251; /* Match header color or accentuate with #0596DE */
        color: white;
        border: none;
        box-shadow: 0 4px 10px rgba(0,0,0,0.2);
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 20px;
        cursor: pointer;
        transition: transform 0.2s, background-color 0.2s;
        
        &:hover {
            transform: scale(1.1);
            background-color: #0596DE;
        }
    }

    /* Hero Section matching screenshot */
    .hero-section {
      background: linear-gradient(170deg, #1A3251 0%, #152a45 100%);
      color: white;
      text-align: center;
      padding: 60px 20px 80px; /* Extra padding bottom for overlap or aesthetic */
      position: relative;
      overflow: hidden;
    }

    .hero-shape {
      position: absolute;
      border-radius: 50%;
      z-index: 1;
      pointer-events: none;
    }

    .shape-1 {
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, rgba(79,195,247,0.1) 0%, rgba(26,50,81,0) 70%);
      top: -100px;
      left: -100px;
    }

    .shape-2 {
      width: 300px;
      height: 300px;
      border: 2px solid rgba(208, 71, 71, 0.1); /* Subtle orange ring */
      bottom: -50px;
      right: 10%;
    }

    .shape-3 {
      width: 150px;
      height: 150px;
      background: rgba(255, 255, 255, 0.03);
      top: 20%;
      right: -50px;
    }

    .hero-container {
      max-width: 1000px;
      margin: 0 auto;
      position: relative;
      z-index: 2;
    }

    .hero-title {
      font-family: 'Montserrat', sans-serif;
      font-size: 40px;
      font-weight: 700;
      margin-bottom: 16px;
    }

    .hero-subtitle {
      font-size: 18px;
      margin-bottom: 40px;
      max-width: 800px;
      margin-left: auto;
      margin-right: auto;
    }

    /* Pills Navigation */
    .hero-nav-pills {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 10px;
    }

    .nav-pill {
      background-color: var(--dark-blue);
      color: white;
      padding: 10px 20px;
      border-radius: 50px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      border: 2px solid white;
    }

    .nav-pill i {
        color: white;
    }

    .nav-pill:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }

    .nav-pill.active {
      background-color: white;
      color: #D04747;
      border: 2px solid white;
    }

    .nav-pill.active i {
        color: #D04747;
    }

    /* Articles Grid */
    .articles-section {
      padding: 60px 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .articles-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .articles-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 30px;
    }

    .no-articles {
      text-align: center;
      padding: 40px;
      color: #64748b;
      font-size: 18px;
    }

    /* Pagination */
    .pagination-container {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
      margin-top: 50px;
    }

    .page-btn {
      min-width: 40px;
      height: 40px;
      padding: 0 10px;
      border: none;
      border-radius: 6px;
      background-color: #f0f7fa;
      color: #1A3251;
      font-family: 'Montserrat', sans-serif;
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    .page-btn:hover:not(:disabled) {
      background-color: #e0f2fe;
    }

    .page-btn.active {
      background-color: #0596DE;
      color: white;
    }

    .page-btn.ellipsis {
      background: transparent;
      cursor: default;
      color: #64748b;
    }
    
    .page-btn:disabled:not(.ellipsis) {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* Shared Card Styles (duplicated from publication-card component for standalone use) */
    .article-card {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.05);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    .card-image {
      height: 200px;
      background-size: cover;
      background-position: center;
      background-color: #eee;
      position: relative;
    }
    .card-content {
      padding: 24px;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    }
    .card-title {
      font-family: 'Montserrat', sans-serif;
      font-size: 18px;
      font-weight: 700;
      color: #1A3251;
      margin: 0 0 16px 0;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .card-meta {
      display: flex;
      align-items: center;
      color: #64748b;
      font-size: 14px;
      margin-bottom: auto; /* Push buttons to bottom */
    }
    .meta-separator {
        margin: 0 10px;
        color: #cbd5e1;
    }

    /* Validation Specifics */
    .validation-section {
      padding: 20px 0;
      background-color: #fffbf0; /* Subtle warning bg for section, not frame */
      border-bottom: 1px solid #ffeeba;
    }
    .pending-section-title {
        color: #f57f17;
        margin-bottom: 20px;
        font-family: 'Montserrat', sans-serif;
        font-size: 24px;
        padding-left: 20px;
    }
    .pending-card { 
        border: 2px solid #f57f17; 
    }
    .pending-badge { 
        position: absolute;
        top: 10px;
        right: 10px;
        background-color: #f57f17;
        color: white;
        padding: 4px 12px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: bold;
    }
    .admin-actions { 
        display: flex; 
        gap: 10px; 
        margin-top: 20px; 
        padding-top: 15px; 
        border-top: 1px solid #eee; 
    }
    .btn-validate { 
        flex: 1; 
        background-color: #2ecc71; 
        color: white; 
        border: none; 
        padding: 10px; 
        border-radius: 6px; 
        cursor: pointer; 
        font-weight: 600;
        transition: background-color 0.2s;
    }
    .btn-validate:hover { background-color: #27ae60; }

    .btn-reject { 
        flex: 1; 
        background-color: #e74c3c; 
        color: white; 
        border: none; 
        padding: 10px; 
        border-radius: 6px; 
        cursor: pointer; 
        font-weight: 600;
        transition: background-color 0.2s;
    }
    .btn-reject:hover { background-color: #c0392b; }
  `]
})
export class PublicationCategoryComponent implements OnInit {
  isLoggedIn = false;
  isDentist = false;
    isAdmin = false;
    showAddModal = false;
    showMyPublicationsOnly = false;
    currentUser: User | null = null;
    
    // Admin Pending
    pendingArticles: any[] = [
      {
        id: 999,
        title: 'Nouvelles techniques d\'implantologie',
        category: 'Article scientifique',
        date: '18 Jan 2026',
        author: 'Dr. Martin',
        dateStr: '18 Jan 2026',
        summary: 'Review des dernières innovations en implantologie basale.',
        image: 'assets/images/placeholder_dental.jpg' 
      },
      {
        id: 998,
        title: 'Cas clinique: Reconstitution complexe',
        category: 'Étude de cas',
        date: '15 Jan 2026',
        author: 'Dr. Sophie',
        dateStr: '15 Jan 2026',
        summary: 'Description étape par étape...',
        image: 'assets/images/placeholder_dental.jpg' 
      },
      {
         id: 997,
         title: 'Nouveau Scanner 3D',
         category: 'Actualités',
         date: '10 Jan 2026',
         author: 'Dr. Tech',
         dateStr: '10 Jan 2026',
         summary: 'Présentation du nouveau scanner...',
         image: 'assets/images/placeholder_dental.jpg'
      }
    ];
    
    categoryName: string = 'Actualités';
    filteredArticles: any[] = [];
  
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
      // Reset filter when user changes
      this.showMyPublicationsOnly = false;
      this.filterArticles();
    });

    this.route.params.subscribe(params => {
        if (params['category']) {
            this.categoryName = params['category'];
            this.currentPage = 1;         
        }
        // Always filter (either with new param or default 'Actualités')
        this.filterArticles();
    });
  }

  openAddModal() {
    this.showAddModal = true;
  }

  closeAddModal() {
    this.showAddModal = false;
  }

  validateArticle(article: any) {
    if(confirm('Valider cet article "' + article.title + '" ?')) {
        this.pendingArticles = this.pendingArticles.filter(a => a !== article);
        // Add to main list mock
        this.filteredArticles.unshift(article);
        alert('Article validé avec succès !');
    }
  }

  rejectArticle(article: any) {
       if(confirm('Rejeter et supprimer cet article ?')) {
           this.pendingArticles = this.pendingArticles.filter(a => a !== article);
       }
  }
  
  toggleFilter() {
    this.showMyPublicationsOnly = !this.showMyPublicationsOnly;
    this.currentPage = 1;
    this.filterArticles();
  }

  onPublish(newArticle: any) {
    console.log('Publishing new article:', newArticle);
    // Here you would typically call a service method to save the article
    // For now, we'll just close the modal
    this.closeAddModal();
    // Ideally adding it to local list or refreshing
    // this.filteredArticles.unshift(newArticle);
  }

  filterArticles() {
    let articles = this.publicationService.getArticlesByCategory(this.categoryName);
    
    if (this.showMyPublicationsOnly && this.currentUser) {
        // Simple name matching heuristic for prototype
        // In real app, check article.authorId === this.currentUser.id
        const userFullName = `${this.currentUser.prenom} ${this.currentUser.nom}`.toLowerCase();
        const userLastName = this.currentUser.nom.toLowerCase();
        
        articles = articles.filter(article => {
            const author = article.author.toLowerCase();
            return author.includes(userLastName);
        });
    }
    
    this.filteredArticles = articles;
  }

  get filteredPendingArticles() {
      // Map category name aliases if necessary, or assume exact match
      // The tabs use: 'Article scientifique', 'Étude de cas', 'Lancement produit', 'Actualités'
      // Special case: 'Actualités' matches 'Actualités'
      return this.pendingArticles.filter(a => a.category === this.categoryName);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredArticles.length / this.itemsPerPage);
  }

  get paginatedArticles(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredArticles.slice(startIndex, startIndex + this.itemsPerPage);
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
