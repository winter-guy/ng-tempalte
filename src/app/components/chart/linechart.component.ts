import { Component, input, OnChanges, OnInit } from "@angular/core";
import { AgCharts } from "ag-charts-angular";
import { AgBarSeriesOptions, AgChartOptions } from "ag-charts-enterprise";
import "ag-charts-enterprise";
import { SeriesSet } from "../../types/records.type";
import clone from "clone";

@Component({
    selector: "lc-ag",
    standalone: true,
    imports: [AgCharts],
    template: `
    <ag-charts [options]="options" class="h-screen"></ag-charts>
`,
})
export class MultiLineChartComponent implements OnChanges {
    public options!: AgChartOptions;

    seiesSet = input<SeriesSet[]>();
    selected = input<string[]>();
    seriesData = input<{
        [key: string]: number;
        time: number;
    }[]>();
    

    constructor() { }

    ngOnChanges(): void {
        this.options = {
            zoom: {
                enabled: true,
            },
            tooltip: {
                enabled: true,
            },
            axes: [
                {
                    type: "number",
                    position: "left",
                },
                {
                    type: "number",
                    position: "bottom",
                    nice: false,
                    interval: {
                        minSpacing: 80,
                        maxSpacing: 120,
                    },
                    label: {
                        autoRotate: false,
                        formatter: function(params) {
                            return new Date(params.value * 1000).toLocaleString('en-US', { month: 'short', year: 'numeric' });
                        }
                    },
                },
            ],
            series: this.seiesSet(),
            data: this.seriesData()
        };
    }


    longLabels = () => {
        const options = clone(this.options);
    
        (options.series![0] as AgBarSeriesOptions)!.xKey = "actualDate";
    
        this.options = options;
      };
    
}

const NUM_DATA_POINTS = 400;

export function getData() {
    const data: Array<{ time: number; spending: number, bending: number, stranding: number }> = [];
    for (let i = 0; i < NUM_DATA_POINTS; i++) {
        data.push({
            time: new Date().getFullYear() - NUM_DATA_POINTS + i,
            spending:
                i === 0 ? random() * 100 : data[i - 1].spending + random() * 10 - 5,
            bending: i === 0 ? random() * 100 : data[i - 1].spending + random() * 10 - 5,
            stranding: i === 0 ? random() * 100 : data[i - 1].spending + random() * 10 - 5,
        });
    }

    return data;
}


let seed = 1234;
function random() {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
}