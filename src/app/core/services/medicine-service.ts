import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { GlobalConstant } from '../constant/GlobalConstant';

@Injectable({ providedIn: 'root' })
export class MedicineService {


    http = inject(HttpClient);
    
    constructor() {

    }

    getAllMedicine() {
        return this.http.get(environment.API_URL + "medicines")
    }

    getMedicineById(id: number) {
        return this.http.get(environment.API_URL + "medicines/" + id)
    }

    updateMedicine(id: number, medicine: unknown) {
        return this.http.put(environment.API_URL + "medicines/" + id, medicine)
    }

    deleteMedicine(id: number) {
        return this.http.delete(environment.API_URL + "medicines/" + id)
    }

    getSearchMedicine(text: string) {
        return this.http.get(environment.API_URL + GlobalConstant.API_METHODS.MEDICINE_SEARCH + text)
    }

    createMedicine() {
        
    }
}
