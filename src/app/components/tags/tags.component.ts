import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TagsService } from '../../services/tags.service';
import { CSVImportService } from '../../services/csv-import.service';
import { ContactService } from '../../services/contact.service';
import { NgxSpinnerService } from "ngx-spinner";
import { Message } from 'primeng/api';
import { Papa } from 'ngx-papaparse';
import sweetAlert from 'sweetalert2';
import { map, catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import * as moment from 'moment';
import * as $ from 'jquery';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css']
})
export class TagsComponent implements OnInit {

  tags_lessuser: any = [];
  alreadyTags: any = [];
  tags: any = [];
  tagsTemp: any = [];
  tagsForUser: any = [];
  tagsForUserTemp: any = [];
  colstags: any = [];
  colsShowtags: any = [];
  colstag_user: any = [];
  colsTagsForUser: any = [];
  tageduser: any = [];
  tageduserTemp: any = [];
  test: any = [];
  sameColorTags: any = [];
  CSVProgressvalue: number = 0;
  randomColor = [
    "primary", "secondary", "success", "danger", "warning", "info", "dark"
  ]
  tooltip: String;
  loaderOn: boolean = false;
  fileLoaded: boolean = false;
  show_particularTagList: boolean = false;
  show_particularTagList_loader: boolean = false;
  show_particularTagList_Nouser: boolean = false;
  show_TagList: boolean = false;
  show_No_TagSelected: boolean = true;
  show_TagList_foruser: boolean = true;
  no_TagsList_forUser: String = "No Tags";
  no_user: String = "No Tagged User";
  no_Tags: String = "No Tags";
  no_user_selected: String = "No Tag Selected";
  displayaddTagModal: boolean;
  displayUpdateTagModal: boolean;
  displayCSVModal: boolean;
  displayUpdateShowTagModal: boolean;
  tagId: String;
  userId: String;
  tagId_filter: String;
  account_name: String ="all";
  updateTag_index: any;
  tagClass: String;
  tagColor: String;
  msgs: Message[] = [];
  Importmsgs: Message[] = [];
  selectedTags: any = [];
  data: FormGroup;
  submitted = false;
  firstLoad = true;
  profile_image: String;
  csvExportName: String;

  constructor(
    private tagsService: TagsService,
    private CSVImportService: CSVImportService,
    private contactService: ContactService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private papa: Papa
  ) {
    this.profile_image = "assets/images/emptyImage.png",
      this.colstags = [
        { field: 'name', header: 'Tag Name' },
      ];
      this.colsTagsForUser = [
        { field: 'name', header: 'Tag Name' },
      ];
    this.colstag_user = [
      { field: 'profile_pic', header: 'image' },
      { field: 'fb_name', header: 'Name' },
    ];
    this.colsShowtags = [
      { field: 'name', header: 'Name' },
    ];
    this.data = this.formBuilder.group({
      tag_name: ['', Validators.required],
    });
  }

  get h() { return this.data.controls; }

  ngOnInit(): void {
    this.csvExportName = "Tags ("+moment(new Date()).format('DD-MMMM-YYYY')+")";
    this.tagList();
  }

  eventHandler(event:string[]){
    this.tags = event;
    this.tagsTemp = event;
    this.tags = [];
    for (let i = 0; i < this.tags.length; i++) {
      if (i < 9) {
        this.tags.push(this.tags[i]);
      }
    }
  }

  errorImageHandler(event) {
    event.target.src = this.profile_image;
  }

  tagList() {
    this.spinner.show();
    var token = localStorage.getItem("token");
    this.tagsService.getTags(token,"").subscribe((response: any) => {
      if (response["status"] == 404) {
        this.spinner.hide();
        console.log(response);
      } else if (response["status"] == 200) {
        let temptags = response["tagDetails"];
        console.log(temptags)
        this.tags = temptags;
        this.show_TagList = this.tags.length > 0 ? false : true;
/*         this.loaderOn = this.tags.length > 0 ? true : false;
        for (let i = 0; i < this.tags.length; i++) {
          if (i < 9) {
            this.tags_lessuser.push(this.tags[i]);
          }
        } */
        this.tagsTemp = temptags;
        this.spinner.hide();
        console.log(response);
      }
    }, (err) => {
      this.spinner.hide();
      console.log(err);
    })
  }

  loadMoredata() {
    this.loaderOn = false;
    this.spinner.show("show_loader_forMoreList");
    setTimeout(() => {
      var min_length = this.tags_lessuser.length - 1;
      var max_length = (this.tags_lessuser.length - 1) + 8;
      for (let i = 0; i < this.tags.length; i++) {
        if (i > min_length && i < max_length) {
          this.tags_lessuser.push(this.tags[i]);
        }
      }
      this.spinner.hide("show_loader_forMoreList");
      this.loaderOn = this.tags.length == this.tags_lessuser.length ? false : true;
    }, 3000)
  }

