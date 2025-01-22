import { inject, Injectable } from '@angular/core';
import { HttpService } from './http/http-client-wrapper.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { OilData, OilDataRecord } from '../types/records.type';

@Injectable({
  providedIn: 'root'
})
export class OilCompaniesDataService {
  _hs = inject(HttpService);

  private _oilRecords = new BehaviorSubject<OilDataRecord[]>([]);
  public readonly _oil_records$: Observable<OilDataRecord[]> = this._oilRecords.asObservable();

  private _grcs = new BehaviorSubject<OilDataRecord[]>([]);
  public readonly retrieveGrcs = this._grcs.asObservable();

  public setGrcs(value: OilDataRecord[]) {
    this._grcs.next(value);
  }


  public setOilRecords(_value: OilDataRecord[]) {
    this._oilRecords.next(_value)
  }

  getRecords() {
    this._hs.get<OilData>('/api/data').subscribe((_od) => {
      this.setOilRecords(_od.records.map(x => {
        return {...x, time: (Math.floor(new Date(`${x._month_}, ${x.year}`).getTime() / 1000))}
      }))
    })
  }

  _getRecords() {
    return this._hs.get<OilData>('/api/data')
  }
}

