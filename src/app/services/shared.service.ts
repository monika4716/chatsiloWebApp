import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class SharedService {

    private product_name = '';
    private product_type = '';
    private store_url = '';
    private visiblity :boolean=false;
    object_values: any = new BehaviorSubject({
        "product_name": this.product_name,
        "product_type": this.product_type,
        "store_url": this.store_url,
        "visiblity": this.visiblity,
    });
    sharedMessage = this.object_values.asObservable();

    selectedFbAccountObject: any = new BehaviorSubject(null);
    selectedFbAccount = this.selectedFbAccountObject.asObservable();
    constructor() { }

    nextMessage(product_name: string, product_type: string, store_url: string, visiblity: boolean, ) {
        this.object_values.next({
            "product_name": product_name,
            "product_type": product_type,
            "store_url": store_url,
            "visiblity": visiblity,
        });
    }

    updateSelectedFbAccount(value){
        this.selectedFbAccountObject.next(value);
    }

}