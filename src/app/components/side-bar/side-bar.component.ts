import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as $ from 'jquery';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
    var pathname = this.router.url.split("?")[0];
    if (pathname == "/tags") {
      $("li#tags").addClass("active");
    } else if (pathname == "/templates") {
      $("li#template").addClass("active");
    } else if (pathname == "/contacts") {
      $("li#contacts").addClass("active");
    }
  }

  onChange(e) {
    if (e.target.text) {
      $("li").removeClass("active");
      if (e.target.text.trim() == "Templates") {
        $("li#template").addClass("active");
      } else if (e.target.text.trim() == "Tags") {
        $("li#tags").addClass("active");
      } else if (e.target.text.trim() == "Contact") {
        $("li#contacts").addClass("active");
      }
    }
  }
}
