import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  constructor(private httpClient: HttpClient) { }
  
/* GET CONTACT LIST API  */
  getContactList(token) {
		let headers: HttpHeaders = new HttpHeaders();
		headers = headers.append('Accept', 'application/json');
		headers = headers.append('Token', token);
		return this.httpClient.get(`${environment.apiUrl}getContacts`, { headers: headers });
	  }
  
/* ADD NOTES API  */
  addNotes(token,data) {
		let headers: HttpHeaders = new HttpHeaders();
		headers = headers.append('Accept', 'application/json');
		headers = headers.append('Token', token);
		return this.httpClient.post(`${environment.apiUrl}saveUserNote`,data, { headers: headers });
	  }
  
/* UPDATE NOTES API  */
  updateNotes(token,data,id) {
		let headers: HttpHeaders = new HttpHeaders();
		headers = headers.append('Accept', 'application/json');
		headers = headers.append('Token', token);
		return this.httpClient.post(`${environment.apiUrl}saveUserNote&id=`+id,data, { headers: headers });
	  }
  
/* DELETE NOTES API  */
  deleteNotes(token,id) {
		let headers: HttpHeaders = new HttpHeaders();
		headers = headers.append('Accept', 'application/json');
		headers = headers.append('Token', token);
		return this.httpClient.get(`${environment.apiUrl}deleteUserNote&id=`+id, { headers: headers });
	  }
  
/* GET NOTES API  */
  getNotes(token,data) {
		let headers: HttpHeaders = new HttpHeaders();
		headers = headers.append('Accept', 'application/json');
		headers = headers.append('Token', token);
		return this.httpClient.post(`${environment.apiUrl}getnotes`,data, { headers: headers });
	  }
  
/* UPDATE TAGS API  */
  updateTags(token,data) {
		let headers: HttpHeaders = new HttpHeaders();
		headers = headers.append('Accept', 'application/json');
		headers = headers.append('Token', token);
		return this.httpClient.post(`${environment.apiUrl}update_tag_from_popup`,data, { headers: headers });
	  }

}