import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { Component, inject, OnInit, OutputEmitterRef } from '@angular/core';
import { LightweightChartComponent } from "../chart/chart.component";
import { SelectPreviewComponent } from "../select/select.component";
import { OilCompaniesDataService } from '../../services/oil-companies-data.service';

import { BadgePreviewComponent } from "../badges/badge.component";
import { FormGroup, FormBuilder } from '@angular/forms';

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

  _oilData = inject(OilCompaniesDataService);
  filterOptionsFg!: FormGroup;

  readonly fb = inject(FormBuilder);

  ngOnInit(): void {
    this._oilData.getRecords();

    this._oilData._oil_records$.subscribe((res) => {

      if(res.length > 0)
      this.oilCompanies = [...new Set(res.map((x) => { return { label: x.oil_companies_, value: x.oil_companies_ } }))];
    })

    this.filterOptionsFg = this.fb.group({
      select: [],
    });
  }

  selectedCompanies(event: any) {
    this._selectedCompanies = event;
  }

}
