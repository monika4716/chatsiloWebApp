import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RefreshTokenService } from '../../services/refresh-token.service';
import { ContactsComponent } from '../../components/contacts/contacts.component';
import { TagsComponent } from '../../components/tags/tags.component';
import { NgxSpinnerService } from "ngx-spinner";
import { CookieService } from 'ngx-cookie-service';
import { MenuItem } from 'primeng/api';
import {SelectItem} from 'primeng/api';
import * as $ from 'jquery';


@Component({
  selector: 'app-header-after-login',
  templateUrl: './header-after-login.component.html',
  styleUrls: ['./header-after-login.component.css']
})
export class HeaderAfterLoginComponent implements OnInit {

  token;
  name;
  accountLists: SelectItem[];
  currentURL: String;
  account_dropDown: boolean = false;
  items: MenuItem[];

  constructor(
    private spinner: NgxSpinnerService,
    private router: Router,
    private cookie: CookieService,
    private activatedRoute: ActivatedRoute,
    private contactsComponent: ContactsComponent,
    private tagsComponent: TagsComponent,
    private refreshTokenService: RefreshTokenService
  ) {
    this.token = localStorage.getItem("token");
    this.name = localStorage.getItem("name");
    /*     this.activatedRoute.queryParams.subscribe(params => {
        }); */
    this.items = [
      { label: 'Profile', icon: 'pi pi-fw pi-user-edit', routerLink: "/profile", id: "profile", styleClass: "active" },
      { label: 'Logout', icon: 'pi pi-fw pi-sign-out', routerLink: "", command: (event: any) => { this.logout() }, id: "logout" }
    ]
    this.accountLists = [
      { label: "ALL", value: "all" }
    ];
  }

  ngOnInit(): void {
    if (this.router.url == '/profile') {
      $("li#profile").addClass("link");
    }
    var contact_url: boolean;
    contact_url = this.router.url.includes('/contacts');
    if (contact_url) {
      this.account_dropDown = true;
      this.currentURL = "contacts";
      this.getAccountList()
    }
    contact_url = this.router.url.includes('/tags');
    if (contact_url) {
      this.account_dropDown = true;
      this.currentURL = "tags";
      this.getAccountList()
    }
    this.verifyUserToken();
    setInterval(() => {
      this.verifyUserToken();
    }, 7 * 60000);
  }

  verifyUserToken() {
    var tokenTemp = localStorage.getItem("token");
    console.log("before " + tokenTemp);
    this.refreshTokenService.refreshToken(tokenTemp).subscribe((response: any) => {
      if (response["status"] == 404) {
        localStorage.removeItem("token");
        this.router.navigate(['login']);
        console.log(response);
      } else if (response["status"] == 200) {
        var token = response["token"];
        console.log("after " + token);
        localStorage.removeItem("token");
        localStorage.setItem("token", token);
        console.log(response);
      }
    }, (err) => {
      console.log(err);
    })
  }

  getAccountList() {
    var token = localStorage.getItem("token");
    this.refreshTokenService.getAccountList(token).subscribe((response: any) => {
      if (response["status"] == 404) {
        console.log(response);
      } else if (response["status"] == 200) {
        var accountListTemp = response["UserDetails"].linked_fb_accounts;
        for (let i = 0; i < accountListTemp.length; i++) {
          this.accountLists.push({ label: accountListTemp[i].fb_account_id, value: accountListTemp[i].fb_account_id });
        }
        console.log(response);
      }
    }, (err) => {
      console.log(err);
    })
  }

  logout() {
    this.cookie.deleteAll();
    window.localStorage.clear();
    this.router.navigate(['login']);
  }

  onLiChange(e) {
    var li_name = e ? e.target.textContent.trim() : "";
    $("li").removeClass("link");
    if (li_name == "Pofile") {
      $(".active").addClass("link");
    }
    /*else if (e.target.text == "Help & Doc") {
      $("li#helpAndDoc").addClass("link");
    } */
  }

  onAccountChange(event) {
    let value = event.value;
    var querryParam = { queryParams: { fb_id: value } }
    if (value && this.currentURL == "tags") {
      this.router.navigate(['/tags'], querryParam);
      return this.tagsComponent.filterTagedUserList(value);
    }else if (value && this.currentURL == "contacts") {
      this.router.navigate(['/contacts'], querryParam);
      return this.contactsComponent.filterContactList(value);
    }
    else {
    }
  }

}
