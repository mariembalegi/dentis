import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Article {
  id: number;
  title: string;
  date: string;
  author: string;
  readTime: string;
  category: string; // e.g., 'Santé mentale' (tag)
  mainCategory: string; // e.g., 'Article scientifique' (filter)
  image: string;
  content?: string; // Optional full content
  description?: string; // Short description
  status?: 'VALIDATED' | 'PENDING';
}

@Injectable({
  providedIn: 'root'
})
export class PublicationService {

  private articles: Article[] = [
    {
      id: 1,
      title: 'Trouble de la personnalité schizotypique : comprendre pour mieux agir',
      date: '07 Janvier 2026',
      author: 'Dr. Sarah Martin',
      readTime: '11 min',
      category: 'Santé mentale',
      mainCategory: 'Article scientifique',
      image: 'https://images.unsplash.com/photo-1590611936760-eeb9bc598548?auto=format&fit=crop&w=800&q=80',
      description: 'Une analyse approfondie des troubles de la personnalité schizotypique et des approches thérapeutiques modernes.',
      status: 'VALIDATED'
    },
    {
      id: 2,
      title: 'Comprendre les troubles de l\'éjaculation précoce et retardée pour retrouver confiance',
      date: '06 Janvier 2026',
      author: 'Dr. Jean Dupont',
      readTime: '7 min',
      category: 'Bien-être',
      mainCategory: 'Article scientifique',
      image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80',
      description: 'Approches cliniques et psychologiques pour traiter les dysfonctions sexuelles masculines courantes.',
      status: 'PENDING'
    },
    {
      id: 3,
      title: 'Troubles de l\'érection : comprendre, diagnostiquer et retrouver confiance',
      date: '29 Décembre 2025',
      author: 'Dr. Emily Chen',
      readTime: '7 min',
      category: 'Santé sexuelle',
      mainCategory: 'Article scientifique',
      image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80',
      description: 'Mise au point sur les dernières options thérapeutiques pour la dysfonction érectile.'
    },
    {
      id: 4,
      title: 'Analyse d\'un cas complexe de réhabilitation orale',
      date: '15 Décembre 2025',
      author: 'Dr. Marc Levy',
      readTime: '15 min',
      category: 'Chirurgie dentaire',
      mainCategory: 'Étude de cas',
      image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80',
      description: 'Étude détaillée d\'une reconstruction complète sur implants chez un patient à risque.'
    },
    {
      id: 5,
      title: 'Lancement du nouveau scanner intra-oral 3D : Révolution ou évolution ?',
      date: '10 Janvier 2026',
      author: 'Sophie Dubois',
      readTime: '5 min',
      category: 'Technologie',
      mainCategory: 'Lancement produit',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
      description: 'Test complet du dernier scanner 3D qui promet de réduire le temps de prise d\u0027empreinte de 50%.'
    },
    {
      id: 6,
      title: 'Les innovations marquantes du congrès dentaire 2025',
      date: '20 Décembre 2025',
      author: 'Dr. Thomas Bernard',
      readTime: '8 min',
      category: 'Innovation',
      mainCategory: 'Actualités',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
      description: 'Retour sur les conférences et les produits phares présentés lors du dernier congrès international.'
    }
  ];

  constructor() {
     // Generate dummy articles for pagination testing (ids 7-30)
     for (let i = 7; i <= 30; i++) {
        this.articles.push({
          id: i,
          title: `Nouvelle avancée en recherche dentaire : Phase ${i}`,
          date: '05 Janvier 2026',
          author: 'Dr. John Doe',
          readTime: '6 min',
          category: 'Recherche',
          mainCategory: 'Article scientifique',
          image: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=800&q=80',
          description: `Description de l'avancée numéro ${i} dans le domaine de la recherche dentaire fondamentale.`
        });
    }
  }

  getArticles(): Article[] {
    return this.articles;
  }

  getArticlesByCategory(category: string): Article[] {
    return this.articles.filter(a => a.mainCategory === category);
  }

  getArticleById(id: number): Article | undefined {
    return this.articles.find(a => a.id === id);
  }

  deleteArticle(id: number) {
    this.articles = this.articles.filter(a => a.id !== id);
  }

  validateArticle(id: number) {
    const article = this.articles.find(a => a.id === id);
    if (article) {
      article.status = 'VALIDATED';
    }
  }
}
