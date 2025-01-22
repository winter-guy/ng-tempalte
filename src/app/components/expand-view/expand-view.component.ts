import { ChangeDetectionStrategy, Component, inject, model, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HlmButtonModule } from '@spartan-ng/ui-button-helm';

import { AgCharts } from 'ag-charts-angular';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-enterprise';
import { AgChartOptions } from "ag-charts-enterprise";
import { Dialog, DIALOG_DATA, DialogModule, DialogRef } from '@angular/cdk/dialog';
import { OilCompaniesDataService } from '../../services/oil-companies-data.service';
import { OilDataRecord } from '../../types/records.type';

export interface DialogData {
  name: string;
}

/**
 * @title Dialog Overview
 */
@Component({
  template: ` <button hlmBtn variant="link" size="sm" (click)="openDialog()">{{ value }}</button>`,
  imports: [MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, HlmButtonModule, DialogModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CellRendererDialog implements ICellRendererAngularComp {
  readonly animal = signal('');
  readonly name = model('');
  readonly dialog = inject(Dialog);

  value: any;

  agInit(params: ICellRendererParams<any, any, any>): void {
    this.value = params.value;
  }

  refresh(params: ICellRendererParams<any, any, any>): boolean {
    params;
    return false;
  }


  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      minWidth: '300px',
      height: 'auto',
      data: { name: this.value, animal: this.animal() }
    });

    dialogRef.closed.subscribe((result) => {
      console.log('The dialog was closed');
      if (result !== undefined) {
        console.log(result)
      }
    });
  }
}



@Component({
  templateUrl: './expand-view.component.html',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,

    AgCharts
  ],
  providers: [OilCompaniesDataService]
})
export class DialogOverviewExampleDialog implements OnInit {
  readonly dialogRef = inject(DialogRef<DialogOverviewExampleDialog>);
  readonly data = inject<DialogData>(DIALOG_DATA);
  // readonly animal = model(this.data.prop);
  readonly _oilData = inject(OilCompaniesDataService);

  public options!: AgChartOptions;
  ngOnInit(): void {
    this._oilData.getRecords();

    this._oilData._oil_records$.subscribe((res) => {
      this.options = {
        data: res.filter((x) => (x.oil_companies_ == this.data.name)).map((x) => {
          return {
            year: x.year,
            month: x._month_,
            quantity: x.quantity_000_metric_tonnes_/10
          }
        }),
        title: {
          text: this.data.name,
        },
        subtitle: {
          text: `(values are in metric tonnes * 10)`
        },
        series: [
          {
            type: "heatmap",
            xKey: "month",
            xName: "Month",
            yKey: "year",
            yName: "Year",
            colorKey: "quantity",
            colorName: "Quantity",
            colorRange: ["#43a2ca", "#a8ddb5", "#f0f9e8"],
          },
        ],
      };
    })
  }
}