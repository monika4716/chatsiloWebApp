import { Component, OnInit } from '@angular/core';
import {SelectItem} from 'primeng/api';
import { RefreshTokenService } from '../../services/refresh-token.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedService } from '../../services/shared.service';
import { CookieService } from 'ngx-cookie-service';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @Output() messageEvent = new EventEmitter();
  accountLists: SelectItem[];
  name:string;
  email:string;
  selectedAccount:string = localStorage.getItem('FbAccount');
  plan_id:any;
  user_id:string;
  plan_url:string;
  btnLabel:string = "Upgrade";
  showUpgradebtn:boolean = true;
  url:any;
  dynamicBtn:any;
  dynamicRouterlink:any;

  constructor(
    private refreshTokenService: RefreshTokenService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private SharedService: SharedService,
    private cookie: CookieService,
  ) { 

    
    this.name = localStorage.getItem("name");
    this.email = localStorage.getItem("email");
    //this.selectedAccount = localStorage.getItem('FbAccount');

    //
  }

  ngOnInit(): void {
    this.url = this.router.url;

    if(this.url == "/sent-friend-request"){
      this.dynamicBtn = "Dashboard";
      this.dynamicRouterlink = "/dashboard";
    }else{
      this.dynamicBtn = "Sent Friend Request";
      this.dynamicRouterlink = "/sent-friend-request";
    }
    
    this.accountLists = [];
    this.getAccountList();

    this.verifyUserToken();
    setInterval(() => {
      this.verifyUserToken();
    }, 7 * 60000);
  }

  verifyUserToken() {
    var tokenTemp = localStorage.getItem("token");
    // console.log("before " + tokenTemp);
    this.refreshTokenService.refreshToken(tokenTemp).subscribe((response: any) => {
      if (response["status"] == 404) {
        localStorage.removeItem("token");
        this.router.navigate(['login']);
        // console.log(response);
      } else if (response["status"] == 200) {
        var token = response["token"];
        // console.log("after " + token);
        localStorage.removeItem("token");
        localStorage.setItem("token", token);
        // console.log(response);
      }
    }, (err) => {
      console.log(err);
    })
  }

  getAccountList() {
    var token = localStorage.getItem("token");
    this.refreshTokenService.getAccountList(token).subscribe((response: any) => {
      if (response["status"] == 404) {
        // console.log(response);
      } else if (response["status"] == 200) {
        this.user_id = response["UserDetails"].id;
        this.plan_id = response["UserDetails"]['plan']['id'];
        this.plan_url = "https://chatsilo.com/plans.php?id="+this.user_id;
        if(this.plan_id < 5){
          this.btnLabel = "Upgrade";
        }else if(this.plan_id <= 1){
          this.btnLabel = "Downgrade";
        }else if(this.plan_id == 5){
          this.showUpgradebtn = false;
        }
        var accountListTemp = response["UserDetails"].linked_fb_accounts;     
        if(this.selectedAccount == "" || this.selectedAccount == null){
          let index = accountListTemp.findIndex(x => x.is_primary == 1);
          this.selectedAccount = accountListTemp[index].fb_account_id;
          localStorage.setItem('FbAccount',this.selectedAccount);
        }
        for (let i = 0; i < accountListTemp.length; i++) {
          this.accountLists.push({label: accountListTemp[i].fb_account_id, value: accountListTemp[i].fb_account_id});
        }
        
        
        // shivam.bhandari.501598

        // let index = accountListTemp.findIndex(x => x.is_primary == 1);
        // console.log(accountListTemp[index].fb_account_id)
        // console.log(this.accountLists)
        // localStorage.setItem('FbAccount',accountListTemp[index].fb_account_id)
        // this.selectedAccount = accountListTemp[index].fb_account_id;
        // this.SharedService.selectedFbAccount.subscribe(selectedFbAccountValue => {
        //   if(selectedFbAccountValue == null){
        //     let index = accountListTemp.findIndex(x => x.is_primary == 1);
        //     // console.log("updated to "+accountListTemp[index].fb_account_id)
        //     this.SharedService.updateSelectedFbAccount(accountListTemp[index].fb_account_id);
        //     this.selectedAccount = accountListTemp[index].fb_account_id;
        //     // console.log(this.selectedAccount)
        //   }else{
        //     this.selectedAccount = selectedFbAccountValue;
        //     // console.log(this.selectedAccount)
        //   }
        //   // console.log("already having "+selectedFbAccountValue)
        // })
        
        // console.log(response);
      }
    }, (err) => {
      console.log(err);
    })
  }


  onAccountChange(event) {
    // console.log(event.target.value)
    localStorage.setItem('FbAccount',event.target.value)
    this.SharedService.updateSelectedFbAccount(event.target.value);

    if(this.url == "/sent-friend-request"){
      this.messageEvent.emit('Linked account change')
    }




    // this.SharedService.selectedFbAccount.subscribe(selectedFbAccountValue => {
        // if(selectedFbAccountValue == null){
          // let index = accountListTemp.findIndex(x => x.is_primary == 1);
          // // console.log("updated to "+accountListTemp[index].fb_account_id)
          // this.SharedService.updateSelectedFbAccount(accountListTemp[index].fb_account_id);
          // this.selectedAccount = accountListTemp[index].fb_account_id;
          // // console.log(this.selectedAccount)
        // }else{
          // this.selectedAccount = selectedFbAccountValue;
          // console.log(this.selectedAccount)
        // }
        // console.log("already having "+selectedFbAccountValue)
    // })
    // window.location.reload();
    // var querryParam = { queryParams: { fb_id: event.target.value } }
    // this.router.navigate(['/dashboard'], querryParam);
    // let value = event.value;
    // var querryParam = { queryParams: { fb_id: value } }
    // if (value && this.currentURL == "tags") {
    //   this.router.navigate(['/tags'], querryParam);
    //   return this.tagsComponent.filterTagedUserList(value);
    // }else if (value && this.currentURL == "contacts") {
    //   this.router.navigate(['/contacts'], querryParam);
    //   return this.contactsComponent.filterContactList(value);
    // }
    // else {
    // }
  }

  logout() {
    this.cookie.deleteAll();
    window.localStorage.clear();
    this.router.navigate(['login']);
  }

}
