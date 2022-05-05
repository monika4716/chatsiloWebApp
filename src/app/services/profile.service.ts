import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ProfileService {
    constructor(private httpClient: HttpClient) { }

    /* UPDATE PROFILE API  */
    updateProfile(token,data) {
        let headers: HttpHeaders = new HttpHeaders();
        headers = headers.append('Accept', 'application/json');
        headers = headers.append('token',  token);
        return this.httpClient.post(`${environment.apiUrl}refresh_token`,data, { headers: headers });
    }

    /* DELTE ACCOUNT API  */
    deleteAccount(token,data) {
        let headers: HttpHeaders = new HttpHeaders();
        headers = headers.append('Accept', 'application/json');
        headers = headers.append('token',  token);
        return this.httpClient.post(`${environment.apiUrl}unlinkFbAccount`,data, { headers: headers });
    }

    /* MAKE ACCOUNT PRIMARY API  */
    makeAccountPrimary(token,data) {
        let headers: HttpHeaders = new HttpHeaders();
        headers = headers.append('Accept', 'application/json');
        headers = headers.append('token',  token);
        return this.httpClient.post(`${environment.apiUrl}makePrimaryFbAccount`,data, { headers: headers });
    }

}