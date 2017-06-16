import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { AuthGuard } from '../../guard/auth.guard';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  message:string;
  numberInput: number;
  messageClass;
  processing: boolean = false;
  previousUrl: string;

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private router: Router,
              private authGuard: AuthGuard) { 
    this.createForm();
  }

  ngOnInit() {
    if(this.authGuard.redirectUrl) {
      this.messageClass = 'alert alert-danger';
      this.message = 'You must be logged in to view that page';
      this.previousUrl = this.authGuard.redirectUrl;
      this.authGuard.redirectUrl = undefined;
    }
  }

  createForm() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.compose([
          Validators.required          
        ])],
      password: ['', Validators.compose([
          Validators.required          
      ])]
    });
  }

  enableForm() {
    this.loginForm.get('username').enable();
    this.loginForm.get('password').enable();    
  }

  disableForm() {
    this.loginForm.get('username').disable();
    this.loginForm.get('password').disable();
  }

  onLoginSubmit() {
    this.processing = true;
    this.disableForm();
    const user = {
      username: this.loginForm.get('username').value,
      password: this.loginForm.get('password').value
    };

    this.authService.login(user).subscribe(data => {
      if(!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
        this.processing = false;
        this.enableForm();
      } else {
        console.log(data);
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        this.authService.storeUserData(data.token, data.user);
        setTimeout(() => {
          if(this.previousUrl) {
            this.router.navigate([this.previousUrl]);
          } else {
            this.router.navigate(['/dashboard']);
          }          
        }, 2000);        
      }
    });
  }

}
