import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', canActivate: [authGuard], loadComponent: () => import('./features/home/home').then(m => m.Home) },
  { path: 'auth/login', loadComponent: () => import('./features/auth/login/login').then(m => m.Login) },
  { path: 'health', loadComponent: () => import('./features/health/health').then(m => m.Health) },
  { path: '**', loadComponent: () => import('./features/not-found/not-found').then(m => m.NotFound) }
];
