import { Component, inject, OnInit } from '@angular/core';
import { AllCommunityModule, ColDef, ModuleRegistry } from 'ag-grid-community';

import { RowGroupingModule } from 'ag-grid-enterprise';

import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import { OilCompaniesDataService } from '../../services/oil-companies-data.service';

import { Match, OilDataRecord } from '../../types/records.type';
// import type { ColDef } from 'ag-grid-community'; 

ModuleRegistry.registerModules([AllCommunityModule, RowGroupingModule]);
@Component({
  selector: 'grid',
  imports: [AgGridAngular],
  templateUrl: './grid.component.html'
})
export class GridComponent implements OnInit {
  ocd = inject(OilCompaniesDataService);

  // Row Data: The data to be displayed.
  rowData!: OilDataRecord[];

  // Column Definitions: Defines the columns to be displayed.
  colDefs: ColDef[] = [
    { field: "oil_companies_", rowGroup: true, hide: true },
    { field: "_month_" },
    { field: "year", rowGroup: true, hide: true },
    { field: "quantity_000_metric_tonnes_" }
  ];

  ngOnInit(): void {
    this.ocd._oil_records$.subscribe((_ords) => {

      let value = this.extractMatches(_ords);
      this.rowData = [...new Set(_ords.map((x) => x))];

      let ac = [...new Set(_ords.map((x) => { 
        return { 
          state: x.oil_companies_.split(',')[1],
          oil_companies_: x.oil_companies_, 
          _month_: x._month_, 
          quantity_000_metric_tonnes_: x.quantity_000_metric_tonnes_,
          year: x.year 
        } 
      }))];

      console.log(ac)
    })
  }

  extractMatches(data: OilDataRecord[]): Record<string, Match[]> {
    const result: Record<string, Match[]> = {}; // Explicit type for the result

    [...new Set(data.map((x) => x.oil_companies_))]?.forEach((searchStr) => {
      const matches = data
        .filter((item) => item.oil_companies_.includes(searchStr))
        .map((item) => {
          const time = (Math.floor(new Date(`${item._month_}, ${item.year}`).getTime() / 1000));
          const value = parseFloat(item.quantity_000_metric_tonnes_) || 0;
          const qmt = item.quantity_000_metric_tonnes_;
          const oc = item.oil_companies_;
          const month = item._month_;
          const year = item.year;

          return { time, value, qmt, oc, month, year };
        })
        .sort((a, b) => a.time - b.time);

      if (matches.length > 0) {
        result[searchStr] = matches; // No error because of explicit typing
      }
    });

    return result;
  }
}