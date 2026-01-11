import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SignupService } from '../../services/signup.service';

@Component({
  selector: 'app-signupname',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signupname.component.html',
  styleUrls: ['./signupname.component.scss']
})
export class SignupnameComponent implements OnInit {
  email = '';
  prenom = '';
  nom = '';
  prenomError = false;
  nomError = false;

  constructor(private router: Router, private signupService: SignupService) {}

  ngOnInit() {
    this.email = this.signupService.getEmail();
  }

  onBackClick() {
    this.router.navigate(['/signup']);
  }

  onContinueClick() {
    this.prenomError = !this.prenom.trim();
    this.nomError = !this.nom.trim();

    if (this.prenomError || this.nomError) {
      return;
    }

    this.signupService.updateData({ prenom: this.prenom, nom: this.nom });

    const role = this.signupService.getRole();
    if (role === 'DENTISTE') {
       this.router.navigate(['/signup/details']);
    } else {
       this.router.navigate(['/signup/birthdate']);
    }
  }

  onPrenomChange() {
    this.prenomError = false;
  }

  onNomChange() {
    this.nomError = false;
  }
}
