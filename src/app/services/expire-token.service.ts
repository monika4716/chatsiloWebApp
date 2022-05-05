import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ExpireTokenService {

  constructor(public router: Router) { }
  expireToken() {
    if (document.cookie) {
      if (document.cookie.split(";")[0].split("=")[0] == "email" || document.cookie.split(";")[1].split("=")[1] == "password") {
        var email = document.cookie.split(";")[0].split("=")[1];
        var password = document.cookie.split(";")[1].split("=")[1];
        if (email != "" && password != "") {
          localStorage.removeItem("token");
          this.router.navigate(['/']);
          return
        }
      }
    }
    Swal.fire({
      title: 'Your session has expired',
      showCancelButton: false,
      allowOutsideClick: false
    }).then((value) => {
      if (value.value == true) {
        this.router.navigate(['login']);
        localStorage.clear();
      }
    });
  }
}
