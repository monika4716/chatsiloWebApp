import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpEventType, HttpErrorResponse } from "@angular/common/http";
import { CSVImportService } from '../../services/csv-import.service';
import { Message } from 'primeng/api';
import { Papa } from 'ngx-papaparse';
import { map, catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { NgxSpinnerService } from "ngx-spinner";
import * as $ from 'jquery';

@Component({
  selector: 'app-csv-import',
  templateUrl: './csv-import.component.html',
  styleUrls: ['./csv-import.component.css']
})
export class CsvImportComponent implements OnInit {
  @Input() headerType: string;
  @Input() action: string;
  @Input() Template_id: string;
  @Input() name: string;
  @Output() data: EventEmitter<string[]> = new EventEmitter<string[]>();
  Importmsgs: Message[] = [];
  fileLoaded: boolean = false;
  CSVProgressvalue: number = 0;
  displayCSVModal: boolean;

  constructor(
    private CSVImportService: CSVImportService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private papa: Papa) {
    this.headerType = "";
    this.action = "";
    this.Template_id = "";
    this.name = "";
  }

  ngOnInit(): void {
  }

  openCSVModal() {
    this.spinner.show("show_Popup_loader");
    this.displayCSVModal = true;
    this.Importmsgs = [];
    this.CSVProgressvalue = 0;
    this.fileLoaded = false
    setTimeout(() => {
      $('#csvimportForm').trigger("reset");
      this.spinner.hide("show_Popup_loader");
    }, 500)
  }

  handleFileSelect(evt) {
    var files = evt.target.files; // FileList object
    var file = files[0];
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = (event: any) => {
      var csv = event.target.result; // Content of CSV file
      this.fileLoaded = csv ? true : false;
      this.papa.parse(csv, {
        skipEmptyLines: true,
        header: true,
        complete: (results) => {
          console.log('Json Object', results.data);
          var data = results.data;
          //var key_name = Object.keys(data)[0];
          var key_name = data.some(obj => obj.hasOwnProperty(this.headerType));
          if (!key_name) {
            this.fileLoaded = false;
            this.Importmsgs = [];
            this.Importmsgs.push({
              severity: 'error', summary: 'Error Message', detail: "Please Correct the csv header name To " + this.headerType
            });
            setTimeout(() => {
              this.Importmsgs = [];
            }, 4000)
            $('#csvimportForm').trigger("reset");
            return
          }
          var changeKeydata:any;
          if(this.name == "Tags"){
            changeKeydata = data.map(({ ["Tag Name"] : tagName }) => ({ tagName }));
          }else if(this.name == "Templates"){
            changeKeydata = data.map(({ ["Template Name"] : templateName }) => ({ templateName }));
          }else if(this.name == "Messages"){
            changeKeydata = data.map(({ ["Message"] : message }) => ({ message })); 
          }
          var token = localStorage.getItem("token");
          var data_array = {
            "input": changeKeydata
          }
          if (this.headerType == "Message") {
            data_array["id"] = this.Template_id
          }
          this.CSVImportService.importCSV(this.action, token, data_array)
            .pipe(
              map((event: any) => {
                if (event.type == HttpEventType.UploadProgress) {
                  this.CSVProgressvalue = Math.round((100 / event.total) * event.loaded);
                } else if (event.type == HttpEventType.Response) {
                  if (event.body.status == 404) {
                    this.fileLoaded = false;
                    this.Importmsgs = [];
                    this.Importmsgs.push({
                      severity: 'error', summary: 'Error Message', detail: event.body.mesage
                    });
                    setTimeout(() => {
                      this.Importmsgs = [];
                      $('#csvimportForm').trigger("reset");
                    }, 4000)
                  } else if (event.body.status == 200) {
                    this.data.emit(event.body.tags);
                    this.Importmsgs = [];
                    this.Importmsgs.push({
                      severity: 'success', summary: 'Success Message', detail: "CSV Imported successfull"
                    });
                    /*                     setTimeout(() => {
                                          this.Importmsgs = [];
                                          $('#csvimportForm').trigger("reset");
                                          this.fileLoaded = false;
                                          this.CSVProgressvalue = 0;
                                        }, 4000) */
                  }
                }
              }),
              catchError((err: any) => {
                this.fileLoaded = false;
                this.Importmsgs = [];
                this.Importmsgs.push({
                  severity: 'error', summary: 'Error Message', detail: err.message
                });
                setTimeout(() => {
                  this.Importmsgs = [];
                  $('#csvimportForm').trigger("reset");
                }, 4000)
                return throwError(err.message);
              })
            ).toPromise();
        }
      });
    }
  }

  downloadMyFile() {
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    if (this.name == "Tags") {
      link.setAttribute('href', 'assets/file/sampleTags.csv');
    } else if (this.name == "Templates") {
      link.setAttribute('href', 'assets/file/sampleTemplates.csv');
    } else if (this.name == "Messages") {
      link.setAttribute('href', 'assets/file/sampleMessages.csv');
    }
    link.setAttribute('download', this.name+` sample.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

}
