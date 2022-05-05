import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class SentFriendRequestService {

  constructor(private httpClient: HttpClient) { }

  /*Get sent friend requests*/
  getSentFriendRequest(params,token, fb_account){
    let data = {"fb_account_id":fb_account,'params':params};
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Token', token);

    return this.httpClient.post(`${environment.apiUrl}getSentFriendRequestWithCount`,data, { headers: headers });
  }

  /*delete single request*/
  deleteSentFriendRequest(token, id){

    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Token', token);
    return this.httpClient.get(`${environment.apiUrl}sentFriendRequestDelete&id=`+id, { headers: headers }); 
  }
  /*delete multiple requests*/
  deleteMultipleSentFriendRequest(token, ids){
    let data = {"ids":ids};
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Token', token);

    return this.httpClient.post(`${environment.apiUrl}deleteMultipleSentFriendRequest`,data, { headers: headers });
  }

}
