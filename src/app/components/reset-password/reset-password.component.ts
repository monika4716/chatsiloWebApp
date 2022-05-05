import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OauthService } from '../../services/oauth.service';
import { MustMatch } from '../../services/match-password.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  credential: FormGroup;
  submitted = false;
  change;
  message;
  verifying:boolean=false;
  passwordReset:any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private oauthService: OauthService
  ) {
    this.credential = this.formBuilder.group({
      passwordToken:'',
      password: ['', [Validators.required, Validators.minLength(5)]],
      confirmPassword: ['', Validators.required]
    },{
      validator: MustMatch('password', 'confirmPassword')
    })
  }

  get f() {
    if(this.credential.controls.password.errors){
      this.change = false
    }
    return this.credential.controls; 
  }

  ngOnInit(): void {
    this.passwordReset = false;
  }

  onsubmit(){
    this.verifying = true;
    this.submitted = true;
    if (this.credential.invalid) {
      this.verifying = false;
        return;
    }
		this.activatedRoute.params.subscribe(params => {
      this.credential.value.passwordToken =  params['key'].substr(1);
		});
     this.oauthService.resetpassword(this.credential.value).subscribe((response: any) => {
      if (response["status"] == 404) {
        this.verifying = false;
        this.message = response["message"];
        this.change = false;
        console.log(response);
      } else if (response["status"] == 200) {
        this.verifying = false;
        this.message = response["message"];
        this.change = true;
        this.passwordReset = true;
        localStorage.setItem("passwordReset", this.passwordReset);
        console.log(response);
      }
    }, (err) => {
      console.log(err);
    }) 
  }
}
