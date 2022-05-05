import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class RefreshTokenService {
    constructor(private httpClient: HttpClient) { }

    /* REFRESH TOKEN API  */
    refreshToken(token) {
        let headers: HttpHeaders = new HttpHeaders();
        headers = headers.append('Accept', 'application/json');
        headers = headers.append('token',  token);
        return this.httpClient.get(`${environment.apiUrl}refresh_token`, { headers: headers });
    }

    /* ACCOUNT LIST AND PLANS API  */
    getAccountList(token) {
        let headers: HttpHeaders = new HttpHeaders();
        headers = headers.append('Accept', 'application/json');
        headers = headers.append('token',  token);
        return this.httpClient.get(`${environment.apiUrl}me`, { headers: headers });
    }

}