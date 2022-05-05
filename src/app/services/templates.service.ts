import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
	providedIn: 'root'
})
export class TemplateService {
	constructor(private httpClient: HttpClient) { }

	/* TEMPLATE LIST API  */
	getTemplate(token) {
		let headers: HttpHeaders = new HttpHeaders();
		headers = headers.append('Accept', 'application/json');
		headers = headers.append('Token', token);
		return this.httpClient.get(`${environment.apiUrl}getTemplate`, { headers: headers });
	}


	/* TEMPLATE LIST WITH MESSAGE  */
	getTemplatesWithMessage(token) {
		let headers: HttpHeaders = new HttpHeaders();
		headers = headers.append('Accept', 'application/json');
		headers = headers.append('Token', token);
		return this.httpClient.get(`${environment.apiUrl}getTemplatesWithMesage`, { headers: headers });
	}

	/* TEMPLATE LIST API  */
	getTemplateUser(id, token) {
		let headers: HttpHeaders = new HttpHeaders();
		headers = headers.append('Accept', 'application/json');
		headers = headers.append('Token', token);
		return this.httpClient.get(`${environment.apiUrl}getTemplateMessage&template_id=` + id, { headers: headers });
	}

	/* ADD TEMPLATE API  */
	addTemplate(token, data) {
		let headers: HttpHeaders = new HttpHeaders();
		headers = headers.append('Accept', 'application/json');
		headers = headers.append('Token', token);
		return this.httpClient.post(`${environment.apiUrl}saveTemplate`, data, { headers: headers });
	}

	/* UPDATE TEMPLATE API  */
	updateTemplate(token, data, id) {
		let headers: HttpHeaders = new HttpHeaders();
		headers = headers.append('Accept', 'application/json');
		headers = headers.append('Token', token);
		return this.httpClient.post(`${environment.apiUrl}saveTemplate&id=` + id, data, { headers: headers });
	}

	/* DELETE TEMPLATE API  */
	deleteTempalte(token, id) {
		let headers: HttpHeaders = new HttpHeaders();
		headers = headers.append('Accept', 'application/json');
		headers = headers.append('Token', token);
		return this.httpClient.get(`${environment.apiUrl}templateDelete&id=` + id, { headers: headers });
	}

	/* ADD TEMPLATE MESSAGE API  */
	addTemplateMessage(token, data) {
		let headers: HttpHeaders = new HttpHeaders();
		headers = headers.append('Accept', 'application/json');
		headers = headers.append('Token', token);
		return this.httpClient.post(`${environment.apiUrl}saveMessage`, data, { headers: headers });
	}

	/* UPDATE TEMPLATE MESSAGE  API  */
	updateTemplateMessage(token, data, id) {
		let headers: HttpHeaders = new HttpHeaders();
		headers = headers.append('Accept', 'application/json');
		headers = headers.append('Token', token);
		return this.httpClient.post(`${environment.apiUrl}saveMessage&id=` + id, data, { headers: headers });
	}

	/* DELETE TEMPLATE MESSAGE  API  */
	deleteTempalteMessage(token, id) {
		let headers: HttpHeaders = new HttpHeaders();
		headers = headers.append('Accept', 'application/json');
		headers = headers.append('Token', token);
		return this.httpClient.get(`${environment.apiUrl}templateMessageDelete&id=` + id, { headers: headers });
	}
      
	/* REORDER TEMPLATE API  */
	  redoderTemplate(token,data) {
			let headers: HttpHeaders = new HttpHeaders();
			headers = headers.append('Accept', 'application/json');
			headers = headers.append('Token', token);
			return this.httpClient.post(`${environment.apiUrl}change_template_order`, data,{ headers: headers });
		  }
	  
      
	/* REORDER MESSAGE API  */
	  redoderMessage(token,data) {
			let headers: HttpHeaders = new HttpHeaders();
			headers = headers.append('Accept', 'application/json');
			headers = headers.append('Token', token);
			return this.httpClient.post(`${environment.apiUrl}change_message_order`, data,{ headers: headers });
		  }
	  

}