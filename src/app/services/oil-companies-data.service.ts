import { inject, Injectable } from '@angular/core';
import { HttpService } from './http/http-client-wrapper.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { OilData, OilDataRecord } from '../types/records.type';

@Injectable()
export class OilCompaniesDataService {
  _hs = inject(HttpService);

  private _oilRecords = new BehaviorSubject<OilDataRecord[]>({} as OilDataRecord[]);
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
      this.setOilRecords(_od.records)
    })
  }

  getRecordsWithConsumptions() {
    this._hs.get<OilData>('/api/data').subscribe((_od) => {
      
    })
  }
}

