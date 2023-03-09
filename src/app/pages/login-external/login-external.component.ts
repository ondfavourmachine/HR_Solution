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
  selector: 'app-login-external',
  templateUrl: './login-external.component.html',
  styleUrls: ['./login-external.component.scss']
})
export class LoginExternalComponent implements OnInit {
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
    this.authservice.saveItemInCache(environment.cacher.ríomhphostnaplózva, response?.Email as string);
    this.router.navigate(['external-applicant', `${response?.Email}`]);
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
    const e = this.sharedService.EncryptData(JSON.stringify(value));
    const pObs: PartialObserver<{loginResult: string}> = {
      next: (val) => {
          let d : string | AuthResponse = this.sharedService.DecryptData(val.loginResult) as string;
          try {
            d = JSON.parse(d) as AuthResponse;
            if(!d.HasError){
              this.sharedService.successSnackBar(`Welcome ${this.titleCasePipe.transform((value.username as string).toString())}`, 'close');
              this.sharedService.loading4button(btn, 'done', prevText as string);
              this.authservice.saveItemInCache(environment.cacher.jeton, d.Token);
              this.authservice.saveItemInCache(environment.cacher.ríomhphost, this.loginForm.get('username')?.value);
              // sessionStorage.setItem('loggedInUser', d.fullName);
              // sessionStorage.setItem('role', d.role);
              this.authservice.saveItemInCache(environment.cacher.ruolo, d.Role);
              this.authservice.saveItemInCache(environment.cacher.naplózva, d.FullName);
              // sessionStorage.setItem('email', this.loginForm.get('username')?.value);
              sessionStorage.setItem('isExternal', 'yes');
              const { username }= this.loginForm.value;
              const isAStaff = /@globusbank.com$/gi.test(username);
              if(isAStaff){
                this.gotoDashboard();
                return;
              }  
              this.handleExternalJobApplicantSignIn(d);
              return;
            }
            this.sharedService.loading4button(btn, 'done', prevText as string);
            this.sharedService.errorSnackBar(`${d.Message}`, 'close');
          } catch (error) {
            this.sharedService.loading4button(btn, 'done', prevText as string);
            this.sharedService.errorSnackBar(`Unable to login at this moment`, 'close');
          }
          
      },
      error: (err) => {
      console.log(err);
      this.sharedService.loading4button(btn, 'done', prevText as string);
      this.sharedService.errorSnackBar(`Wrong Username or password.`, 'close');
      }
    }
    this.authservice.authenticateUser({LoginText: e})
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
