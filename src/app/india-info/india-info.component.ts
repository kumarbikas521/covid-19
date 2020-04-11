import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { IndiaApiServiceService } from '../services/india-api-service.service';
import { MatPaginator } from '@angular/material/paginator';
import { DatePipe } from '@angular/common';
/* Imports */
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

/* Chart code */
// Themes begin
am4core.useTheme(am4themes_animated);
@Component({
  selector: 'app-india-info',
  templateUrl: './india-info.component.html',
  styleUrls: ['./india-info.component.css']
})
export class IndiaInfoComponent implements OnInit, AfterViewInit {
  indiaInfoForm;
  totalIndiaData = {
    cases_time_series: [{
      dailyconfirmed: '',
      dailydeceased: '',
      dailyrecovered: '',
      date: '',
      totalconfirmed: '',
      totaldeceased: '',
      totalrecovered: ''
    }],
    statewise: [{
      active: '',
      confirmed: '',
      deaths: '',
      deltaconfirmed: '',
      deltadeaths: '',
      deltarecovered: '',
      lastupdatedtime: '',
      recovered: '',
      state: '',
      statecode: ''
    }],
    tested: []
  };
  // @ViewChild(MatPaginator) paginator: MatPaginator;
  indiaDateWiseData = [];
  constructor(private indiaService: IndiaApiServiceService, private datepipe: DatePipe) {
    this.indiaInfoForm = new FormGroup({
    });
    this.indiaDateWiseData = [];
    this.indiaService.getIndiaData().subscribe((data) => {
      console.log(data);
      this.totalIndiaData = data;
      console.log(data.cases_time_series[data.cases_time_series.length - 1].totalconfirmed);
      this.totalIndiaData.cases_time_series.forEach((ele) => {
        // console.log( this.indiaDateWiseData);
        const dateValue = {
          date: this.datepipe.transform(new Date(ele.date + '2020'), 'yyyy-MM-dd'),
          value: parseInt(ele.dailyconfirmed, 10)
        };
        this.indiaDateWiseData.push(dateValue);
      });
      console.log(this.indiaDateWiseData);
      this.ngAfterViewInit();
      // this.totalIndiaData.statewise.paginator = this.paginator;
    });
  }

  ngOnInit() {
  }
  ngAfterViewInit() {
    const chart = am4core.create('chartdiv', am4charts.XYChart);
    const label = chart.createChild(am4core.Label);
    label.text = 'Date';
    label.fontSize = 17;
    label.align = 'center';
    chart.data = this.indiaDateWiseData;
    chart.dateFormatter.inputDateFormat = 'yyyy-MM-dd';
    const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    const series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = 'value';
    series.dataFields.dateX = 'date';
    series.tooltipText = '{value}';
    series.strokeWidth = 2;
    series.minBulletDistance = 15;

    // Drop-shaped tooltips
    series.tooltip.background.cornerRadius = 20;
    series.tooltip.background.strokeOpacity = 0;
    series.tooltip.pointerOrientation = 'vertical';
    series.tooltip.label.minWidth = 40;
    series.tooltip.label.minHeight = 40;
    series.tooltip.label.textAlign = 'middle';
    series.tooltip.label.textValign = 'middle';

    // Make bullets grow on hover
    const bullet = series.bullets.push(new am4charts.CircleBullet());
    bullet.circle.strokeWidth = 2;
    bullet.circle.radius = 4;
    bullet.circle.fill = am4core.color('#fff');

    const bullethover = bullet.states.create('hover');
    bullethover.properties.scale = 1.3;

    // Make a panning cursor
    chart.cursor = new am4charts.XYCursor();
    // chart.cursor.behavior = 'panXY';
    chart.cursor.xAxis = dateAxis;
    chart.cursor.snapToSeries = series;

    // Create vertical scrollbar and place it before the value axis
    chart.scrollbarY = new am4core.Scrollbar();
    chart.scrollbarY.parent = chart.leftAxesContainer;
    chart.scrollbarY.toBack();

    // Create a horizontal scrollbar with previe and place it underneath the date axis
    chart.scrollbarX = new am4charts.XYChartScrollbar();
    // chart.scrollbarX.series.push(series);
    chart.scrollbarX.parent = chart.bottomAxesContainer;

    // dateAxis.start = 0.79;
    dateAxis.keepSelection = true;
  }
}
