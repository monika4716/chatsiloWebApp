import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RefreshTokenService } from '../../services/refresh-token.service';
import { ProfileService } from '../../services/profile.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { Message } from 'primeng/api';
import sweetAlert from 'sweetalert2';
import * as moment from 'moment';
import * as $ from 'jquery';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  /*   name:String;
    email:String;
    license:String; */
  linked_accounts: any = [];
  colsAccounts: any = [];
  data: FormGroup;
  submitted = false;
  firstLoad = true;
  msgs: Message[] = [];
  constructor(
    private refreshTokenService: RefreshTokenService,
    private profileService: ProfileService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
    this.data = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      license: ['', Validators.required],
    });
    this.colsAccounts = [
      { field: 'fb_account_id', header: 'Facebook ID' },
      { field: 'is_primary', header: 'Is Primary' },
    ];
  }

  get h() { return this.data.controls; }

  ngOnInit(): void {
    this.getprofile();
  }

  getprofile() {
    this.spinner.show();
    var token = localStorage.getItem("token");
    this.refreshTokenService.getAccountList(token).subscribe((response: any) => {
      if (response["status"] == 404) {
        this.spinner.hide();
        console.log(response);
      } else if (response["status"] == 200) {
        let userDetailstemp = response["UserDetails"];
        this.data.patchValue({
          "name": userDetailstemp.name,
          "email": userDetailstemp.email,
          "license": userDetailstemp.license_key
        })
        this.linked_accounts = userDetailstemp.linked_fb_accounts;
        this.spinner.hide();
        console.log(response);
      }
    }, (err) => {
      console.log(err);
    })
  }

  classForValidation(type) {
    if (this.firstLoad) {
      return
    }
    else if (this.submitted && this.h.name.errors && (type == 'name')) {
      return 'is-invalid';
    }
    else if (this.submitted && this.h.email.errors && (type == 'email')) {
      return 'is-invalid';
    }
    else if (this.submitted && this.h.license.errors && (type == 'license')) {
      return 'is-invalid';
    } else {
      return 'is-valid';
    }
  }

  deleteAccount(index, fb_account_id) {
    sweetAlert.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete it!'
    }).then((result) => {
      if (result.value) {
        var token = localStorage.getItem("token");
        var data = {
          "fb_account_id":fb_account_id
        }
        this.profileService.deleteAccount(token, data).subscribe((response: any) => {
          if (response["status"] == 404) {
            console.log(response);
          } else if (response["status"] == 200) {
            this.linked_accounts.splice(index, 1);
            sweetAlert.fire(
              'Deleted!',
              'This Account is deleted.',
              'success'
            )
            console.log(response);
          }
        }, (err) => {
          console.log(err);
        })
      }
    })
  }

  makeAccountPrimary(fb_account_id,index, id) {
    sweetAlert.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Make it Primary account!'
    }).then((result) => {
      if (result.value) {
        var token = localStorage.getItem("token");
        var data = {
          "fb_account_id":fb_account_id
        }
        this.profileService.makeAccountPrimary(token, data).subscribe((response: any) => {
          if (response["status"] == 404) {
            console.log(response);
          } else if (response["status"] == 200) {
            //this.getprofile();
            sweetAlert.fire(
              'Make Account Primary!',
              'This Account is Primary Now.',
              'success'
            ).then((result)=>{
              if(result){
                this.getprofile();
              }
            })
            console.log(response);
          }
        }, (err) => {
          console.log(err);
        })
      }
    })
  }

    submit() {
 /*      this.spinner.show();
      this.firstLoad = false;
      this.submitted = true;
      if (this.data.invalid) {
        this.spinner.hide();
        return;
      } 
      var token = localStorage.getItem("token")
      var data = {}
      this.profileService.updateProfile(token,data).subscribe((response: any) => {
        if (response.status == 200) {
          this.msgs = [];
          this.msgs.push({
            severity: 'success', summary: 'Success Message', detail: response.
              msg
          });
          setTimeout(() => {
            this.msgs = [];
          }, 3000)
          this.spinner.hide();
        } else if (response.status == 404) {
          this.msgs = [];
          this.msgs.push({
            severity: 'error', summary: 'Error Message', detail: response.
              msg
          });
          setTimeout(() => {
            this.msgs = [];
          }, 3000)
          this.spinner.hide();
        }
      }, (err) => {
        this.spinner.hide();
        console.log(err);
      })*/
    } 

}
