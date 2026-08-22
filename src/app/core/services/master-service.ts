import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MasterService {

 omSearchChnages$: Subject<string> = new Subject<string>();

}
