import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TemplateService } from '../../services/templates.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { Message } from 'primeng/api';
import sweetAlert from 'sweetalert2';
import * as moment from 'moment';
import * as $ from 'jquery';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.css'],
  providers: [MessageService]
})
export class TemplatesComponent implements OnInit {

  templates: any = [];
  templatesTemp: any = [];
  colstags: any = [];
  colstemplates: any = [];
  templateuser: any = [];
  templateuserTemp: any = [];
  template_lessuser: any = [];
  show_particularTemplateList: boolean = false;
  show_particularTemplateList_loader: boolean = false;
  show_particularTemplateList_Nouser: boolean = false;
  loaderOn: boolean = false;
  no_user: String = "No Message";
  show_No_TagSelected: boolean = true;
  no_user_selected: String = "No Template Selected";
  displayaddTemplateModal: boolean;
  displayUpdateTemplateModal: boolean;
  displayUpdateMessageModal: boolean;
  displayaddMessageModal: boolean;
  templateId: String;
  templateId_filter: String;
  templateMessage_id: String;
  updateTag_index: any;
  msgs: Message[] = [];
  lmsgs: Message[] = [];
  data: FormGroup;
  data_message: FormGroup;
  submitted = false;
  firstLoad = true;
  submitted_message = false;
  firstLoad_message = true;
  csvExportName: String;
  csvExportMessage: String;
  csvExportMessageName: String;
  emptytemplates:boolean = false;
  addingTemplate:boolean = false;
  addingMessage:boolean = false;
  constructor(
    private templateService: TemplateService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private messageService:MessageService
  ) { }

  ngOnInit(): void {
    this.colstags = [
      { field: 'name', header: 'Template Name'}
    ];
    this.colstemplates = [
      { field: 'template_name', header: 'Template Name' },
      { field: 'message', header: 'Message' },
    ];
    this.data = this.formBuilder.group({
      template_name: ['', Validators.required],
    });
    this.data_message = this.formBuilder.group({
      message: ['', Validators.required],
    });
    this.templateList();
    this.csvExportName = "Templates ("+moment(new Date()).format('DD-MMMM-YYYY')+")";
    this.csvExportMessageName = "Messages ("+moment(new Date()).format('DD-MMMM-YYYY')+")";

  }

  templateList() {
    this.spinner.show('templatesList');
    var token = localStorage.getItem("token");
    this.templateService.getTemplate(token).subscribe((response: any) => {
      if (response["status"] == 404) {
        this.spinner.hide('templatesList');
        // console.log(response);
      } else if (response["status"] == 200) {
        let temptags = response["templateDetails"];
        // console.log(temptags)
        // console.log(temptags.length)
        this.templates = temptags;
        this.templatesTemp = temptags;
        this.loaderOn = this.templates.length > 0 ? true : false;
        this.emptytemplates = this.templates.length > 0 ? false : true;
        this.spinner.hide('templatesList');
        // console.log(response);
      }
    }, (err) => {
      this.spinner.hide('templatesList');
      // console.log(err);
    })
  }

  onRowReorder(event) {
    var reordered_array = [];
    var reordered_Object = {};
    for (let i = 0; i < this.templates.length; i++) {
      if (event.dragIndex < event.dropIndex) {
        if (i >= event.dragIndex && i <= event.dropIndex) {
          var template_id = this.templates[i].id;
          var order_num = i.toString();
          reordered_Object = { template_id: template_id, order_num: order_num };
          reordered_array.push(reordered_Object);
        }
      } else if (event.dragIndex > event.dropIndex) {
        if (i >= event.dropIndex && i <= event.dragIndex) {
          var template_id = this.templates[i].id;
          var order_num = i.toString();
          reordered_Object = { template_id: template_id, order_num: order_num };
          reordered_array.push(reordered_Object);
        }
      }

    }
    this.spinner.show();
    var token = localStorage.getItem("token");
    // console.log(reordered_array);
    var data = {
      "changedorder": reordered_array
    }
    this.templateService.redoderTemplate(token, data).subscribe((response: any) => {
      if (response["status"] == 404) {
        this.spinner.hide();
        // console.log(response);
      } else if (response["status"] == 200) {
        this.spinner.hide();
        // console.log(response);
      }
    }, (err) => {
      this.spinner.hide();
      // console.log(err);
    })
  }

