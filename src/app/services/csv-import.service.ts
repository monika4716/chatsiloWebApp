import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CSVImportService {
    constructor(private httpClient: HttpClient) { }

    /* IMPORT CSV API  */
    importCSV(action,token,data) {
        let headers: HttpHeaders = new HttpHeaders();
        headers = headers.append('Accept', 'application/json');
        headers = headers.append('token',  token);
        return this.httpClient.post(`${environment.apiUrl}`+action,data, { 
            headers: headers, 
            reportProgress: true,
            observe: "events" });
    }

}