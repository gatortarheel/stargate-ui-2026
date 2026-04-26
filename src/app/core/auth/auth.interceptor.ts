import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpHandler, HttpInterceptor, HttpRequest
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Auth } from './auth';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: Auth) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.auth.getAccessToken();
    if (!token) return next.handle(req);

    const cloned = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next.handle(cloned).pipe(
      catchError(err => {
        if (err.status === 401) {
          this.auth.logout('/auth/login?expired=true');
        }
        return throwError(() => err);
      })
    );
  }
}
