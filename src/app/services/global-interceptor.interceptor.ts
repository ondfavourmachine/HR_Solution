import { Injectable, OnDestroy } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable, Subscription, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { NavigationStart, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { MatDialog } from '@angular/material/dialog';

@Injectable()
export class GlobalInterceptorInterceptor implements HttpInterceptor, OnDestroy {
  destroySubs!: Subscription;
  urlInApp: string= '';
  constructor( private authService: AuthService, private router: Router, private matdialog: MatDialog) {
    // this.destroySubs = router.events.subscribe(
    //   val => {
    //     if(val instanceof NavigationStart){
    //       const {url} = val;
    //       console.log(url);
    //     }
    //   }
    // )
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let t = this.authService.retrieveItemStoredInCache(environment.cacher.jeton);
    const reqCopy = t != null ? request.clone({setHeaders : {Authorization: `Bearer ${t}`}}) : request.clone({});
    return next.handle(reqCopy)
    .pipe(
      tap({
        next: async (event) => {
          if (event instanceof HttpResponse && event.status == 401) {
            // if unauthenticated then, clear session and then return to first page
            await this.authService.clearSession();
            this.reRouteToLogin();
          }
          return event;
        },
        error: async (error) => {
          if(error.status === 401) {
            await this.authService.clearSession();
            this.reRouteToLogin();
          }
        }
      }));
  }


  reRouteToLogin(){
    this.router.navigateByUrl('/login');
    this.matdialog.closeAll();
  }
  ngOnDestroy(): void {
      this.destroySubs ? this.destroySubs.unsubscribe() : null;
  }
}
