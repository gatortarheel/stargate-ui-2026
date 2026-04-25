import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from './auth';

export const authGuard = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  if (auth.getAccessToken()) {
    return true;
  }
  return router.createUrlTree(['/auth/login']);
};
