import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const injector = inject(Injector);

  // Get token from session storage
  const storedUserStr = sessionStorage.getItem('dentis_user');
  let token = null;
  if (storedUserStr) {
    try {
      const user = JSON.parse(storedUserStr);
      token = user.token || user.sessionId; 
    } catch (e) {}
  }

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        const authService = injector.get(AuthService);
        authService.clearUser();
      }
      return throwError(() => error);
    })
  );
};
