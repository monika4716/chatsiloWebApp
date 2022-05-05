import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TagsService } from '../../services/tags.service';
import { CSVImportService } from '../../services/csv-import.service';
import { ContactService } from '../../services/contact.service';
import { SharedService } from '../../services/shared.service';
import { NgxSpinnerService } from "ngx-spinner";
import { Message } from 'primeng/api';
import { Papa } from 'ngx-papaparse';
import sweetAlert from 'sweetalert2';
import { map, catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import * as moment from 'moment';
import * as $ from 'jquery';
@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.css']
})
export class TagComponent implements OnInit {

  color1:string = "#925388";
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

  displayNoTagSelected:boolean = true;
  displayContacts:boolean = false;
  displayNotes:boolean = false;
  notesUser:string;

  notesList: any = [];
  emptyTags:boolean = false;
  emptyTaggedUser:boolean = false;
  selectParticulTag:boolean = false;
  selectParticulTagId:string;

  selectedTagBgClass:string = 'transparent';
  selectedTagBgColor:string = "transparent";
  selectedTagName:string = "";

  constructor(
    private tagsService: TagsService,
    private CSVImportService: CSVImportService,
    private contactService: ContactService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private papa: Papa,
    private SharedService: SharedService
  ) { 
    this.profile_image = "assets/images/emptyImage.png";
    this.colstags = [
      { field: 'name', header: 'Tag Name' },
    ];
    this.colsTagsForUser = [
      { field: 'name', header: 'Tag Name' },
    ];
    // this.colstag_user = [
    //   { field: 'profile_pic', header: 'image' },
    //   { field: 'fb_name', header: 'Name' },
    // ];
    this.colstag_user = [
      { field: 'fb_name', header: 'Name' },
    ];

  }

  ngOnInit(): void {
    this.tagList();
    this.data = this.formBuilder.group({
      tag_name: ['', Validators.required],
    });
    this.csvExportName = "Tags ("+moment(new Date()).format('DD-MMMM-YYYY')+")";
    // this.getTagCounter();
    this.SharedService.selectedFbAccount.subscribe(selectedFbAccountValue => {
      // console.log("tags ngOnit "+selectedFbAccountValue)
      if(selectedFbAccountValue == null){
        return
      }
      this.tagList();
      this.displayNoTagSelected = true;
      this.displayContacts = false;
      this.displayNotes = false;
    })
  }

  get h() { return this.data.controls; }