  colorChange(color) {
    return "bg-" + color
  }

  particularTag(id) {
    this.show_No_TagSelected = false;
    this.tageduser = [];
    this.tagId_filter = id;
    var tagId_filter = id;
    this.show_particularTagList = true;
    this.spinner.show('show_particularTagList_loader');
    var token = localStorage.getItem("token");
    var data = {
      "tag_id": [id],
      "fb_account_id": this.account_name
    }
    this.tagsService.getTagedUser(data, token).subscribe((response: any) => {
      if (response["status"] == 404) {
        console.log(response);
      } else if (response["status"] == 200) {
        let tageduserTemp = response["tagUserDetails"];
        this.show_particularTagList_Nouser = tageduserTemp.length > 0 ? false : true;
        console.log(tageduserTemp)
        this.tageduser = tageduserTemp;
        this.tageduserTemp = tageduserTemp;
        this.sameColorTags = [];
        for (let i = 0; i < this.tageduser.length; i++) {
          var sameColorTags = this.tageduser[i].tags.find(object => object.id == tagId_filter);
          this.sameColorTags.push(sameColorTags);
        }
        if (this.account_name == "all") {
          setTimeout(() => {
            $(".tags button").attr('disabled', true).css('cursor', 'not-allowed');
            this.tooltip = "Please select Facebook Account"
          }, 650)
        }else{
          $(".tags button").attr('disabled', false).css('cursor', 'pointer');
          this.tooltip = "Account Selected "+this.account_name;
        }

        this.filterTagedUserList(this.account_name);
        this.spinner.hide('show_particularTagList_loader');
        console.log(response);
      }
    }, (err) => {
      console.log(err);
    })
  }

  onRowReorder(event) {
    var reordered_array = [];
    var reordered_Object = {};
    for(let i=0;i<this.tags.length;i++){
      if(event.dragIndex < event.dropIndex){
        if(i >= event.dragIndex && i <= event.dropIndex ){
          var tag_id = this.tags[i].id;
          var order_num = i.toString();
          reordered_Object = {tag_id:tag_id,order_num:order_num};
          reordered_array.push(reordered_Object);
        }
      }else if(event.dragIndex > event.dropIndex){
        if(i >= event.dropIndex && i <= event.dragIndex ){
          var tag_id = this.tags[i].id;
          var order_num = i.toString();
          reordered_Object = {tag_id:tag_id,order_num:order_num};
          reordered_array.push(reordered_Object);
        }
      }

    }
    this.spinner.show();
    var token = localStorage.getItem("token");
    console.log(reordered_array);
    var data={
      "changedorder":reordered_array
    }
    this.tagsService.redoderTag(token,data).subscribe((response: any) => {
      if (response["status"] == 404) {
        this.spinner.hide();
        console.log(response);
      } else if (response["status"] == 200) {
        this.spinner.hide();
        console.log(response);
      }
    }, (err) => {
      this.spinner.hide();
      console.log(err);
    })
  }

  addTag() {
    this.data.reset();
    this.displayaddTagModal = true;
  }

  updateTag(index, id, tag_name, class_type, color_type) {
    this.data.reset();
    this.updateTag_index = index;
    this.tagId = id;
    this.tagClass = class_type;
    this.tagColor = color_type;
    this.data.patchValue({ "tag_name": tag_name });
    this.displayUpdateTagModal = true;
  }

  classForValidation(type) {
    if (this.firstLoad) {
      return
    }
    else if (this.submitted && this.h.tag_name.errors && (type == 'tag_name')) {
      return 'is-invalid';
    } else {
      return 'is-valid';
    }
  }

