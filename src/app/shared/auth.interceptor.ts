import {Injectable} from '@angular/core'
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from 'rxjs';
import { AuthService } from "../admin/shared/services/auth.service";
import {Router} from '@angular/router'
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(
        private ahut: AuthService,
        private router: Router
    ) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.ahut.isAuthenticate()) {
            req = req.clone({
                setParams: {
                    auth: this.ahut.token
                }
            })
        }
        return next.handle(req)
        .pipe(
            tap(() => {
                console.log('Intercept');
                
            }),
            catchError((err: HttpErrorResponse) => {
                if (err.status === 401) {
                    this.ahut.logout
                    this.router.navigate(['/admin', 'login'], {
                        queryParams: {
                            authFailed: true
                        }
                    })
                }
                return throwError(err)
            })
        )
    }
}