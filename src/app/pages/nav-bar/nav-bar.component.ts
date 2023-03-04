import { Component, OnDestroy, OnInit } from '@angular/core';
import { Navigation, NavigationEnd, Router, RouterEvent } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserIdleService } from 'angular-user-idle';
import { filter, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { IdlePromptComponentComponent } from 'src/app/shared/idle-prompt-component/idle-prompt-component.component';
import { environment } from 'src/environments/environment';
// import { SharedService } from 'src/app/services/sharedServices';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit, OnDestroy {
 loggedInUser: string = '';
 roleOfLoggedInUser: string = '';
 destroySub: Subscription[]= [];
 urlOfCurrentRoute: string = '';
  constructor(private router: Router, private dialog: MatDialog, private userIdle: UserIdleService, private authService: AuthService) { 
    router.events
    .pipe(filter((elem: any): elem is NavigationEnd => elem instanceof NavigationEnd))
    .subscribe(
      {
        next: val => this.urlOfCurrentRoute = val.urlAfterRedirects 
      }
    )
  }

  ngOnInit(): void {
    this.loggedInUser = this.authService.retrieveItemStoredInCache(environment.cacher.naplózva) as string;
    this.roleOfLoggedInUser = this.authService.retrieveItemStoredInCache(environment.cacher.ruolo) as string;
    this.userIdle.startWatching();
    
    // Start watching when user idle is starting.
    this.destroySub[0] = this.userIdle.onTimerStart()
      .subscribe(count => 
         {
          console.log(count);
           const idlePrompt = document.querySelector('.idle_prompt') as HTMLElement;
           const moduleToCheckFor = /dashboard/gi;
           const split = this.urlOfCurrentRoute.split('/');
           const isInsideDashboardModule = split.some(elem => moduleToCheckFor.test(elem));
          if(count > 50 && !idlePrompt && isInsideDashboardModule){
            this.openPrompt();
          }
         }
        );
    
    // Start watch when time is up.
    this.destroySub[1]=this.userIdle.onTimeout().subscribe(() => {
     this.logout();
     this.dialog.closeAll();
    });

  }

  openPrompt(){
    const openDialog = this.dialog.open(IdlePromptComponentComponent, {
      width: '33vw',
      height: 'auto',
      disableClose: false,
      data:  {},
      panelClass: 'idle_prompt',
      position: {
        top: '5em',
      }});
    openDialog.afterClosed().subscribe(
    value => {
      if(value == 'logout'){
        this.logout();
      }else{
        this.restart();
      }
    })
  }

  async logout(){
   await this.authService.clearSession();
   this.router.navigate(['/login']);
  }

  stop() {
    this.userIdle.stopTimer();
  }

  stopWatching() {
    this.userIdle.stopWatching();
  }

  startWatching() {
    this.userIdle.startWatching();
  }

  restart() {
    this.userIdle.resetTimer();
  }

  ngOnDestroy(): void {
    if(this.destroySub) this.destroySub.forEach(elem => elem.unsubscribe());
  }

}
