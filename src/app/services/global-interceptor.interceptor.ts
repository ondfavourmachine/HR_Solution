import { Injectable, OnDestroy } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable, Subscription, tap } from 'rxjs';
import { SharedService } from './sharedServices';
import { environment } from 'src/environments/environment';
import { NavigationStart, Router } from '@angular/router';

@Injectable()
export class GlobalInterceptorInterceptor implements HttpInterceptor, OnDestroy {
  destroySubs!: Subscription;
  urlInApp: string= '';
  constructor(private sharedService: SharedService, private router: Router) {
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
    const t = this.sharedService.getItemFromCache(environment.cacher.jeton);
    const reqCopy = t != null ? request.clone({setHeaders : {Authorization: `Bearer ${t}`}}) : request.clone({});
    return next.handle(reqCopy)
    .pipe(
      tap({
        next: (event) => {
          if (event instanceof HttpResponse && event.status == 401) {
            // if unauthenticated then, clear session and then return to first page
            this.reRouteToLogin();
          }
          return event;
        },
        error: (error) => {
          if(error.status === 401) {
            this.reRouteToLogin();
          }
        }
      }));
  }


  reRouteToLogin(){
    this.router.navigateByUrl('/login');
    sessionStorage.clear();
  }
  ngOnDestroy(): void {
      this.destroySubs ? this.destroySubs.unsubscribe() : null;
  }
}
