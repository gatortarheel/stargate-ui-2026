import { inject } from '@angular/core';
import { Router, RouterStateSnapshot } from '@angular/router';
import { Auth } from './auth';

export const authGuard = (_route: unknown, state: RouterStateSnapshot) => {
  const auth = inject(Auth);
  const router = inject(Router);

  if (auth.getAccessToken()) {
    return true;
  }
  return router.createUrlTree(['/auth/login'], { queryParams: { returnUrl: state.url } });
};