  particularTag(id) {
    // this.show_No_TagSelected = false
    this.show_particularTemplateList = true;
    this.spinner.show('messageList');
    this.templateuser = [];
    this.templateId_filter = id; //will be used when we add a new message
    // this.spinner.show('show_particularTemplateList_loader');
    var token = localStorage.getItem("token");
    this.templateService.getTemplateUser(id, token).subscribe((response: any) => {
      if (response["status"] == 404) {
        // console.log(response);
      } else if (response["status"] == 200) {
        let templateuserTemp = response["templateMessageDetails"];
        // console.log(templateuserTemp)
        this.templateuser = templateuserTemp;
        this.templateuserTemp = templateuserTemp;
        this.spinner.hide('messageList');
        this.show_particularTemplateList_Nouser = templateuserTemp.length > 0 ? false : true;

        // console.log(response);
      }
    }, (err) => {
      // console.log(err);
    })
  }

  showAllTemplates(){
    this.show_particularTemplateList = false;
  }

  onRowEditInit(rowdata, index) {
    for (let j = 0; j < this.templates.length; j++) {
      if (j != index) {
        $("#row_" + j).parents("tr").prop('disabled', true);
      }
    }
  }

  onRowEditSave(rowdata) {
    this.submit_updateTemplate(rowdata.name, rowdata.id);
  }

  submit_updateTemplate(name, id) {
    this.spinner.show();
    var data = {
      "name": name,
    }
    var token = localStorage.getItem("token")
    this.templateService.updateTemplate(token, data, id).subscribe((response: any) => {
      if (response.status == 200) {
        this.spinner.hide();
      } else if (response.status == 404) {
      }
    }, (err) => {
      this.spinner.hide();
      // console.log(err);
    })
  }

  onRowEditCancel(rowdata, index) {
    this.deleteTempalte(index, rowdata.id);
  }

