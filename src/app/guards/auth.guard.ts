import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }
  
  // Optional: Check if session restoration is pending, but for now simple check
  router.navigate(['/login']);
  return false;
};

export const dentistGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const user = authService.getUser();
  if (user && user.role === 'DENTISTE') {
    return true;
  }
  
  router.navigate(['/dashboard']); // or some error page
  return false;
};

export const patientGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const user = authService.getUser();
  if (user && user.role === 'PATIENT') {
    return true;
  }
  
  router.navigate(['/dashboard']);
  return false;
};
