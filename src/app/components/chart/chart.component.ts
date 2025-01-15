import {
  Component,
  ElementRef,
  OnInit,
  AfterViewInit,
  HostListener,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { createChart, IChartApi, ISeriesApi, LineData, Time, WhitespaceData } from 'lightweight-charts';

@Component({
  selector: 'chart',
  template: `<div id="chart-container" class="md:w-[calc(100vw-252px)] h-screen"></div>`,
  styles: []
})
export class LightweightChartComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() inputData: Record<string, { time: number; value: number }[]> = {};

  private chart!: IChartApi;
  private seriesMap: Map<string, ISeriesApi<'Line'>> = new Map();
  private toolTip!: HTMLDivElement;

  constructor(private el: ElementRef) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initializeChart();
    this.createToolTip();
  }

  ngOnChanges(changes: SimpleChanges): void {
   
    this.addSeriesData();
  }

  private initializeChart(): void {
    const container = this.el.nativeElement.querySelector('#chart-container');
    this.chart = createChart(container, {
      width: container.clientWidth,
      height: container.clientHeight,
    });

    this.chart.applyOptions({
      grid: {
        vertLines: {
          visible: false,
        },
        horzLines: {
          visible: false,
        },
      },
    });

    this.chart.timeScale().fitContent();
    this.chart.subscribeCrosshairMove(this.updateToolTip.bind(this));
  }

  private addSeriesData(): void {
    Object.keys(this.inputData).forEach((key) => {
      const series = this.chart.addLineSeries();
      const refer_series = this.inputData[key] as (LineData<Time> | WhitespaceData<Time>)[]
      series.setData(refer_series);
      this.seriesMap.set(key, series);
    });
  }

  @HostListener('window:resize')
  onResize(): void {
    if (this.chart) {
      const container = this.el.nativeElement.querySelector('#chart-container');
      this.chart.resize(container.clientWidth, container.clientHeight);
    }
  }

  private createToolTip(): void {
    const container = this.el.nativeElement.querySelector('#chart-container');
    this.toolTip = document.createElement('div');
    this.toolTip.style.width = 'auto';
    this.toolTip.style.height = 'auto';
    this.toolTip.style.position = 'absolute';
    this.toolTip.style.display = 'none';
    this.toolTip.style.padding = '8px';
    this.toolTip.style.boxSizing = 'border-box';
    this.toolTip.style.fontSize = '12px';
    this.toolTip.style.textAlign = 'left';
    this.toolTip.style.zIndex = '1000';
    this.toolTip.style.pointerEvents = 'none';
    this.toolTip.style.border = '1px solid';
    this.toolTip.style.borderRadius = '4px';
    this.toolTip.style.background = '#e5e7eb';
    this.toolTip.style.color = 'black';
    this.toolTip.style.borderColor = '#FFF';
    container.appendChild(this.toolTip);
  }

  private updateToolTip(param: any): void {
    if (
      !param.point ||
      !param.time ||
      param.point.x < 0 ||
      param.point.x > this.el.nativeElement.clientWidth ||
      param.point.y < 0 ||
      param.point.y > this.el.nativeElement.clientHeight
    ) {
      // this.toolTip.style.display = 'none';
      // return;
    }

    const dateStr = new Date(param?.time * 1000)?.toISOString()?.split('T')[0];

    const seriesData = Array.from(this.seriesMap.entries())
      .map(([label, series]) => {
        const data = param.seriesData.get(series);
        const value = data?.value || data?.close;
        return { label, value };
      })
      .filter((item) => item.value !== undefined);

    if (seriesData.length > 0) {
      this.toolTip.style.display = 'block';
      this.toolTip.innerHTML = `
        <div>
          <div>Date: ${dateStr}</div>
          ${seriesData
            .map(
              ({ label, value }) =>
                `<div>${label}: <span style="font-size: 14px; font-weight: bold">${Math.round(value * 100) / 100}</span></div>`
            )
            .join('')}
        </div>
      `;

      const container = this.el.nativeElement.querySelector('#chart-container');
      const toolTipWidth = 150;
      const toolTipHeight = 120;
      const toolTipMargin = 15;

      const coordinate = (this.seriesMap).values()?.next()?.value?.priceToCoordinate(seriesData[0].value!);
      if (coordinate) {
        let shiftedX = param.point.x + 195 - toolTipWidth / 2;
        shiftedX = Math.max(0, Math.min(container.clientWidth - toolTipWidth, shiftedX));

        const shiftedY = coordinate - toolTipHeight - toolTipMargin > 0
          ? coordinate - toolTipHeight - toolTipMargin
          : Math.max(0, Math.min(container.clientHeight - toolTipHeight, coordinate + toolTipMargin));

        this.toolTip.style.left = `${shiftedX}px`;
        this.toolTip.style.top = `${shiftedY}px`;
      }
    } else {
      this.toolTip.style.display = 'none';
    }
  }
}