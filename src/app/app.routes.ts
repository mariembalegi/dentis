import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

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
    path: 'publication',
    loadComponent: () => import('./pages/publication/publication.component').then(m => m.PublicationComponent)
  },
  {
    path: 'publication/publication/:id',
    loadComponent: () => import('./pages/publication/publication.component').then(m => m.PublicationComponent)
  },
  {
    path: 'publication/:category',
    loadComponent: () => import('./pages/publication-category/publication-category.component').then(m => m.PublicationCategoryComponent)
  },
  {
    path: 'publication-category',
    loadComponent: () => import('./pages/publication-category/publication-category.component').then(m => m.PublicationCategoryComponent)
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
        loadComponent: () => import('./pages/signup-role/signup-role.component').then(m => m.SignupRoleComponent)
      },
      {
        path: 'email',
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
        path: 'details',
        loadComponent: () => import('./pages/signup-dentist-details/signup-dentist-details.component').then(m => m.SignupDentistDetailsComponent)
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
    path: 'dentist-informations/:id',
    loadComponent: () => import('./pages/dentist-informations/dentist-informations.component').then(m => m.DentistInformationsComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    children: [
        {
            path: '',
            loadComponent: () => import('./pages/booking/booking.component').then(m => m.BookingComponent)
        },
        {
            path: 'admin',
            loadComponent: () => import('./pages/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
        },
        {
            path: 'booking',
             loadComponent: () => import('./pages/booking/booking.component').then(m => m.BookingComponent)
        },
        {             path: 'users-management',
             loadComponent: () => import('./pages/users-management/users-management.component').then(m => m.UsersManagementComponent)
        },
        {          path: 'services',
          loadComponent: () => import('./pages/dentist-services/dentist-services.component').then(m => m.DentistServicesComponent)
        },
        {
            path: 'dentist/:id',
            loadComponent: () => import('./pages/dentist-informations/dentist-informations.component').then(m => m.DentistInformationsComponent)
        },
        {
          path: 'service-categories-booking',
          loadComponent: () => import('./pages/service-categories-booking/service-categories-booking.component').then(m => m.ServiceCategoriesBookingComponent)
        },
        {
          path: 'date-booking',
          loadComponent: () => import('./pages/date-booking/date-booking.component').then(m => m.DateBookingComponent)
        },
        {
          path: 'booking-confirmation',
          loadComponent: () => import('./pages/booking-confirmation/booking-confirmation.component').then(m => m.BookingConfirmationComponent)
        },
        {
          path: 'profile',
          loadComponent: () => import('./pages/patient-profile/patient-profile.component').then(m => m.PatientProfileComponent)
        },
        {
          path: 'dentist-profile',
          loadComponent: () => import('./pages/dentist-profile/dentist-profile.component').then(m => m.DentistProfileComponent)
        },
        {
          path: 'profile-details',
          loadComponent: () => import('./pages/patient-profile-details/patient-profile-details.component').then(m => m.PatientProfileDetailsComponent)
        }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
