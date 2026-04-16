import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: '',
    loadComponent: () => import('./layouts/auth-layout/auth-layout.component').then(m => m.AuthLayoutComponent),
    children: [
      { path: 'login',  loadComponent: () => import('./features/auth/login/login').then(m => m.LoginComponent) },
      { path: 'signup', loadComponent: () => import('./features/auth/signup/signup').then(m => m.SignupComponent) }
    ]
  },
  {
    path: '',
    loadComponent: () => import('./layouts/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      { path: 'dashboard',           loadComponent: () => import('./features/dashboard/dashboard').then(m => m.DashboardComponent) },
      { path: 'finance/movements',   loadComponent: () => import('./features/finance/movements/movements').then(m => m.MovementsComponent) },
      { path: 'finance/history',     loadComponent: () => import('./features/finance/history/history').then(m => m.HistoryComponent) },
      { path: 'finance/balance',     loadComponent: () => import('./features/finance/balance/balance').then(m => m.BalanceComponent) },
      { path: 'finance/banks',       loadComponent: () => import('./features/finance/banks/banks').then(m => m.BanksComponent) },
      { path: 'finance/banks/:id',   loadComponent: () => import('./features/finance/banks/bank-detail/bank-detail').then(m => m.BankDetailComponent) },
      { path: 'management/projects', loadComponent: () => import('./features/management/projects/projects').then(m => m.ProjectsComponent) },
      { path: 'management/projects/:id',loadComponent: () => import('./features/management/projects/project-detail/project-detail').then(m => m.ProjectDetailComponent) },
      { path: 'management/clients',  loadComponent: () => import('./features/management/clients/clients').then(m => m.ClientsComponent) },
      { path: 'management/products', loadComponent: () => import('./features/management/products/products').then(m => m.ProductsComponent) },
      { path: 'profile',             loadComponent: () => import('./features/profile/profile').then(m => m.ProfileComponent) },
    ]
  },
  { path: '**', redirectTo: 'login' }
];