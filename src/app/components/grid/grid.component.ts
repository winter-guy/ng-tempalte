import { CellRendererDialog } from './../expand-view/expand-view.component';
import { Component, inject, input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import {
  AllCommunityModule,
  CellSelectionOptions,
  CheckboxEditorModule,
  ClientSideRowModelModule,
  ColDef,
  DataTypeDefinition,
  IAggFunc,
  ICellRendererParams,
  ModuleRegistry,
  RowSelectionOptions,
  SideBarDef
} from 'ag-grid-community';

import {
  CellSelectionModule,
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  FiltersToolPanelModule,
  PivotModule,
  RowGroupingModule,
  RowGroupingPanelModule
} from 'ag-grid-enterprise';

import { AgGridAngular } from 'ag-grid-angular';

import { OilCompaniesDataService } from '../../services/oil-companies-data.service';
import { Match, OilDataRecord } from '../../types/records.type';
import { Store } from '@ngrx/store';
import { AppState } from '../../state/app.reducer';
import { Observable } from 'rxjs';

import { MatDrawer } from '@angular/material/sidenav';

export interface ICrdType {
  text: string; drawerRef: MatDrawer
}

ModuleRegistry.registerModules([
  AllCommunityModule,
  RowGroupingModule,
  RowGroupingPanelModule,
  CheckboxEditorModule,
  CellSelectionModule,
  PivotModule,

  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  FiltersToolPanelModule,
]);

@Component({
  selector: 'grid',
  imports: [AgGridAngular],
  templateUrl: './grid.component.html'
})
export class GridComponent implements OnInit, OnChanges {
  readonly _ocd = inject(OilCompaniesDataService);
  readonly _store = inject(Store);

  app$: Observable<AppState> = this._store.select('app');
  drawerRef = input<MatDrawer>();

  // Row Data: The data to be displayed.
  rowData!: OilDataRecord[];

  // Column Definitions: Defines the columns to be displayed.
  colDefs!: ColDef[]

  ngOnChanges(changes: SimpleChanges): void {
    this.colDefs = [
      {
        field: "oil_companies_",
        headerName: 'Oil Companies',
        rowGroup: true,
        hide: true,
        cellRenderer: CellRendererDialog,
        cellRendererParams: {
          text: 'random text',
          drawerRef: this.drawerRef()
        } as ICrdType
      },
      {
        field: "_month_",
        headerName: 'Month',
        pivot: true
      },
      {
        field: "year",
        headerName: 'Year',
        rowGroup: true,
        hide: true,
        pivot: true
      },
      {
        field: "quantity_000_metric_tonnes_",
        headerName: 'Quantity (Metric Tonnes)',
        aggFunc: "sum",
        cellRenderer: (params: ICellRendererParams) => {
          params.value = params.value?.toFixed(2);
  
          if (params.value < 10000) {
            return `<span class=" text-indigo-500">${params.value} </span>`;
          }
  
          return params.value;
        }
      }
    ];
  }

  public sideBar: SideBarDef | string | string[] | boolean | null = "columns";
  public pivotPanelShow: "always" | "onlyWhenPivoting" | "never" = "always";
  public autoGroupColumnDef: ColDef = {
    minWidth: 200,
  };

  public rowGroupPanelShow: "always" | "onlyWhenGrouping" | "never" = "never";
  public cellSelection: boolean | CellSelectionOptions = {
    handle: { mode: "fill" },
  };

  public rowSelection: RowSelectionOptions | "single" | "multiple" = {
    mode: "multiRow",
    groupSelects: 'descendants',
  };

  public defaultColDef: ColDef = {
    flex: 1,
    minWidth: 180,
  };

  public dataTypeDefinitions: { [cellDataType: string]: DataTypeDefinition; } = {
    object: {
      baseDataType: "object",
      extendsDataType: "object",
      valueParser: (params) => ({ name: params.newValue }),
      valueFormatter: (params) =>
        params.value == null ? "" : params.value.name,
    },
  };

  public aggFuncs: { [key: string]: IAggFunc; } = {
    "2x+1": (params) => {
      const value = params.values[0];
      return 2 * value + 1;
    },
  };

  ngOnInit(): void {
    this.app$.subscribe((_ords) => {
      this.rowData = [...new Set(_ords.items.map((x) => { return { ...x, quantity_000_metric_tonnes_: Number(x.quantity_000_metric_tonnes_), hasSelected: true } }))];
    })
  }


  extractMatches(data: OilDataRecord[]): Record<string, Match[]> {
    // Create a Map to group by company during initial processing
    const groupedData = data.reduce((acc, item) => {
      const company = item.oil_companies_;
      if (!acc.has(company)) {
        acc.set(company, []);
      }

      const time = Math.floor(new Date(`${item._month_}, ${item.year}`).getTime() / 1000);
      acc.get(company)!.push({
        time,
        value: item.quantity_000_metric_tonnes_,
      });

      return acc;
    }, new Map<string, Match[]>());

    // Convert to final format and sort
    const result: Record<string, Match[]> = {};
    for (const [company, matches] of groupedData) {
      if (matches.length > 0) {
        result[company] = matches.sort((a, b) => a.time - b.time);
      }
    }

    return result;
  }
}