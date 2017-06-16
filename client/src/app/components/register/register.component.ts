import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  messageClass;
  message;
  processing: boolean = false;
  emailValid: boolean;
  emailMessage: string;
  usernameValid: boolean;
  usernameMessage: string;

  constructor(private formBuilder: FormBuilder, 
              private authService: AuthService,
              private router: Router) { 
    this.createForm();
  }

  ngOnInit() {
  }

  createForm() {
    this.registerForm = this.formBuilder.group({
      email: ['', Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(30),
        this.validateEmail
      ])],
      username: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
        this.validateUsername
      ])],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(35),
        this.validatePassword
      ])],
      confirm: ['', Validators.required]
    },  { validator: this.matchingPasswords('password', 'confirm') });
  }

  disableForm() {
    this.registerForm.get('username').disable();
    this.registerForm.get('email').disable();
    this.registerForm.get('password').disable();
    this.registerForm.get('confirm').disable();
  }

  enableForm() {
    this.registerForm.get('username').enable();
    this.registerForm.get('email').enable();
    this.registerForm.get('password').enable();
    this.registerForm.get('confirm').enable();
  }

  onRegisterSubmit() {
    this.processing = true;
    this.disableForm();
    const user = {
      username: this.registerForm.get('username').value,
      email: this.registerForm.get('email').value,
      password: this.registerForm.get('password').value
    };

    return this.authService.registerUser(user)
               .subscribe(data => {
                 if(!data.success) {
                    this.messageClass = 'alert alert-danger';
                    this.message = data.message;
                    this.processing = false;
                    this.enableForm();
                 } else {
                    this.messageClass = 'alert alert-success';
                    this.message = data.message;
                    setTimeout(() => {
                      this.router.navigate(['/login']);
                    }, 2000);
                    
                 }
               });
  }

  checkEmail() {
    return this.authService.checkEmail(this.registerForm.get('email').value)
               .subscribe(data => {
                 if(!data.success) {
                    this.emailValid = false;
                    this.emailMessage = data.message;
                 } else {
                    this.emailValid = true;
                    this.emailMessage = data.message;
                 }  
               });
  }

  checkUsername() {
    return this.authService.checkUsername(this.registerForm.get('username').value)
                           .subscribe(data => {
                              if(!data.success) {
                                this.usernameValid = false;
                                this.usernameMessage = data.message;
                              } else {
                                this.usernameValid = true;
                                this.usernameMessage = data.message;
                              } 
                           });
  }

  validateEmail(control) {
    const emailRegex = new RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);
         if(emailRegex.test(control.value)) {
            return null;
         } else {
           return { 'validateEmail': true }
         }
  }

  validateUsername(control) {
    const nameRegex = new RegExp(/^[a-zA-Z ]{2,30}$/);
    if(nameRegex.test(control.value)) {
      return null;
    } else {
      return { 'validateUsername': true }
    }
  }

  validatePassword(control) {
    const passwordRegex = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
    if(passwordRegex.test(control.value)) {
      return null;
    } else {
      return { 'validatePassword': true }
    }
  }

  matchingPasswords(password, confirm) {
    return (group: FormGroup) => {
      if(group.controls[password].value === group.controls[confirm].value) {
        return null;
      } else {
        return { 'matchingPasswords': true }
      }
    }
  }

}
