import * as moment from 'moment';

import { Component, Input, OnInit } from '@angular/core';

export interface BarChartData {
  value: number;
  date: string;
}

interface MaxMin {
  max: number;
  min: number;
}

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnInit {
  data: Array<BarChartData> = [
    { value: 1120, date: '2020-06-12' },
    { value: 415, date: '2020-06-13' },
    { value: 213, date: '2020-06-14' },
    { value: 718, date: '2020-06-15' },
    { value: 291, date: '2020-06-16' },
    { value: 918, date: '2020-06-17' },
    { value: 516, date: '2020-06-18' },
    { value: 616, date: '2020-06-19' }
  ];
  @Input() scale: number;
  @Input() width: string;
  @Input() height: string;
  verticalLineValues: Array<{ value: number; pos: number }>;
  horizontalLineValues: Array<{
    value: string;
    pos: number;
    displayValue: number;
  }>;
  bgStyleObj: { width: string; height: string };
  svgStyleObj: { width: string; height: string; transform: string };
  verticalStep: MaxMin;
  horizontalStep: MaxMin;
  widthStep: number;
  prevWidthStep: number = 0;

  constructor() {
    this.verticalStep = this.findVerticalMaxValue(this.data);
  }
  setLeftLineStyles = () => ({width: 1.5,height: +this.height * 0.87, x: +this.width * 0.07,  y: +this.height * 0.05})
  setrightLineStyles = () => ({height: 1.5, width: +this.width - 40,y: +this.height * 0.9, x: 20})
  setVerticalDots = (i: any) => ({ cy: i.pos , cx: +this.width * 0.13 })
  findVerticalMaxValue = (arr: Array<BarChartData>) => {
    let max = 0;
    let min = Number.MAX_SAFE_INTEGER;
    arr.forEach(x => {
      max = Math.max(max, x.value);
      min = Math.min(min, x.value);
    });
    return { max, min };
  };
  setVerticalTextStyles = (i: any) => ({
    transform: this.customVerticalTranslate(i.pos),
    font: '11px sans-serif'
  })

  findVerticalDataDotPositions = (val: number, maxMin: MaxMin) => {
    let posPercentage = maxMin.max / 100;
    let heightPercentage = (+this.height - (+this.height * 0.1)) / 100;
    return (val / posPercentage) * heightPercentage;
  };

  findHorizontalDataDotPositions = () => {
    this.prevWidthStep = this.widthStep + this.prevWidthStep;
    return this.prevWidthStep;
  };

  customVerticalTranslate = (pos: number) =>
    `translate(100px,${ pos}px) rotate(180deg)`;

  customHorizontalTranslate = (pos: number) => `translate(${pos - 30}px,${+this.height * 0.95}px)`;

  setBarStyles = (i: any) => ({
    x: i.pos - 10,
    transform: this.customTranslateBars(i.displayValue - (+this.height * 0.05)),
    height: i.displayValue  - (+this.height * 0.05),
    y: +this.height  * 0.9
  })

  customTranslateBars = (deg: number) => {
    return `translate(0px, -${deg}px)`;
  };

  setScale = () => {
    return `scale(${this.scale ? this.scale : 1})`;
  };

  setHorizontalDots = (i: any) => ({ cx: i.pos, cy: +this.height * 0.9 })

  ngOnInit(): void {
    this.bgStyleObj = {
      width: `${this.width}px`,
      height: `${this.height}px`
    };
    this.svgStyleObj = { ...this.bgStyleObj, transform: this.setScale() };
    this.widthStep = (+this.width - 40) / this.data.length;
    this.verticalLineValues = this.data.map(x => ({
      value: x.value,
      pos: this.findVerticalDataDotPositions(x.value, this.verticalStep)
    }));
    this.horizontalLineValues = this.data.map(x => ({
      value: x.date,
      displayValue: this.findVerticalDataDotPositions(
        x.value,
        this.verticalStep
      ),
      pos: this.findHorizontalDataDotPositions()
    }));
    console.log(this.verticalLineValues)
  }
}
