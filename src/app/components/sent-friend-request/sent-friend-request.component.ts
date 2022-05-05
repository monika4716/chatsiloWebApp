import { Meta } from '@angular/platform-browser';
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { SentFriendRequestService } from "../../services/sent-friend-request.service";
import { NgxSpinnerService } from "ngx-spinner";
import { Message } from "primeng/api";
import sweetAlert from "sweetalert2";

@Component({
  selector: "app-sent-friend-request",
  templateUrl: "./sent-friend-request.component.html",
  styleUrls: ["./sent-friend-request.component.css"],
})
export class SentFriendRequestComponent implements OnInit {
  sentFriendRequests: any = [];
  emptySentFriendRequests: boolean = false;
  show_sentRequest: boolean = false;
  totalRecords: any;
  loading: boolean;
  offset: any = 0;
  limit: any;
  selectedStatus: any;
  statusOptions: any;
  status: any = 2;
  sentFriendRequestOptions: any;
  selectedSentFriendfilter: any;
  getSentFriendfilter: any = "";
  search: any = "";
  rowsPerPage: any = 10;
  first: any = 0;
  msgs: Message[] = [];
  selectedsentFriendRequests: any = [];
  deleteSelectedIds: any = [];

  constructor(
    private sentFriendRequestService: SentFriendRequestService,
    private spinner: NgxSpinnerService,
    private meta: Meta
  ) {}

  ngOnInit(): void {
    // this.sentFriendRequestList();

    this.meta.addTags([
      { name: 'description', content: 'This is an article about Angular Meta service' },
      { name: 'keywords', content: 'angular, javascript, typescript, meta, seo' }  
    ]);  

    this.statusOptions = [
      { name: "Any status", value: 2 },
      { name: "Accepted only", value: 1 },
      { name: "Not accepted only", value: 0 },
    ];

    this.sentFriendRequestOptions = [
      { name: "All sent friend requests", value: "" },
      { name: "Older than 2 weeks", value: "14 DAY" },
      { name: "Older than 1 month", value: "1 month" },
      { name: "Older than 2 month", value: "2 month" },
      { name: "Older than 6 month", value: "6 month" },
      { name: "One year", value: "1 YEAR" },
    ];
  }

  /*-----------------------Get sent friend request list-----------------------*/
  sentFriendRequestList() {
    let params = {
      offset: this.offset,
      limit: this.rowsPerPage,
      search: this.search,
      status: this.status,
      getSentFriendfilter: this.getSentFriendfilter,
    };

    this.spinner.show("sentRequestList");
    var token = localStorage.getItem("token");
    var fb_account = localStorage.getItem("FbAccount");

    this.sentFriendRequestService
      .getSentFriendRequest(params, token, fb_account)
      .subscribe(
        (response: any) => {
          //console.log(response);
          if (response.status == 200) {
            this.sentFriendRequests = response.sentFriendRequests;
            this.emptySentFriendRequests =
              this.sentFriendRequests.length > 0 ? false : true;

            if (response.count.total != -1) {
              this.totalRecords = response.count.total;
            }

            this.show_sentRequest =
              this.sentFriendRequests.length > 0 ? false : true;

            this.spinner.hide("sentRequestList");
          } else if (response.status == 404) {
            this.spinner.hide("sentRequestList");
          }
        },
        (err) => {
          this.spinner.hide("tagsList");
        }
      );
  }

  /*-----------------------Pagination & Lazy Loding-----------------------*/

  loadCustomers(event: any) {
    this.offset = event.first;
    this.search = event.globalFilter;
    this.sentFriendRequestList();
  }

  /*-----------------------Status filter -----------------------*/

  statusOnChange($event: any) {
    this.status = this.selectedStatus.value;
    this.sentFriendRequestList();
  }

  /*-----------------------filter older data list -----------------------*/

  sentFriendRequestOnChange($event: any) {
    console.log(this.selectedSentFriendfilter);
    this.getSentFriendfilter = this.selectedSentFriendfilter.value;
    this.sentFriendRequestList();
  }

  /*----------------------------Refresh Table---------------------------*/

  reset() {
    this.first = 0;
    this.offset = 0;
    this.sentFriendRequestList();
  }

  /*-----------------------Delete friend request one by one-----------------------*/
  deleteFriendRequest(id) {
    console.log(id);
    sweetAlert
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Delete it!",
      })
      .then((result) => {
        if (result.value) {
          this.spinner.show();
          var token = localStorage.getItem("token");
          this.sentFriendRequestService
            .deleteSentFriendRequest(token, id)
            .subscribe((response: any) => {
              if (response.status == 200) {
                sweetAlert
                  .fire(
                    "Deleted!",
                    "Sent friend request is deleted.",
                    "success"
                  )
                  .then((result) => {
                    if (result) {
                      this.offset = 0;
                      this.first = 0;
                      this.sentFriendRequestList();
                    }
                  });
              }
            });
        }
      });
  }

  /*-----------------------Select multiple sent request-----------------------*/
  onSelectionChange(value = []) {
    let selectedIds = [];
    if (value) {
      for (let i = 0; i < value.length; i++) {
        let id = value[i].id;
        selectedIds.push(id);
      }
    }
    this.deleteSelectedIds = selectedIds;
    console.log(this.deleteSelectedIds);
  }

  /*-----------------------Delete multiple sent request-----------------------*/

  deleteMultipleRequest() {
    if (
      this.deleteSelectedIds != undefined &&
      this.deleteSelectedIds.length > 0
    ) {
      sweetAlert
        .fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, Delete it!",
        })
        .then((result) => {
          console.log(result);

          if (result.value) {
            this.spinner.show();
            var token = localStorage.getItem("token");
            let ids = this.deleteSelectedIds;
            console.log(ids);
            this.sentFriendRequestService
              .deleteMultipleSentFriendRequest(token, ids)
              .subscribe((response: any) => {
                if (response.status == 200) {
                  sweetAlert
                    .fire(
                      "Deleted!",
                      "Sent friend request is deleted.",
                      "success"
                    )
                    .then((result) => {
                      if (result) {
                        this.offset = 0;
                        this.first = 0;
                        this.sentFriendRequestList();
                      }
                    });
                }
              });
          }
        });
    } else {
      console.log("else");
      this.msgs = [];
      this.msgs.push({
        severity: "error",
        summary: "Error Message",
        detail: "Please select request",
      });
      setTimeout(() => {
        this.msgs = [];
      }, 3000);
    }
  }

  /*------------------------On change linked account------------------------ */

  updateLinkedFbSelection($event) {
    this.reset();
  }

  /*-----------------------------end----------------------------------------*/
}
