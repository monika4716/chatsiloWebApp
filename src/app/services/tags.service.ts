import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TagsService {
  constructor(private httpClient: HttpClient) { }
  
/* TAG LIST API  */
  getTags(token, fb_account) {
	  	let data = {"fb_account_id":fb_account};
		let headers: HttpHeaders = new HttpHeaders();
		headers = headers.append('Accept', 'application/json');
		headers = headers.append('Token', token);
		return this.httpClient.post(`${environment.apiUrl}getTagsWithCounter`,data, { headers: headers });
      }
      
/* TAG USER LIST API  */
  getTagedUser(data,token) {
		let headers: HttpHeaders = new HttpHeaders();
		headers = headers.append('Accept', 'application/json');
		headers = headers.append('Token', token);
		return this.httpClient.post(`${environment.apiUrl}getTagUser`,data, { headers: headers });
	  }
      
/* ADD TAG API  */
  addTag(token,data) {
		let headers: HttpHeaders = new HttpHeaders();
		headers = headers.append('Accept', 'application/json');
		headers = headers.append('Token', token);
		return this.httpClient.post(`${environment.apiUrl}saveTag`,data, { headers: headers });
	  }
      
/* UPDATE TAG API  */
  updateTag(token,data,id) {
		let headers: HttpHeaders = new HttpHeaders();
		headers = headers.append('Accept', 'application/json');
		headers = headers.append('Token', token);
		return this.httpClient.post(`${environment.apiUrl}saveTag&id=`+id,data, { headers: headers });
	  }
      
/* DELETE TAG API  */
  deleteTag(token,id) {
		let headers: HttpHeaders = new HttpHeaders();
		headers = headers.append('Accept', 'application/json');
		headers = headers.append('Token', token);
		return this.httpClient.get(`${environment.apiUrl}tagDelete&id=`+id, { headers: headers });
	  }
      
/* REORDER TAG API  */
  redoderTag(token,data) {
		let headers: HttpHeaders = new HttpHeaders();
		headers = headers.append('Accept', 'application/json');
		headers = headers.append('Token', token);
		return this.httpClient.post(`${environment.apiUrl}change_tag_order`, data,{ headers: headers });
	  }

	/* TAG Counter API  */
	tagsCounter(token,data) {
		let headers: HttpHeaders = new HttpHeaders();
		headers = headers.append('Accept', 'application/json');
		headers = headers.append('Token', token);
		return this.httpClient.post(`${environment.apiUrl}tagCounter`, data,{ headers: headers });
	}

	changeTagColor(token, data){
		let headers: HttpHeaders = new HttpHeaders();
		headers = headers.append('Accept', 'application/json');
		headers = headers.append('Token', token);
		return this.httpClient.post(`${environment.apiUrl}changeTagColor`, data,{ headers: headers });
	}
  

}