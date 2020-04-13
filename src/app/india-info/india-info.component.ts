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
  deathAndRecoverData = [];
  constructor(private indiaService: IndiaApiServiceService, private datepipe: DatePipe) {
    this.indiaInfoForm = new FormGroup({
    });
    this.indiaDateWiseData = [];
    this.deathAndRecoverData = [];
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
        const deathrecoverObj = {
          date: this.datepipe.transform(new Date(ele.date + '2020'), 'yyyy-MM-dd'),
          death: parseInt(ele.dailydeceased, 10),
          recover: parseInt(ele.dailyrecovered, 10)
        };
        this.indiaDateWiseData.push(dateValue);
        this.deathAndRecoverData.push(deathrecoverObj);

      });
      console.log(this.indiaDateWiseData);
      this.ngAfterViewInit();
      this.plotDeathRecoverGraph();
    });
  }

  ngOnInit() {


  }
  ngAfterViewInit() {

    // Create chart instance
    const chart = am4core.create('chartdiv', am4charts.XYChart);
    // chart.scrollbarX = new am4core.Scrollbar();
    chart.data = this.indiaDateWiseData;
    // Create axes
    const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'date';
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.renderer.labels.template.horizontalCenter = 'right';
    categoryAxis.renderer.labels.template.verticalCenter = 'middle';
    categoryAxis.renderer.labels.template.rotation = 270;
    categoryAxis.tooltip.disabled = true;
    categoryAxis.renderer.minHeight = 110;

    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.minWidth = 50;

    // Create series
    const series = chart.series.push(new am4charts.ColumnSeries());
    series.sequencedInterpolation = true;
    series.dataFields.valueY = 'value';
    series.dataFields.categoryX = 'date';
    series.tooltipText = '[{categoryX}: bold]{valueY}[/]';
    series.columns.template.strokeWidth = 0;

    series.tooltip.pointerOrientation = 'vertical';

    series.columns.template.column.cornerRadiusTopLeft = 10;
    series.columns.template.column.cornerRadiusTopRight = 10;
    series.columns.template.column.fillOpacity = 0.8;

    // on hover, make corner radiuses bigger
    const hoverState = series.columns.template.column.states.create('hover');
    hoverState.properties.cornerRadiusTopLeft = 0;
    hoverState.properties.cornerRadiusTopRight = 0;
    hoverState.properties.fillOpacity = 1;

    series.columns.template.adapter.add('fill', (fill, target) => {
      return chart.colors.getIndex(target.dataItem.index);
    });

    // Cursor
    chart.cursor = new am4charts.XYCursor();
  }
  plotDeathRecoverGraph() {
    const chart = am4core.create('chartdivDeath', am4charts.XYChart);
    chart.data = this.deathAndRecoverData;
    // Create axes
    const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'date';
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.renderer.labels.template.horizontalCenter = 'right';
    categoryAxis.renderer.labels.template.verticalCenter = 'middle';
    categoryAxis.renderer.labels.template.rotation = 270;
    categoryAxis.tooltip.disabled = true;
    categoryAxis.renderer.minHeight = 110;

    // Create value axis
    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.baseValue = 0;

    // Create series
    const series = chart.series.push(new am4charts.LineSeries());
    series.name = 'Death';
    series.dataFields.valueY = 'death';
    series.dataFields.categoryX = 'date';
    series.strokeWidth = 2;
    series.tensionX = 0.77;
    series.stroke  = am4core.color('#FF0000');
    // bullet is added because we add tooltip to a bullet for it to change color
    const bullet = series.bullets.push(new am4charts.Bullet());
    bullet.tooltipText = '{valueY}';

    const series1 = chart.series.push(new am4charts.LineSeries());
    series1.name = 'Recovered';
    series1.dataFields.valueY = 'recover';
    series1.dataFields.categoryX = 'date';
    series1.strokeWidth = 2;
    series1.tensionX = 0.77;
    series1.stroke  = am4core.color('#00FF00');
    // bullet is added because we add tooltip to a bullet for it to change color
    const bullet1 = series1.bullets.push(new am4charts.Bullet());
    bullet1.tooltipText = '{valueY}';

    chart.legend = new am4charts.Legend();


    chart.cursor = new am4charts.XYCursor();
  }
}
