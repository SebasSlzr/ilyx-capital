import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn()) return true;

  // Si nunca se registró → signup, si ya tiene cuenta → login
  if (auth.hasRegistered()) {
    router.navigate(['/login']);
  } else {
    router.navigate(['/signup']);
  }
  return false;
};