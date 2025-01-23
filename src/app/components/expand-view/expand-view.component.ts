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

import { Observable } from 'rxjs';
import { AppState } from '../../state/app.reducer';
import { Store } from '@ngrx/store';
import { MatDrawer } from '@angular/material/sidenav';
import { ICrdType } from '../grid/grid.component';

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
  drawerRef!: MatDrawer;

  value: any;

  agInit(params: ICellRendererParams & ICrdType): void {
    this.value = params.value;
    this.drawerRef = params.drawerRef;
  }

  refresh(params: ICellRendererParams<any, any, any>): boolean {
    params;
    return false;
  }


  openDialog(): void {
    this.drawerRef.close();
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      minWidth: '300px',
      height: 'auto',
      data: { name: this.value, animal: this.animal() }
    });

    dialogRef.closed.subscribe((result) => {
      this.drawerRef.open();

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
  readonly _dialogRef = inject(DialogRef<DialogOverviewExampleDialog>);
  readonly _data = inject<DialogData>(DIALOG_DATA);
  readonly _oilData = inject(OilCompaniesDataService);
  readonly _store = inject(Store);
  // readonly animal = model(this.data.prop);

  public options!: AgChartOptions;

  app$: Observable<AppState> = this._store.select('app');


  ngOnInit(): void {
    this.app$.subscribe((res) => {
      this.options = {
        data: res.items.filter((x) => (x.oil_companies_ == this._data.name)).map((x) => {
          return {
            year: x.year,
            month: x._month_,
            quantity: x.quantity_000_metric_tonnes_ / 10
          }
        }),
        title: {
          text: this._data.name,
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
            label: {
              enabled: true,
              formatter: function (params: { value: number; }) {
                return parseFloat((params.value).toFixed(2)).toString();
              }
            },
            strokeWidth: 1,
          },
        ],
        
      };
    });
  }
}