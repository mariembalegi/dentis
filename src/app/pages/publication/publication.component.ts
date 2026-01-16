import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { DashboardHeaderComponent } from '../../components/dashboard-header/dashboard-header.component';
import { PublicationCardComponent } from '../../components/publication-card/publication-card.component'; // Import
import { AuthService } from '../../services/auth.service';
import { PublicationService, Article } from '../../services/publication.service';

@Component({
  selector: 'app-publication',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, DashboardHeaderComponent, PublicationCardComponent],
  template: `
    <app-dashboard-header *ngIf="isLoggedIn; else publicHeader"></app-dashboard-header>
    <ng-template #publicHeader>
      <app-header backgroundColor="#1A3251"></app-header>
    </ng-template>

    <div class="publication-page" *ngIf="currentArticle">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-container">
          <div class="hero-content">
            <h1 class="hero-title">
              {{ currentArticle.title }}
            </h1>
            <p class="hero-description">
              {{ currentArticle.description || "Sur prescription médicale, l'infirmier réalise les soins de pansement nécessaires à la bonne cicatrisation en suivant le protocole établi par le médecin, en veillant à ce que la plaie reste propre, protégée et à ce que la guérison se déroule dans les meilleures conditions possibles." }}
            </p>
            <div class="hero-author">
              Auteur: <span class="author-name">{{ currentArticle.author }}</span>
              <div class="hero-date">Publié le {{ currentArticle.date }}</div>
            </div>
            <a href="assets/publication.pdf" download class="pdf-download-link">
              <i class="fas fa-file-pdf"></i> En savoir plus
            </a>
          </div>
          <div class="hero-image-wrapper">
             <!-- Use article image -->
             <img [src]="currentArticle.image" [alt]="currentArticle.title" class="hero-image" />
          </div>
        </div>
      </section>

    </div>
  `,
  styles: [`
    .publication-page {
      font-family: 'Roboto', sans-serif;
    }

    /* Latest Section */
    .latest-section {
        padding: 40px 20px 80px;
        max-width: 1200px;
        margin: 0 auto;
    }
    
    .section-title {
        color: #1A3251;
        font-family: 'Montserrat', sans-serif;
        font-size: 28px;
        font-weight: 700;
        margin-bottom: 30px;
        /* text-align: center; */
    }
    
    .articles-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 30px;
    }

    /* Hero Section */
    .hero-section {
      background-color: #1A3251; /* Dark blue matching header */
      color: white;
      padding: 60px 20px;
    }

    .hero-container {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      gap: 48px;
    }

    .hero-content {
      flex: 1;
      max-width: 600px;
    }

    .hero-title {
      font-family: 'Montserrat', sans-serif;
      font-size: 36px;
      font-weight: 700;
      line-height: 1.3;
      margin-bottom: 24px;
    }

    .hero-title .highlight {
      position: relative;
      white-space: nowrap;
      
      /* Simple underline effect mimics the swoosh */
      border-bottom: 4px solid #4fc3f7; 
      padding-bottom: 2px;
    }

    .hero-description {
      font-size: 16px;
      line-height: 1.6;
      margin-bottom: 10px;
      font-weight: 400;
    }

    .hero-author {
      text-align: right;
      font-weight: 400;
      font-size: 14px;
      margin-bottom: 32px;
    }

    .hero-date {
      font-size: 12px;
      margin-top: 4px;
      opacity: 0.8;
    }

    .hero-description strong {
      font-weight: 700;
    }

    .pdf-download-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: #4fc3f7 !important;
      text-decoration: none;
      font-weight: 600;
      font-size: 14px;
      padding: 5px 0;
      transition: opacity 0.2s;
    }

    .pdf-download-link:hover {
      opacity: 0.8;
      text-decoration: underline;
    }

    .pdf-download-link i {
      font-size: 18px;
    }

    .hero-image-wrapper {
      flex: 1;
      display: flex;
      justify-content: center;
    }

    .hero-image {
      width: 100%;
      max-width: 500px;
      height: auto;
      border-radius: 24px; /* Large rounded corners */
      object-fit: cover;
    }

    /* Publication Types Section */
    .types-section {
      background-color: white;
      padding: 60px 20px;
    }

    .types-container {
      max-width: 1200px;
      margin: 0 auto;
      text-align: center;
    }

    .types-title {
      color: #1A3251;
      font-family: 'Montserrat', sans-serif;
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 40px;
    }

    .types-grid {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: center;
      gap: 16px;
    }

    .type-card {
      background-color: #fff0eb; /* Pastel orange/red tint */
      color: #D04747;
      border: 1px solid #faddd5;
      padding: 12px 24px;
      border-radius: 50px; /* Pill shape */
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      white-space: nowrap;
    }

    .type-card:hover {
      border-color: #D04747;
      background-color: #ffe0d4;
    }

    /* Responsive */
    @media (max-width: 900px) {
      .hero-container {
        flex-direction: column;
        text-align: center;
      }

      .hero-content {
        max-width: 100%;
      }

      .hero-title {
          font-size: 28px;
      }
    }
  `]
})
export class PublicationComponent implements OnInit {
  isLoggedIn = false;
  currentArticle: Article | undefined;
  latestArticles: Article[] = []; // Store latest articles

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private publicationService: PublicationService
  ) {}

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      this.isLoggedIn = !!user;
    });
    
    // Fetch latest articles (first 3 for now, or whatever logic)
    this.latestArticles = this.publicationService.getArticles().slice(0, 3);

    this.route.params.subscribe(params => {
        if (params['id']) {
            const id = +params['id'];
            this.currentArticle = this.publicationService.getArticleById(id);
        }

        // Fallback or default
        if (!this.currentArticle) {
             this.currentArticle = this.publicationService.getArticles()[0]; 
        }
    });
  }
}
