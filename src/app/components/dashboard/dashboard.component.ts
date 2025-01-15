import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { ChangeDetectorRef, Component, inject, OnInit, OutputEmitterRef } from '@angular/core';
import { LightweightChartComponent } from "../chart/chart.component";
import { SelectPreviewComponent } from "../select/select.component";
import { OilCompaniesDataService } from '../../services/oil-companies-data.service';

import { BadgePreviewComponent } from "../badges/badge.component";
import { FormGroup, FormBuilder } from '@angular/forms';
import { OilDataRecord } from '../../types/records.type';

@Component({
  selector: 'app-dashboard',
  imports: [MatSidenavModule, MatButtonModule, LightweightChartComponent, SelectPreviewComponent, BadgePreviewComponent],
  providers: [OilCompaniesDataService],
  templateUrl: './dashboard.component.html',
  styles: ``
})
export class DashboardComponent implements OnInit {
  oilCompanies!: { label: string; value: string }[];
  
  _selectedCompanies: string[] = [];
  _oilDataRecords!: OilDataRecord[];

  _oilData = inject(OilCompaniesDataService);
  filterOptionsFg!: FormGroup;

  readonly fb = inject(FormBuilder);

  ngOnInit(): void {
    this._oilData.getRecords();

    this._oilData._oil_records$.subscribe((res) => {
      this._oilDataRecords = res;

      if(res.length > 0)
      this.oilCompanies = [...new Set(res.map((x) => { return { label: x.oil_companies_, value: x.oil_companies_ } }))];
    })

    this.filterOptionsFg = this.fb.group({
      select: [],
    });
  }

  cdr = inject(ChangeDetectorRef);
  oilCompaniesWithData!: any
  selectedCompanies(event: any) {
    this._selectedCompanies = event;

    this.oilCompaniesWithData = (this.extractMatches(event, this._oilDataRecords));
    // this.cdr.detectChanges();
    console.log(this.oilCompaniesWithData)
  }
    
  extractMatches(x: string[], data: DataItem[]): Record<string, Match[]> {
    const result: Record<string, Match[]> = {}; // Explicit type for the result
  
    x?.forEach((searchStr) => {
      const matches = data
        .filter((item) => item.oil_companies_.includes(searchStr))
        .map((item) => {
          const time = (Math.floor(new Date(`${item._month_}, ${item.year}`).getTime() / 1000));
          const value = parseFloat(item.quantity_000_metric_tonnes_) || 0;
          return { time, value };
        })
        .sort((a, b) => a.time - b.time);
  
      if (matches.length > 0) {
        result[searchStr] = matches; // No error because of explicit typing
      }
    });
  
    return result;
  }
  

}

interface DataItem {
  _month_: string;
  year: string;
  oil_companies_: string;
  quantity_000_metric_tonnes_: string;
}

interface Match {
  time: number;
  value: number;
}