  submit() {
    this.spinner.show();
    this.firstLoad = false;
    this.submitted = true;
    if (this.data.invalid) {
      this.spinner.hide();
      return;
    }
    var keys = Object.keys(this.randomColor)
    var randIndex = Math.floor(Math.random() * keys.length)
    var randKey = keys[randIndex]
    var name = this.randomColor[randKey]
    var data = {
      "name": this.data.value.tag_name,
      "class": name,
      "custom_color": null
    }
    var token = localStorage.getItem("token")
    this.tagsService.addTag(token, data).subscribe((response: any) => {
      if (response.status == 200) {
        var insert_id = parseInt(this.tags[this.tags.length - 1].id) + 1;
        var data = {
          "id": insert_id.toString(),
          "name": this.data.value.tag_name,
          "class": name,
          "custom_color": null
        }
        this.tags.push(data);
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
    })
  }

  submit_updateTag() {
    this.spinner.show();
    this.firstLoad = false;
    this.submitted = true;
    if (this.data.invalid) {
      this.spinner.hide();
      return;
    }
    var data = {
      "name": this.data.value.tag_name,
      "class": this.tagClass,
      "custom_color": this.tagColor
    }
    var token = localStorage.getItem("token")
    this.tagsService.updateTag(token, data, this.tagId).subscribe((response: any) => {
      if (response.status == 200) {
        this.tags[this.updateTag_index]["name"] = this.data.value.tag_name;
        this.tags[this.updateTag_index]["class"] = this.tagClass;
        this.tags[this.updateTag_index]["custom_color"] = this.tagColor;
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
    })
  }


  deleteTag(index, id) {
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
        this.spinner.show();
        var token = localStorage.getItem("token");
        this.tagsService.deleteTag(token, id).subscribe((response: any) => {
          if (response["status"] == 404) {
            this.spinner.hide();
            console.log(response);
          } else if (response["status"] == 200) {
            this.spinner.hide();
            this.tags.splice(index, 1);
            sweetAlert.fire(
              'Deleted!',
              'This Tag is deleted.',
              'success'
            ).then((result) => {
              if (result) {
                this.tags.splice(index, 1);
                this.tags_lessuser.splice(index, 1);
                this.tagsTemp.splice(index, 1);
              }
            })
            console.log(response);
          }
        }, (err) => {
          this.spinner.hide();
          console.log(err);
        })
      }
    })
  }

  onchangeInput(event) {
    event.target.value;
    if (event.target.value == "") {
      this.loaderOn = true;
      var querryParam1 = { queryParams: { type: this.tagId_filter } }
      this.router.navigate(['/tags'], querryParam1);
    } else {
      this.loaderOn = false;
      var querryParam = { queryParams: { type: this.tagId_filter, q: event.target.value } }
      this.router.navigate(['/tags'], querryParam);
    }
  }

  showTags(tags, id){ 
    this.displayUpdateShowTagModal = true
    this.spinner.show('show_particularTag_loader');
    this.tagsForUser = [];
    this.alreadyTags = tags;
    this.userId = id;
    var token = localStorage.getItem("token");
    this.tagsService.getTags(token,"").subscribe((response: any) => {
      if (response["status"] == 404) {
        this.spinner.hide('show_particularTag_loader');
        console.log(response);
      } else if (response["status"] == 200) {
        let temptags = response["tagDetails"];
        console.log(temptags)
        this.tagsForUser = temptags;
        this.tagsForUserTemp = temptags;
        this.selectedTags = [];
        for (let i = 0; i < this.alreadyTags.length; i++) {
          var id = this.alreadyTags[i].id;
          var filterTags = this.tags.find(object => object.id == id);
          this.selectedTags.push(filterTags);
        }
        this.spinner.hide('show_particularTag_loader');
        console.log(response);
      }
    }, (err) => {
      this.spinner.hide('show_particularTag_loader');
      console.log(err);
    })
  }

  onSelect(taggedId) {
    var tageduser_index = this.tageduser.findIndex(element => element.id == this.userId);
    this.tageduser[tageduser_index].tags = this.selectedTags;
    var tagIds = this.selectedTags.map(value => value.id);
    var data = {
      "taggedId": this.userId,
      "tagIds": tagIds,
    }
    var token = localStorage.getItem("token")
    this.contactService.updateTags(token, data).subscribe((response: any) => {
      if (response.status == 200) {
      } else if (response.status == 404) {
      }
    }, (err) => {
      console.log(err);
    })
  }

  filterTagedUserList(acc_name) {
    this.account_name = acc_name?acc_name:"all";
    var account_name = this.account_name;
    if (account_name != "all") {
      $(".tags button").attr('disabled', false).css('cursor', 'pointer');
      this.tooltip = "Account Selected "+account_name;
      this.tageduser = this.tageduserTemp.filter(function (item) {
        return item.account_fb_id == account_name;
      })
      this.show_particularTagList_Nouser = this.tageduser.length > 0 ? false : true;
    } else {
      this.tageduser = this.tageduserTemp;
      setTimeout(() => {
        $(".tags button").attr('disabled', true).css('cursor', 'not-allowed')
        this.tooltip = "Please select Facebook Account"
      }, 650)
      this.show_particularTagList_Nouser = this.tageduser.length > 0 ? false : true;
    }
  }

}
