import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header-before-login',
  templateUrl: './header-before-login.component.html',
  styleUrls: ['./header-before-login.component.css']
})
export class HeaderBeforeLoginComponent implements OnInit {
  isEnabled;
  constructor() { 
  }

  ngOnInit(): void {
    var url = window.location.pathname.split("/");
    this.isEnabled = url[1] == "forgotPassword" ?true:false
  }

}