  tagList() {
    this.spinner.show('tagsList');
    var token = localStorage.getItem("token");
    var fb_account = localStorage.getItem("FbAccount");
    this.tagsService.getTags(token, fb_account).subscribe((response: any) => {
      if (response["status"] == 404) {
        this.spinner.hide('tagsList');
        // console.log(response);
      } else if (response["status"] == 200) {
        let temptags = response["tagDetails"];
        // console.log(temptags)
        this.tags = temptags;
        this.emptyTags = this.tags.length > 0 ? false : true;
        this.show_TagList = this.tags.length > 0 ? false : true;
        this.tagsTemp = temptags;
        this.spinner.hide('tagsList');
      }
    }, (err) => {
      this.spinner.hide('tagsList');
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

  colorChange(color, custom_color) {
    if(custom_color == null){
      return "bg-" + color
    }else{
      return false;
    }
    
  }

  particularTag(id) {
    /* for mobile layout */
    var element = document.getElementById("tag_list");
    element.classList.add("mobile_hide");
    var element = document.getElementById("taggedUser_list");
    if(element != null){
      element.classList.remove("mobile_hide");
    }

    this.selectedTagBgClass = '';
    this.selectedTagBgColor = "";
    $("#tags_wrapper").removeClass('t_r_icon');
    $(".tag_row").removeClass('active');
    $("#tag_"+id).addClass('active');
    this.spinner.show('contactsList');
    this.selectParticulTagId = id;
    this.displayNoTagSelected = false;
    this.displayContacts = true;
    this.displayNotes = false;
    // this.show_No_TagSelected = false;
    this.tageduser = [];
    this.tagId_filter = id;
    var tagId_filter = id;
    this.show_particularTagList = true;
    
    var token = localStorage.getItem("token");
    var fbAccount_id = localStorage.getItem("FbAccount");

    var data = {
      "tag_id": [id],
      "fb_account_id": fbAccount_id //this.account_name
    }
    this.tagsService.getTagedUser(data, token).subscribe((response: any) => {
      if (response["status"] == 404) {
        console.log(response);
      } else if (response["status"] == 200) {

        var tag_index = this.tags.findIndex(x => x.id == id);
        this.selectedTagName = this.tags[tag_index].name;

        let tageduserTemp = response["tagUserDetails"];
        this.show_particularTagList_Nouser = tageduserTemp.length > 0 ? false : true;
        //console.log(tageduserTemp)
        this.tageduser = tageduserTemp;
        this.tageduserTemp = tageduserTemp;

        this.emptyTaggedUser = this.tageduser.length > 0 ? false : true;
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
        $("#tags_wrapper").addClass('t_r_icon');
        this.spinner.hide('contactsList');
        let index = this.tags.findIndex(x => x.id == id);
        if(this.tags[index].custom_color == null){
          this.selectedTagBgClass = 'bg-'+this.tags[index].class;
          this.selectedTagBgColor = "";
        }else{
          this.selectedTagBgClass = '';
          this.selectedTagBgColor = this.tags[index].custom_color;
        }
        // console.log(response);
      }
    }, (err) => {
      console.log(err);
    })
  }

  expandTag(id){
    var element = document.getElementById("tag_"+id);
    if(element.classList.contains('show')){
      element.classList.remove("show");
    }else{
      element.classList.add("show");
    }
    
    // alert(id)
    // var items:any = document.getElementsByClassName('show');
    // for (let i = 0; i < items.length; i++) {
    //     let element = items[i];
    //     element.classList.remove('show');
    // }
    // var element = document.getElementById("tag_"+id);
    // element.classList.add("show");
  
  }

  addTag() {
    this.data.reset();
    this.displayaddTagModal = true;
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

    if(this.data.value.tag_name.trim()){
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
        "name": this.data.value.tag_name.trim(),
        "class": name,
        "custom_color": null
      }
      var token = localStorage.getItem("token")
      this.tagsService.addTag(token, data).subscribe((response: any) => {
        if (response.status == 200) {
          // var insert_id = parseInt(this.tags[this.tags.length - 1].id) + 1;
          var data = {
            "id": response.id,
            "name": this.data.value.tag_name,
            "class": name,
            "custom_color": null
          }
          this.tags.push(data);
          this.emptyTags = this.tags.length > 0 ? false : true;
          this.data.reset();
          this.submitted = false;
          $("#tag_name").removeClass(['is-invalid','is-valid'])
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
    }else{
      this.msgs = [];
      this.msgs.push({
        severity: 'error', summary: 'Error Message', detail: "Please enter tag name"
      });
      setTimeout(() => {
        this.msgs = [];
      }, 3000)
    }
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
            this.emptyTags = this.tags.length > 0 ? false : true;
            // if(this.tags.length == 0){
              this.displayNoTagSelected = true;
              this.displayContacts = false;
            // }
            sweetAlert.fire(
              'Deleted!',
              'This Tag is deleted.',
              'success'
            ).then((result) => {
              if (result) {
                
                // this.tags.splice(index, 1);
                // this.tags_lessuser.splice(index, 1);
                // this.tagsTemp.splice(index, 1);
                // 
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

  updateTag(index, id, tag_name, class_type, color_type) {
    this.data.reset();
    this.updateTag_index = index;
    this.tagId = id;
    this.tagClass = class_type;
    this.tagColor = color_type;
    this.data.patchValue({ "tag_name": tag_name });
    this.displayUpdateTagModal = true;
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

  errorImageHandler(event) {
    event.target.src = this.profile_image;
  }

  

  openNote(fb_user_id,name) {
    let tempBgClass = this.selectedTagBgClass;
    let tempBgColor = this.selectedTagBgColor;
    this.selectedTagBgClass = '';
    this.selectedTagBgColor = "";
    $("#tags_wrapper").removeClass('t_r_icon');
    this.notesUser = name;
    this.displayContacts = false;
    this.displayNotes = true;

    this.show_No_TagSelected = false;
    this.spinner.show('notesList');

    var data = {
      "fb_user_id": fb_user_id
    }
    var token = localStorage.getItem("token");
    this.contactService.getNotes(token, data).subscribe((response: any) => {
      if (response["status"] == 404) {
        this.spinner.hide('notesList');
        // console.log(response);
      } else if (response["status"] == 200) {
        let tempNotes = response["notes"];
        this.notesList = tempNotes;
        this.selectedTagBgClass = tempBgClass;
        this.selectedTagBgColor = tempBgColor;
        // this.show_particularNotesList_Nouser = this.notesList.length > 0 ? false : true;
        $("#tags_wrapper").addClass('t_r_icon');
        this.spinner.hide('notesList');
        // console.log(tempNotes);
      }
    }, (err) => {
      this.spinner.hide('notesList');
      console.log(err);
    })
  }

  deleteNotes(id) {
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
        this.contactService.deleteNotes(token, id).subscribe((response: any) => {
          if (response["status"] == 404) {
            this.spinner.hide();
            console.log(response);
          } else if (response["status"] == 200) {
            this.spinner.hide();
            // this.notesList.splice(index, 1);
            let JSONindex = this.notesList.findIndex(x => x.id == id);
            this.notesList.splice(JSONindex, 1); 
            sweetAlert.fire(
              'Deleted!',
              'This Note is deleted.',
              'success'
            )
            console.log(response);
          }
        }, (err) => {
          this.spinner.hide();
          console.log(err);
        })
      }
    })
  }

  updateNote(id, fb_user_id, noteText){
    this.spinner.show();
    var notesTemp = noteText;
    var notes = notesTemp.replace(/^\s+|\s+$/gm, '');
    var data = {
      "fb_user_id": fb_user_id,
      "description": notes,
    }
    var token = localStorage.getItem("token")
    this.contactService.updateNotes(token, data, id).subscribe((response: any) => {
      if (response.status == 200) {
        // this.notesList[index]["description"] = notes;
        this.spinner.hide();
      } else if (response.status == 404) {
        this.spinner.hide();
      }
    }, (err) => {
      this.spinner.hide();
      console.log(err);
    })
  }

  backToContactScreen(){
    this.displayContacts = true;
    this.displayNotes = false;
  }

  eventHandler(event:string[]){
    this.tags = event;

    this.emptyTags = this.tags.length > 0 ? false : true;
    // this.tagsTemp = event;
    // this.tags = [];
    // for (let i = 0; i < this.tags.length; i++) {
    //   if (i < 9) {
    //     this.tags.push(this.tags[i]);
    //   }
    // }
  }

  showTags(tags,id){
    this.displayUpdateShowTagModal = true
    this.spinner.show('show_particularTag_loader');
    this.tagsForUser = [];
    this.alreadyTags = tags;
    this.userId = id;
    var token = localStorage.getItem("token");
    var fb_account = localStorage.getItem("FbAccount");
    this.tagsService.getTags(token, fb_account).subscribe((response: any) => {
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
          delete filterTags["total"];
          this.selectedTags.push(filterTags);
        }
        console.log(this.selectedTags);
        this.spinner.hide('show_particularTag_loader');
        console.log(response);
      }
    }, (err) => {
      this.spinner.hide('show_particularTag_loader');
      console.log(err);
    })
  }

  onSelect(taggedId, event) {
    console.log(event)
    console.log(this.selectedTags)
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

  popupClose(){
    this.tagList();
    this.particularTag(this.selectParticulTagId);
  }

  getTagCounter(){
    return
    var token = localStorage.getItem("token");
    var fbAccountId = localStorage.getItem("FbAccount");
    var data = {
      "fb_account_id": fbAccountId
    }
    this.tagsService.tagsCounter(token, data).subscribe((response: any) => {
      if (response.status == 200) {
        // console.log(response['data'])
        var counter:any = response['data'];
        for(let i = 0; i < this.tags.length; i++){
          let id = this.tags[i].id;
          let count =  counter[id];
          // console.log(count)
          this.tags[i].total = count;
          // console.log(this.tags)
        }
      } else if (response.status == 404) {
        // console.log(response['data'])
      }
    }, (err) => {
      console.log(err);
    })
  }

  colorChanged(event, tag_id){
    if(event.value == "#ffffff"){
      return;
    }
    var element = document.getElementById("tag_"+tag_id);
    element.style.backgroundColor = event.value;
    element.className = element.className.replace(/\bbg.*?\b/g, '');
    // console.log(event.value)

    let index = this.tags.findIndex(x => x.id == tag_id);
    this.tags[index].custom_color = event.value;

    if(this.selectParticulTagId == tag_id){
      this.selectedTagBgClass = '';
      this.selectedTagBgColor = event.value;
    }

    //   this.selectedTagBgClass = 'bg-'+this.tags[index].class;
    //   this.selectedTagBgColor = "";
    // }else{
    //   this.selectedTagBgClass = '';
    //   this.selectedTagBgColor = this.tags[index].custom_color;
    // }

    var token = localStorage.getItem("token");
    var data = {
      "tagId": tag_id,
      "changedTagColor" : event.value
    }
    this.tagsService.changeTagColor(token, data).subscribe((response:any) => {
      // console.log(response)
    }, (err) => {
      console.log(err)
    })
  }

  backToTagsScreen(){
    var element = document.getElementById("tag_list");
    element.classList.remove("mobile_hide");

    var element = document.getElementById("taggedUser_list");
    element.classList.add("mobile_hide");
    
  
  }
}
