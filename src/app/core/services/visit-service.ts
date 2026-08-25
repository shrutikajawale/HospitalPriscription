import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { GlobalConstant } from '../constant/GlobalConstant';
import { IVisitList, IVisitModel } from '../models/interfaces/IVisit.model';

@Injectable({ providedIn: 'root' })
export class VisitService {
  http = inject(HttpClient);

  private visitApiUrl = environment.API_URL + GlobalConstant.API_METHODS.VISIT;

  createVisit(visitObj: IVisitModel): Observable<IVisitModel> {
    return this.http.post<IVisitModel>(this.visitApiUrl, visitObj);
  }

  getAllVisits(): Observable<IVisitList[]> {
    return this.http.get<IVisitList[]>(this.visitApiUrl);
  }

  getVisitById(id: number): Observable<IVisitModel> {
    return this.http.get<IVisitModel>(`${this.visitApiUrl}/${id}`);
  }

  getPatientVisitById(id: number): Observable<IVisitList[]> {
    return this.http.get<IVisitList[]>(environment.API_URL + GlobalConstant.API_METHODS.VISIT_BY_PATIENT + id )
  }

  updateVisit(visitId: number, visitObj: IVisitModel): Observable<IVisitModel> {
    return this.http.put<IVisitModel>(`${this.visitApiUrl}/${visitId}`, visitObj);
  }

  deleteVisit(visitId: number): Observable<void> {
    return this.http.delete<void>(`${this.visitApiUrl}/${visitId}`);
  }

  addPrescription(obj:any) {
    return this.http.post(environment.API_URL + GlobalConstant.API_METHODS.PRESCRIPTION, obj )
  }

  chnageStatus(obj:any,id:number) {
    return this.http.put(environment.API_URL + GlobalConstant.API_METHODS.VISIT+ "/"+id + "/status", obj )
  }
}
