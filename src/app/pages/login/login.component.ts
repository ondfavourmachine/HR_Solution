import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { SharedService } from 'src/app/services/sharedServices';
import { PartialObserver } from 'rxjs';
import { AuthResponse } from 'src/app/models/generalModels';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  type: string = 'password';
  showOrHide: string = 'show';
  constructor(private router: Router, private titleCasePipe: TitleCasePipe, 
    private authservice: AuthService, private sharedService: SharedService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required], 
      token: ['']
    })
  }
  

  gotoDashboard(){
    this.router.navigate(['dashboard'])
  }

  handleExternalJobApplicantSignIn(response: AuthResponse){
    sessionStorage.setItem('emailOfLoggedInUser', response?.email as string);
    this.router.navigate(['external-applicant', `${response?.email}`]);
  }


  changeVisibility(){
    this.type == 'password' ? this.type = 'text' : this.type = 'password';
    this.type == 'password' ? this.showOrHide = 'show': this.showOrHide = 'hide'; 
  }


  loginIntoAD(event?: Event, button?: HTMLButtonElement){
    const btn = event ? event.target as HTMLButtonElement : button as HTMLButtonElement;
    const prevText = btn.textContent;
    this.sharedService.loading4button(btn, 'yes', 'Signing you in. Please wait...');
    const {value} = this.loginForm;
    const pObs: PartialObserver<AuthResponse> = {
      next: (val) => {
          if(!val.hasError){
                  const keyname = window.btoa(environment.cacher.jeton);
                  this.sharedService.successSnackBar(`Welcome ${this.titleCasePipe.transform((value.username as string).toString())}`, 'close');
                  this.sharedService.loading4button(btn, 'done', prevText as string);
                  this.sharedService.saveItemInCache(environment.cacher.jeton, val.token);
                  sessionStorage.setItem('loggedInUser', val.fullName);
                  sessionStorage.setItem('role', val.role);
                  sessionStorage.setItem('email', this.loginForm.get('username')?.value);
                  const {username }= this.loginForm.value;
                  const isAStaff = /@globusbank.com$/gi.test(username);
                  if(isAStaff){
                    this.gotoDashboard();
                    return;
                  }  
                  this.handleExternalJobApplicantSignIn(val);
                  return;
                }
                this.sharedService.loading4button(btn, 'done', prevText as string);
                this.sharedService.errorSnackBar(`${val.message}`, 'close');
      },
      error: (err) => {
        console.log(err);
      this.sharedService.loading4button(btn, 'done', prevText as string);
      this.sharedService.errorSnackBar(`Wrong Username or password.`, 'close');
      }
    }
    this.authservice.authenticateUser(value)
    .subscribe(pObs);
  }



  // async switchRole(event: a){
  //   await this.authservice.switchRoles();
  // }


  submitThisForm(form: FormGroup, event: Event){
    const {value} = form;
    for(let val in value){if(value[val].length < 1) return;}
    const button = (event.currentTarget as HTMLFormElement).querySelector('button') as HTMLButtonElement;
    this.loginIntoAD(undefined, button);
  }


  generateToken(event: Event){
    const btn = event.target as HTMLButtonElement;
    const prevText = btn.textContent;
    const {username, password} = this.loginForm.value
    this.sharedService.loading4button(btn, 'yes', 'Generating...')
   this.authservice.generateToken({username, password, token: ''})
   .subscribe({
    next: ({data}) => {
        this.loginForm.get('token')?.patchValue(data?.token);
        this.sharedService.successSnackBar('Token fetched successfully!');
        this.sharedService.loading4button(btn, 'done', prevText as string)
    },
    error: (error) => {
      console.error;
      this.sharedService.loading4button(btn, 'done', prevText as string)
    }
   })
  }

}
