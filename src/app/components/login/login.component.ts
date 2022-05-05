import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import { OauthService } from '../../services/oauth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  firstLoad: boolean = true;
  credentials: FormGroup;
  submitted = false;
  error_Message;
  error = false;
  notCheck = true;
  token;
  verifying:boolean=false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private oauthService: OauthService
  ) {
    this.token = localStorage.getItem("token");
    this.credentials = this.formBuilder.group({
      KeepMeLoggedIn: '',
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
    })
  }

  ngOnInit(): void {
    if (this.token) {
      this.router.navigate(['dashboard']);
    } else {
      this.router.navigate(['login']);
      localStorage.removeItem("token");
    }
    if (document.cookie) {
      if (document.cookie.split(";")[0].split("=")[0] == "email" || document.cookie.split(";")[1].split("=")[1] == "password") {
        this.notCheck = false;
        this.credentials.value.email = document.cookie.split(";")[0].split("=")[1];
        this.credentials.value.password = document.cookie.split(";")[1].split("=")[1];
        this.loginUser();
      }
    }
  }

  get f() { return this.credentials.controls; }

  
  classEmailForValidation() {
    if (this.firstLoad) {
      return
    }
    else if (this.submitted && this.f.email.errors) {
      return 'is-invalid'
    } else {
      return 'is-valid'
    }
  }

  classPasswordForValidation() {
    if (this.firstLoad) {
      return
    }
    else if (this.submitted && this.f.password.errors) {
      return 'is-invalid'
    } else {
      return 'is-valid'
    }
  }

  loginUser() {
    this.spinner.show();
    this.verifying = true;
    this.submitted = true;
    this.firstLoad = false;
    if (this.notCheck == true) {
      if (this.credentials.invalid) {
        this.verifying = false;
        this.spinner.hide();
        return;
      }
    }
    this.oauthService.loginUser(this.credentials.value).subscribe((response: any) => {
      console.log(response)
      if (response["status"] == 400 || response["status"] == 404) {
        this.verifying = false;
        this.error = true;
        this.error_Message = response["message"];
        this.spinner.hide();
        console.log(response);
      } else if (response["status"] == 200) {
        if (this.credentials.value.KeepMeLoggedIn) {
          var now = new Date();
          var time = now.getTime();
          var expireTime = time + 7 * 24 * 60 * 60 * 1000;
          now.setTime(expireTime);
          document.cookie = "email=" + this.credentials.value.email + ';expires=' + now.toUTCString() + ';path=/';
          document.cookie = "password=" + this.credentials.value.password + ';expires=' + now.toUTCString() + ';path=/';
        }
        this.error = false;
        var token = response['token'];
        localStorage.setItem("token", token);
        var name = response['user'].name;
        localStorage.setItem("name", name);
        var email = response['user'].email;
        localStorage.setItem("email", email);
        this.router.navigate(['dashboard']);
        this.spinner.hide();
        console.log(response);
      }
    }, (err) => {
      console.log(err);
    })
  }
}
