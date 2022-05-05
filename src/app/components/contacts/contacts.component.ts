import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ContactService } from '../../services/contact.service';
import { TagsService } from '../../services/tags.service';
import { NgxSpinnerService } from "ngx-spinner";
import { Message } from 'primeng/api';
import sweetAlert from 'sweetalert2';
import * as moment from 'moment';
import * as $ from 'jquery';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {

  displayaddNotesModal: boolean;
  displayupdateNotesModal: boolean;
  loaderOn: boolean = false;
  opentag: boolean = false;
  opennote: boolean = false;
  show_particularTagList_Nouser: boolean = false;
  show_particularNotesList_Nouser: boolean = false;
  NO_contacts_to_show_boolean: boolean = false;
  show_No_TagSelected: boolean = true;
  contactList: any = [];
  contactListTemp: any = [];
  conatctListTemp: any = [];
  contactAlreadtTags: any = [];
  colstags: any = [];
  colsnotes: any = [];
  tags: any = [];
  tagsTemp: any = [];
  contactList_lessuser: any = [];
  colscontact: any = [];
  msgs: Message[] = [];
  fb_user_id: String;
  profile_image: String;
  contact_id: String;
  updateNote_index: any;
  noteId: String;
  no_user: String = "No tags";
  no_user_notes: String = "No Notes";
  no_user_selected: String = "No Contact Selected";
  NO_contacts_to_show: String = "No Contacts To Show";
  selectedTags: any = [];
  notesList: any = [];
  data: FormGroup;
  submitted = false;
  firstLoad = true;
  tooltip:String
  selectedFBAccount: boolean = false;

  constructor(
    private contactService: ContactService,
    private tagsService: TagsService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.profile_image = "assets/images/emptyImage.png",
      this.colscontact = [
        { field: 'profile_pic', header: "Image" },
        { field: 'fb_name', header: 'Name' },
      ];
    this.colstags = [
      { field: 'name', header: 'Name' },
    ];
    this.colsnotes = [
      { field: 'name', header: 'Name' },
    ];
    this.data = this.formBuilder.group({
      notes: ['', Validators.required],
    });
  }

  get h() { return this.data.controls; }

  ngOnInit(): void {
    //$(".scrollBar_cutom p-table table tbody tr td #tags").prop('disabled', true);
    //$(".scrollBar_cutom p-table table tbody tr td #tags").css('cursor', 'not-allowed');
    this.getConatctList();
  }

  getConatctList() {
    this.spinner.show();
    var token = localStorage.getItem("token");
    this.contactService.getContactList(token).subscribe((response: any) => {
      if (response["status"] == 404) {
        this.spinner.hide();
        console.log(response);
      } else if (response["status"] == 200) {
        let conatctListTemp = response["contacts"];
        console.log(conatctListTemp)
        this.contactList = conatctListTemp;
        this.contactListTemp = conatctListTemp;
        this.loaderOn = this.contactList.length > 0 ? true : false;
        this.NO_contacts_to_show_boolean = this.contactList.length == 0 ? true : false;
/*         for (let i = 0; i < this.contactList.length; i++) {
          if (i < 9) {
            this.contactList_lessuser.push(this.contactList[i]);
          }
        } */
        this.conatctListTemp = conatctListTemp;
        setTimeout(() => {
          $(".tags a").attr('disabled', true).css('cursor', 'not-allowed');
          this.tooltip = "Please select Facebook Account"
        }, 1000)
        this.spinner.hide();
        console.log(response);
      }
    }, (err) => {
      this.spinner.hide();
      console.log(err);
    })
  }

  tagList() {
    var token = localStorage.getItem("token");
    this.tagsService.getTags(token,"").subscribe((response: any) => {
      if (response["status"] == 404) {
        this.spinner.hide();
        console.log(response);
      } else if (response["status"] == 200) {
        let temptags = response["tagDetails"];
        console.log(temptags)
        this.tags = temptags;
        this.tagsTemp = temptags;
        this.show_particularTagList_Nouser = temptags.length > 0 ? false : true;
        this.selectedTags = [];
        for (let i = 0; i < this.contactAlreadtTags.length; i++) {
          var id = this.contactAlreadtTags[i].id;
          var filterTags = this.tags.find(object => object.id == id);
          this.selectedTags.push(filterTags);
        }
        this.spinner.hide('show_particularTag_loader');
        console.log(response);
      }
    }, (err) => {
      this.spinner.hide();
      console.log(err);
    })
  }

  colorChange(color) {
    return "bg-" + color
  }

  errorImageHandler(event) {
    event.target.src = this.profile_image;
  }

  loadMoredata() {
    this.loaderOn = false;
    this.spinner.show("show_loader_forMoreList");
    setTimeout(() => {
      var min_length = this.contactList_lessuser.length - 1;
      var max_length = (this.contactList_lessuser.length - 1) + 8;
      for (let i = 0; i < this.contactList.length; i++) {
        if (i > min_length && i < max_length) {
          this.contactList_lessuser.push(this.contactList[i]);
        }
      }
      this.spinner.hide("show_loader_forMoreList");
      this.loaderOn = this.contactList.length == this.contactList_lessuser.length ? false : true;
    }, 3000)
  }

  openNote(fb_user_id) {
    this.show_No_TagSelected = false;
    this.spinner.show('show_particularNote_loader');
    this.fb_user_id = fb_user_id;
    this.opennote = true;
    this.opentag = false;
    var data = {
      "fb_user_id": fb_user_id
    }
    var token = localStorage.getItem("token");
    this.contactService.getNotes(token, data).subscribe((response: any) => {
      if (response["status"] == 404) {
        this.spinner.hide();
        console.log(response);
      } else if (response["status"] == 200) {
        let tempNotes = response["notes"];
        this.notesList = tempNotes;
        this.show_particularNotesList_Nouser = this.notesList.length > 0 ? false : true;
        this.spinner.hide('show_particularNote_loader');
        console.log(tempNotes);
      }
    }, (err) => {
      this.spinner.hide();
      console.log(err);
    })
  }

  opentags(tags, id) {
    if(this.selectedFBAccount){
      this.show_No_TagSelected = false;
      this.opentag = true;
      this.opennote = false;
      this.tags = [];
      this.contactAlreadtTags = tags;
      this.contact_id = id;
      this.spinner.show('show_particularTag_loader');
      this.tagList();
    }
  }

  onSelect(taggedId) {
    var contact_index = this.contactList.findIndex(element => element.id == this.contact_id);
    this.contactList[contact_index].tags = this.selectedTags;
    var tagIds = this.selectedTags.map(value => value.id);
    var data = {
      "taggedId": taggedId,
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


  classForValidation(type) {
    if (this.firstLoad) {
      return
    }
    else if (this.submitted && this.h.notes.errors && (type == 'notes')) {
      return 'is-invalid';
    } else {
      return 'is-valid';
    }
  }

  addNotes() {
    this.data.reset();
    this.displayaddNotesModal = true;
  }

  submit() {
    this.spinner.show("show_particularNote_loader");
    this.firstLoad = false;
    this.submitted = true;
    if (this.data.invalid) {
      this.spinner.hide("show_particularNote_loader");
      return;
    }
    var data = {
      "fb_user_id": this.fb_user_id,
      "description": this.data.value.notes
    }
    var token = localStorage.getItem("token")
    this.contactService.addNotes(token, data).subscribe((response: any) => {
      if (response.status == 200) {
        var insert_id = this.notesList.length > 0 ? parseInt(this.notesList[this.notesList.length - 1].id) + 1 : 1;
        var data = {
          "id": insert_id.toString(),
          "description": this.data.value.notes,
          "fb_user_id": this.fb_user_id,
        }
        this.notesList.push(data);
        this.msgs = [];
        this.msgs.push({
          severity: 'success', summary: 'Success Message', detail: response.
            msg
        });
        setTimeout(() => {
          this.msgs = [];
        }, 3000)
        this.spinner.hide("show_particularNote_loader");
      } else if (response.status == 404) {
        this.msgs = [];
        this.msgs.push({
          severity: 'error', summary: 'Error Message', detail: response.
            msg
        });
        setTimeout(() => {
          this.msgs = [];
        }, 3000)
        this.spinner.hide("show_particularNote_loader");
      }
    }, (err) => {
      this.spinner.hide("show_particularNote_loader");
      console.log(err);
    })
  }

  submit_update(index, id, fb_user_id) {
    this.spinner.show();
    var notesTemp = $("#notes_" + index).val();
    var notes = notesTemp.replace(/^\s+|\s+$/gm, '');
    var data = {
      "fb_user_id": fb_user_id,
      "description": notes,
    }
    var token = localStorage.getItem("token")
    this.contactService.updateNotes(token, data, id).subscribe((response: any) => {
      if (response.status == 200) {
        this.notesList[index]["description"] = notes;
        this.spinner.hide();
      } else if (response.status == 404) {
        this.spinner.hide();
      }
    }, (err) => {
      this.spinner.hide();
      console.log(err);
    })
  }

  deleteNotes(index, id) {
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
            this.notesList.splice(index, 1);
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

  filterContactList(acc_name) {
    this.NO_contacts_to_show_boolean = false;
    if (acc_name != "all") {
      this.show_No_TagSelected = true;
      this.opentag = false;
      $(".tags a").attr('disabled', false).css('cursor', 'pointer');
      this.tooltip = "Account Selected "+acc_name;
      this.selectedFBAccount = true;
      this.contactList = this.contactListTemp.filter(function (item) {
        return item.account_fb_id == acc_name;
      })
      this.contactList_lessuser = [];
      for (let i = 0; i < this.contactList.length; i++) {
        if (i < 9) {
          this.contactList_lessuser.push(this.contactList[i]);
        }
      }
      if (this.contactList.length < 8 && this.contactList.length > 0) {
        this.loaderOn = false;
      } else if (this.contactList.length == this.contactList_lessuser.length) {
        this.loaderOn = false;
        this.NO_contacts_to_show_boolean = true;
      } else if (this.contactList.length > 8) {
        this.loaderOn = true;
      }
    } else {
      this.show_No_TagSelected = true;
      this.NO_contacts_to_show_boolean = this.contactList.length == 0 ? true : false;
      this.opentag = false;
      setTimeout(() => {
        $(".tags a").attr('disabled', true).css('cursor', 'not-allowed')
        this.tooltip = "Please select Facebook Account"
      }, 1000)
      this.selectedFBAccount = false;
      this.tags = [];
      this.show_particularTagList_Nouser = true;
      this.loaderOn = this.contactList.length > 0 ? true : false;
      this.contactList = this.contactListTemp;
      this.contactList_lessuser = [];
      for (let i = 0; i < this.contactList.length; i++) {
        if (i < 9) {
          this.contactList_lessuser.push(this.contactList[i]);
        }
      }
    }
  }

}
