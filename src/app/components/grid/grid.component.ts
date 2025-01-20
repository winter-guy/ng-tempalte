import { Component, inject, OnInit } from '@angular/core';
import { AllCommunityModule, CellSelectionOptions, CheckboxEditorModule, ColDef, DataTypeDefinition, IAggFunc, ModuleRegistry, RowSelectionOptions } from 'ag-grid-community';

import { CellSelectionModule, RowGroupingModule, RowGroupingPanelModule } from 'ag-grid-enterprise';

import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import { OilCompaniesDataService } from '../../services/oil-companies-data.service';

import { Match, OilDataRecord } from '../../types/records.type';
// import type { ColDef } from 'ag-grid-community'; 

ModuleRegistry.registerModules([
  AllCommunityModule, 
  RowGroupingModule,
  RowGroupingPanelModule, 
  CheckboxEditorModule, 
  CellSelectionModule
]);

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
    { 
      field: "oil_companies_", 
      headerName: 'Oil Companies',
      rowGroup: true, 
      hide: true 
    },
    { 
      field: "_month_", 
      headerName: 'Month'
    },
    { 
      field: "year",
      headerName: 'Year',
      rowGroup: true, 
      hide: true 
    },
    { 
      field: "quantity_000_metric_tonnes_", 
      headerName: 'Quantity (Metric Tonnes)',
      aggFunc: "sum"
    }
  ];

  ngOnInit(): void {
    this.ocd._oil_records$.subscribe((_ords) => {

      this.extractMatches(_ords);
      this.rowData = [...new Set(_ords.map((x) => { return { ...x, quantity_000_metric_tonnes_: Number(x.quantity_000_metric_tonnes_),  hasSelected: true } }))];

      console.log(this.rowData)

    })
  }

  extractMatches(data: OilDataRecord[]): Record<string, Match[]> {
    const result: Record<string, Match[]> = {}; // Explicit type for the result

    [...new Set(data.map((x) => x.oil_companies_))]?.forEach((searchStr) => {
      const matches = data
        .filter((item) => item.oil_companies_.includes(searchStr))
        .map((item) => {
          const time = (Math.floor(new Date(`${item._month_}, ${item.year}`).getTime() / 1000));
          const value = (item.quantity_000_metric_tonnes_)
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

  public defaultColDef: ColDef = {
    flex: 1,
    minWidth: 180,
    filter: true,
    floatingFilter: false,
  };

  public dataTypeDefinitions: {
    [cellDataType: string]: DataTypeDefinition;
  } = {
      object: {
        baseDataType: "object",
        extendsDataType: "object",
        valueParser: (params) => ({ name: params.newValue }),
        valueFormatter: (params) =>
          params.value == null ? "" : params.value.name,
      },
    };

  public rowGroupPanelShow: "always" | "onlyWhenGrouping" | "never" = "always";
  public cellSelection: boolean | CellSelectionOptions = {
    handle: { mode: "fill" },
  };

  public rowSelection: RowSelectionOptions | "single" | "multiple" = {
    mode: "multiRow",
    groupSelects: 'descendants',
  };

  public aggFuncs: {
    [key: string]: IAggFunc;
  } = {
    "2x+1": (params) => {
      const value = params.values[0];
      return 2 * value + 1;
    },
  };
}