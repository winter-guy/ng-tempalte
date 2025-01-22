import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { loadItems, loadItemsSuccess, loadItemsFailure } from './app.actions';
import { OilCompaniesDataService } from '../services/oil-companies-data.service';
import { OilData, OilDataRecord } from '../types/records.type';

@Injectable()
export class AppEffects {
    private actions$ = inject(Actions)
    constructor(private appService: OilCompaniesDataService) { }

    loadItems$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadItems),
            mergeMap(() =>
                this.appService._getRecords().pipe(
                    map((items) => loadItemsSuccess({ items: this.getOilRecords(items)})),
                    catchError((error) => of(loadItemsFailure({ error })))
                )
            )
        )
    );

    getOilRecords(od: OilData): OilDataRecord[]  {
        return od.records.map(x => {
            return { ...x, time: (Math.floor(new Date(`${x._month_}, ${x.year}`).getTime() / 1000)) }
        })
    }
}
