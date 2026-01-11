import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/signinup/signinup.component').then(m => m.SigninupComponent)
  },
  {
    path: 'signin',
    loadComponent: () => import('./pages/signin/signin.component').then(m => m.SigninComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/signinemail/signinemail.component').then(m => m.SigninemailComponent)
      },
      {
        path: 'signinemail',
        loadComponent: () => import('./pages/signinemail/signinemail.component').then(m => m.SigninemailComponent)
      },
      {
        path: 'password',
        loadComponent: () => import('./pages/signinpassword/signinpassword.component').then(m => m.SigninpasswordComponent)
      }
    ]
  },
  {
    path: 'signup',
    loadComponent: () => import('./pages/signup/signup.component').then(m => m.SignupComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/signupemail/signupemail.component').then(m => m.SignupemailComponent)
      },
      {
        path: 'name',
        loadComponent: () => import('./pages/signupname/signupname.component').then(m => m.SignupnameComponent)
      },
      {
        path: 'birthdate',
        loadComponent: () => import('./pages/signupbirthdate/signupbirthdate.component').then(m => m.SignupbirthdateComponent)
      },
      {
        path: 'password',
        loadComponent: () => import('./pages/signuppassword/signuppassword.component').then(m => m.SignuppasswordComponent)
      },
      {
        path: 'tel',
        loadComponent: () => import('./pages/signuptel/signuptel.component').then(m => m.SignuptelComponent)
      }
    ]
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
