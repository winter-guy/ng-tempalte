import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';

import { SelectPreviewComponent } from "../select/select.component";
import { OilCompaniesDataService } from '../../services/oil-companies-data.service';

import { BadgePreviewComponent } from "../badges/badge.component";
import { FormGroup, FormBuilder } from '@angular/forms';
import { Match, OilDataRecord, SeriesSet } from '../../types/records.type';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';

import { GridComponent } from "../grid/grid.component";
import { MultiLineChartComponent } from "../chart/linechart.component";

@Component({
  selector: 'app-dashboard',
  imports: [
    MatSidenavModule, 
    MatButtonModule, 
    SelectPreviewComponent, 
    BadgePreviewComponent,
    HlmButtonDirective, 
    GridComponent, 
    MultiLineChartComponent
  ],
  providers: [OilCompaniesDataService],
  templateUrl: './dashboard.component.html',
  styles: ``
})
export class DashboardComponent implements OnInit {
  oilCompanies: { label: string; value: string }[] = [
    {
      label: 'IOCL-BARAUNI,BIHAR',
      value: 'IOCL-BARAUNI,BIHAR'
    },
    {
      label: 'IOCL-BONGAIGAON,ASSAM',
      value: 'IOCL-BONGAIGAON,ASSAM'
    },
    {
      label: 'ONGC TOTAL',
      value: 'ONGC TOTAL'
    }
  ];

  _selectedCompanies: string[] = [];
  _oilDataRecords!: OilDataRecord[];

  _oilData = inject(OilCompaniesDataService);
  filterOptionsFg!: FormGroup;

  readonly fb = inject(FormBuilder);

  ngOnInit(): void {
    this._oilData.getRecords();

    this._oilData._oil_records$.subscribe((res) => {
      this._oilDataRecords = res;

      if (res.length > 0)
        this.oilCompanies = [...new Set(res.map((x) => x.oil_companies_))]?.map((searchStr) => {
          return { value: searchStr, label: searchStr }
        });
    })


    this.filterOptionsFg = this.fb.group({
      select: [],
    });
  }

  cdr = inject(ChangeDetectorRef);
  _oilCompaniesWithData!: any
  _series!: SeriesSet[];
  _seried_data!: any;

  selectedCompanies(event: string[]) {
    this._selectedCompanies = event;
    
    this._series = event?.map((x): SeriesSet => {
      return {
        type: "line",
        xKey: "time",
        yKey: x,
        yName: x,
        interpolation: { type: "smooth"}
      }
    });

    this._seried_data = this.composeSeries(this._oilDataRecords, event);
  }

  composeSeries(odr: OilDataRecord[], selected: string[]): { [key: string]: number | string; time: number; }[] {
    const timeline = [...new Set(odr.map((x) => x.time))].sort((a, b) => a - b);

    const transformedData = timeline.map((time) => {
      const matchingRecords = odr.filter(
        (item) => item.time === time && selected?.includes(item.oil_companies_)
      );
  
      return matchingRecords.reduce(
        (acc, item) => {
          acc[item.oil_companies_] = Number(item.quantity_000_metric_tonnes_);
          return acc;
        },
        { time } as { time: number; [key: string]: number; }
      );
    });
  
    return transformedData;
  }
  

  extractMatches(x: string[], data: OilDataRecord[]): Record<string, Match[]> {
    // Explicit type for the result
    const result: Record<string, Match[]> = {}; 

    x?.forEach((searchStr) => {
      const matches = data
        .filter((item) => item.oil_companies_.includes(searchStr))
        .map((item) => {
          const time = (Math.floor(new Date(`${item._month_}, ${item.year}`).getTime() / 1000));
          const value = Number(item.quantity_000_metric_tonnes_) || 0;
          return { time, value };
        })
        .sort((a, b) => a.time - b.time);

      if (matches.length > 0) {
        result[searchStr] = matches;
      }
    });

    return result;
  }
}