  deleteTempalte(index, id) {
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
        this.templateService.deleteTempalte(token, id).subscribe((response: any) => {
          if (response["status"] == 404) {
            this.spinner.hide();
            // console.log(response);
          } else if (response["status"] == 200) {
            this.spinner.hide();
            sweetAlert.fire(
              'Deleted!',
              'This Template is deleted.',
              'success'
            ).then((result) => {
              if (result) {
                let JSONindex = this.templates.findIndex(x => x.id == id);
                this.templates.splice(JSONindex, 1);
                this.emptytemplates = this.templates.length > 0 ? false : true;;
              }
            })
            // console.log(response);
          }
        }, (err) => {
          this.spinner.hide();
          // console.log(err);
        })
      }
    })
  }

  addTempalte() {
    // this.data.reset();
    this.displayaddTemplateModal = true;
  }


  exportTemplateMessages(){
    var token = localStorage.getItem("token")
    this.templateService.getTemplatesWithMessage(token).subscribe((response: any) => {

      if(response.status == 200){
        var rows = [["Tamplate Name", "Messages"]];

        response.templatesMessages.forEach(function(oneRow){
          var temp = [];
          temp.push("\""+oneRow.name+"\"");
          if(oneRow.message != null)
          temp.push("\""+oneRow.message+"\"");
          else
          temp.push("");
          rows.push(temp); 
        })
        let csvContent = "";

        rows.forEach(function(rowArray) {
            let row = rowArray.join(",");
            csvContent += row + "\r\n";
        });


        var downloadLink = document.createElement("a");
        var blob = new Blob(["\ufeff", csvContent]);
        var url = URL.createObjectURL(blob);
        downloadLink.href = url;
        downloadLink.download = "Messages ("+moment(new Date()).format('DD-MMMM-YYYY')+").csv";

        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);



        // var encodedUri = encodeURI(csvContent);
        // window.open(encodedUri);
      }
    }, (err) => {
      this.spinner.hide('templatesList');
      // console.log(err);
    })
  }

  onchangeInput(event) {
    // event.target.value; 
    // if (event.target.value == "") {
    //   // this.loaderOn = true;
    //   var querryParam1 = { queryParams: { type: this.templateId_filter } }
    //   this.router.navigate(['/dashboard'], querryParam1);
    // } else {
    //   // this.loaderOn = false;
    //   var querryParam = { queryParams: { type: this.templateId_filter, q: event.target.value } }
    //   this.router.navigate(['/dashboard'], querryParam);
    // }
  }

  get h() { return this.data.controls; }
  get g() { return this.data_message.controls; }
  
  classForValidation(type) {
    if (this.firstLoad) {
      return
    }
    else if (this.submitted && this.h.template_name.errors && (type == 'template_name')) {
      return 'is-invalid';
    } else {
      return 'is-valid';
    }
  }

  submit() {

    if(this.data.value.template_name.trim()){
      this.spinner.show();
      this.firstLoad = false;
      this.submitted = true;
      if (this.data.invalid) {
        this.spinner.hide();
        return;
      }
      if(this.addingTemplate){
        return
      }
      var data = {
        "name": this.data.value.template_name,
      }
      var token = localStorage.getItem("token")
      this.addingTemplate = true;
      this.templateService.addTemplate(token, data).subscribe((response: any) => {
        if (response.status == 200) {
          // var insert_id = parseInt(this.templates[this.templates.length - 1].id) + 1;
          var data = {
            "id": response.id,
            "name": this.data.value.template_name
          }
          this.templates.push(data);
          this.emptytemplates = this.templates.length > 0 ? false : true;
          this.msgs = [];
          this.msgs.push({
            severity: 'success', summary: 'Success Message', detail: response.msg
          });
          this.submitted = false;
          $("#template_name").removeClass('is-invalid');
          $("#template_name").removeClass('is-valid');
          this.data.reset();
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
        this.addingTemplate = false;
      }, (err) => {
        this.spinner.hide();
        // console.log(err);
        this.addingTemplate = false;
      })
    }else{
      this.msgs = [];
      this.msgs.push({
        severity: 'error', summary: 'Error Message', detail: "Please enter template name"
      });
      setTimeout(() => {
        this.msgs = [];
      }, 3000)
    }
  }


  classForValidation_message(type) {
    if (this.firstLoad_message) {
      return
    }
    else if (this.submitted_message && this.g.message.errors && (type == 'message')) {
      return 'is-invalid';
    } else {
      return 'is-valid';
    }
  }

  addTempaltemessage() {
    this.data.reset();
    this.displayaddMessageModal = true;
  }

  submit_addmessage() {
    this.spinner.show();
    this.firstLoad_message = false;
    this.submitted_message = true;
    if (this.data_message.invalid) {
      this.spinner.hide();
      return;
    }
    if(this.addingMessage){
      return
    }
    var data = {
      "template_id": this.templateId_filter,
      "message": this.data_message.value.message,
    }
    var token = localStorage.getItem("token")
    this.addingMessage = true;
    this.templateService.addTemplateMessage(token, data).subscribe((response: any) => {
      if (response.status == 200) {
        // var insert_id = this.templateuser.length > 0?parseInt(this.templateuser[this.templateuser.length - 1].id) + 1:"";
        // var insert_id_tempaleMessage = this.templateuser.length > 0?parseInt(this.templateuser[this.templateuser.length - 1].template_id) + 1:"";
        // var data = {
        //   "id": insert_id.toString(),
        //   "template_id": insert_id_tempaleMessage.toString(),
        //   "message": this.data_message.value.message
        // }
        var data = {
          "id": response.msg_id,
          "template_id": this.templateId_filter,
          "message": this.data_message.value.message
        }
        this.templateuser.push(data);
        this.show_particularTemplateList_Nouser = false;
        this.lmsgs = [];
        this.lmsgs.push({
          severity: 'success', summary: 'Success Message', detail: response.
            msg
        });
        this.submitted_message = false;
        $("#message").removeClass('is-invalid');
        $("#message").removeClass('is-valid');
        this.data_message.reset();
        setTimeout(() => {
          this.lmsgs = [];
        }, 3000)
        this.spinner.hide();
      } else if (response.status == 404) {
        this.lmsgs = [];
        this.lmsgs.push({
          severity: 'error', summary: 'Error Message', detail: response.
            msg
        });
        setTimeout(() => {
          this.lmsgs = [];
        }, 3000)
        this.spinner.hide();
      }
      this.addingMessage = false;
    }, (err) => {
      this.spinner.hide();
      this.addingMessage = false;
      //console.log(err);
    })
  }

  submit_updatemessage(index, id, templateMessage_id, template_message) {
    this.spinner.show();
    this.updateTag_index = index;
    this.templateId = id;
    this.templateMessage_id = templateMessage_id;
    var messageTemp = $("#templateMessage_" + index).val();
    var message = messageTemp.replace(/^\s+|\s+$/gm, '');
    var data = {
      "template_id": this.templateId_filter,
      "message": message,
    }
    var token = localStorage.getItem("token")
    this.templateService.updateTemplateMessage(token, data, id).subscribe((response: any) => {
      if (response.status == 200) {
        
        // this.templateList();
        this.templateuser[this.updateTag_index]["message"] = message;
        // this.lmsgs = [];
        // this.lmsgs.push({
        //   severity: 'success', summary: 'Success Message', detail: response.
        //     msg
        // });
        // setTimeout(() => {
        //   this.lmsgs = [];
        // }, 3000)
        this.messageService.add({severity:'success', summary:response.msg, detail:''});
        this.spinner.hide();
      } else if (response.status == 404) {
        this.lmsgs = [];
        this.lmsgs.push({
          severity: 'error', summary: 'Error Message', detail: response.
            msg
        });
        setTimeout(() => {
          this.lmsgs = [];
        }, 3000)
        this.spinner.hide();
      }
    }, (err) => {
      this.spinner.hide();
      // console.log(err);
    })
  }

  deleteTempalteMessage(index, id) {
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
        this.templateService.deleteTempalteMessage(token, id).subscribe((response: any) => {
          if (response["status"] == 404) {
            this.spinner.hide();
            // console.log(response);
          } else if (response["status"] == 200) {
            this.spinner.hide();
            this.templateuser.splice(index, 1);
            sweetAlert.fire(
              'Deleted!',
              'This Template Message is deleted.',
              'success'
            )
            // console.log(response);
          }
        }, (err) => {
          this.spinner.hide();
          // console.log(err);
        })
      }
    })
  }

  onRowReorderMessage(event) {
    var reordered_array = [];
    var reordered_Object = {};
    for (let i = 0; i < this.templateuser.length; i++) {
      if (event.dragIndex < event.dropIndex) {
        if (i >= event.dragIndex && i <= event.dropIndex) {
          var message_id = this.templateuser[i].id;
          var order_num = i.toString();
          reordered_Object = { message_id: message_id, order_num: order_num };
          reordered_array.push(reordered_Object);
        }
      } else if (event.dragIndex > event.dropIndex) {
        if (i >= event.dropIndex && i <= event.dragIndex) {
          var message_id = this.templateuser[i].id;
          var order_num = i.toString();
          reordered_Object = { message_id: message_id, order_num: order_num };
          reordered_array.push(reordered_Object);
        }
      }

    }
    this.spinner.show();
    var token = localStorage.getItem("token");
    // console.log(reordered_array);
    var data = {
      "changedorder": reordered_array
    }
    this.templateService.redoderMessage(token, data).subscribe((response: any) => {
      if (response["status"] == 404) {
        this.spinner.hide();
        // console.log(response);
      } else if (response["status"] == 200) {
        this.spinner.hide();
        // console.log(response);
      }
    }, (err) => {
      this.spinner.hide();
      // console.log(err);
    })
  }

  eventHandler(event: string[]) {
    console.log(event)
    console.log(event.length)

    this.templates = event; 
    this.emptytemplates = this.templates.length > 0 ? false : true;
    // this.templates = {};
    // for (let i = 0; i < this.templates.length; i++) {
      // if (i < 9) {
        // this.templates.push(this.templates[i]);
      // }
    // }
  }

}
