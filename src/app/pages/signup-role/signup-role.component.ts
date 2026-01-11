import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SignupService } from '../../services/signup.service';

@Component({
  selector: 'app-signup-role',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1 class="page-title">Inscription</h1>
    
    <div class="signup-card">
      <a href="#" class="back-link" (click)="onBackClick(); $event.preventDefault()">← Retour</a>
      
      <h2 class="form-title">Vous êtes ?</h2>
      
      <div class="role-selection">
        <button class="role-card" (click)="selectRole('PATIENT')">
          <div class="icon-wrapper">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 8a3 3 0 1 1 3-3 3 3 0 0 1-3 3zm9 11v-1a7 7 0 0 0-7-7h-4a7 7 0 0 0-7 7v1h2v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1z" fill="#000"/>
             </svg>
          </div>
          <span>Patient</span>
          <p>Je souhaite prendre rendez-vous</p>
        </button>

        <button class="role-card" (click)="selectRole('DENTISTE')">
          <div class="icon-wrapper">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm-7 3a2 2 0 1 1-2 2 2 2 0 0 1 2-2zm0 12a2 2 0 1 1 2-2 2 2 0 0 1-2 2zm4-4h-8v-2h8z" fill="#000"/>
             </svg>
          </div>
          <span>Dentiste</span>
          <p>Je souhaite proposer mes services</p>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .page-title {
      text-align: center;
      color: white;
      font-size: 2.5rem;
      font-weight: 300;
      margin-bottom: 2rem;
    }
    .signup-card {
      background: white;
      border-radius: 8px;
      padding: 3rem;
      width: 100%;
      max-width: 500px;
      margin: 0 auto;
      text-align: center;
    }
    .back-link {
        display: block;
        text-align: left;
        color: #666;
        text-decoration: none;
        margin-bottom: 2rem;
    }
    .form-title {
      font-size: 1.5rem;
      color: #333;
      margin-bottom: 2rem;
    }
    .role-selection {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    .role-card {
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 1.5rem;
        background: none;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        transition: all 0.2s;
    }
    .role-card:hover {
        border-color: #000;
        background: #f9f9f9;
        transform: translateY(-2px);
    }
    .icon-wrapper {
        margin-bottom: 1rem;
    }
    .role-card span {
        font-weight: bold;
        font-size: 1.1rem;
        margin-bottom: 0.5rem;
    }
    .role-card p {
        color: #666;
        font-size: 0.9rem;
    }
  `]
})
export class SignupRoleComponent {
  constructor(private router: Router, private signupService: SignupService) {}

  onBackClick() {
    this.router.navigate(['/login']);
  }

  selectRole(role: 'PATIENT' | 'DENTISTE') {
    this.signupService.updateData({ role });
    this.router.navigate(['/signup/email']);
  }
}
