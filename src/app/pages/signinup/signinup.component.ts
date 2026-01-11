import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-signinup',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './signinup.component.html',
  styleUrls: ['./signinup.component.scss']
})
export class SigninupComponent {
  showLoginForm = false;

  constructor(private router: Router) {}

  onBackClick() {
    this.router.navigate(['/login']);
  }

  onSignupClick() {
    this.router.navigate(['/signup']);
  }

  onConnectClick() {
    this.router.navigate(['/signin/signinemail']);
  }
}
