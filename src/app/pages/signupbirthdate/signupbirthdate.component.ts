import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SignupService } from '../../services/signup.service';
import { DateMaskDirective } from '../../directives/date-mask.directive';

@Component({
  selector: 'app-signupbirthdate',
  standalone: true,
  imports: [CommonModule, FormsModule, DateMaskDirective],
  templateUrl: './signupbirthdate.component.html',
  styleUrls: ['./signupbirthdate.component.scss']
})
export class SignupbirthdateComponent implements OnInit {
  email = '';
  birthdate = '';
  sexe = 'feminin';
  birthdateError = false;

  constructor(private router: Router, private signupService: SignupService) {}

  ngOnInit() {
    this.email = this.signupService.getEmail();
  }

  onBackClick() {
    this.router.navigate(['/signup/name']);
  }

  onContinueClick() {
    console.log('=== DEBUG ===');
    console.log('Birthdate value:', JSON.stringify(this.birthdate));
    console.log('Birthdate length:', this.birthdate.length);
    
    // Vérifier que la date correspond au pattern jj / mm / aaaa
    const datePattern = /^\d{2} \/ \d{2} \/ \d{4}$/;
    const isValidDate = datePattern.test(this.birthdate);
    
    console.log('Date pattern test:', isValidDate);
    console.log('Pattern:', datePattern);
    
    this.birthdateError = !isValidDate;

    if (this.birthdateError) {
      console.log('Date is invalid, showing error');
      return;
    }

    // Format date: dd / mm / yyyy -> yyyy-mm-dd
    const parts = this.birthdate.split(' / ');
    const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;

    // Map sex: feminin -> F, masculin -> M
    const mappedSexe = this.sexe === 'feminin' ? 'F' : 'M';

    this.signupService.updateData({
      dateNaissanceP: formattedDate,
      sexe: mappedSexe
    });

    console.log('Date is valid, navigating...');
    this.router.navigate(['/signup/password']);
  }

  onBirthdateChange() {
    this.birthdateError = false;
  }
}
