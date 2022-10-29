import { Component, Input, OnChanges, SimpleChanges, ViewChild } from "@angular/core";
import { ChartDataSets, ChartOptions, ChartType } from "chart.js";
import { BaseChartDirective, Label } from "ng2-charts";
import { PoiData } from "src/models/poiData";

@Component({
    selector : 'app-single-event-chart',
    templateUrl : './single-event-chart.component.html'
})
export class SingleEventChartComponent implements OnChanges {
    @Input() poiData : PoiData;
    @ViewChild(BaseChartDirective) baseChartDir : BaseChartDirective;

    chartType: ChartType = 'scatter';
    chartData: ChartDataSets[] = [];
    chartOptions: ChartOptions = {
        //animation: false,
        scales: {
            xAxes: [{
                position: 'linear',
                scaleLabel: {
                    display: true,
                    labelString: 'sec'
                }
            }],
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'mg'
                }
            }]
        },
        elements: {
            point: {
                radius: this.myradiusfunc
              //  display: true
            }
        }
    }

    chartLabels: Label[] = [];
    chartLegend = true;
    chartPlugins = [];

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.poiData?.currentValue) {
            this.setupChartData();
        }
    }

    setupChartData() {
        var dataset_AV = [];
        var dataset_AL = [];
        var dataset_GX = [];
        var dataset_GY = [];
        var dataset_GZ = [];
        var dataset_AVF = [];
        var dataset_ALF = [];

        const traces = this.poiData.traces;

        for (var i = 0; i < traces[0].values.length; i++) {
            dataset_AV.push({ x: i / 160.0, y: traces[1].values[i] });
            dataset_AL.push({ x: i / 160.0, y: traces[2].values[i] });
            dataset_AVF.push({ x: i / 160.0, y: traces[3].values[i] });
            dataset_ALF.push({ x: i / 160.0, y: traces[4].values[i] });
        }

        this.chartData = [
            {
                label: 'V Accel Filtered',
                data: dataset_AVF,
                borderColor: '#2080E0',
                borderWidth: 1,
                pointBorderColor: '#2080E0',
                pointBackgroundColor: '#2080E0',
                fill: false,
                hidden: !this.poiData.poi.poiCode.startsWith('V'),
                lineTension: 0,
                showLine: true
            },
            {
                label: 'L Accel Filtered',
                data: dataset_ALF,
                borderColor: '#800000',
                borderWidth: 1,
                pointBorderColor: '#800000',
                pointBackgroundColor: '#800000',
                fill: false,
                hidden: !this.poiData.poi.poiCode.startsWith('L'),
                lineTension: 0,
                showLine: true
            },
            {
                label: 'V Accel',
                data: dataset_AV,
                borderColor: '#4000E0',
                borderWidth: 1,
                pointBorderColor: '#4080E0',
                pointBackgroundColor: '#4080E0',
                fill: false,
                hidden: true,
                lineTension: 0,
                showLine: true

            },
            {
                label: 'L Accel',
                data: dataset_AL,
                borderColor: '#ff0000',
                borderWidth: 1,
                pointBorderColor: '#ff0000',
                pointBackgroundColor: '#ff0000',
                fill: false,
                hidden: true,
                lineTension: 0,
                showLine: true
            }
        ];


    }


    // Hightlight the specific data point responsible for the POI by giving it a radius.
    // TODO Can't implement this until we transmit the recordRow in the Poi
    myradiusfunc(context) {
        // if (context.dataIndex === this.poiData.poi.recordRow) {
        //     if ((context.datasetIndex === 0) && (this.poiData.poi.poiCode === 'V.BP'))
        //         return 4;
        //     if ((context.datasetIndex === 1) && (this.poiData.poi.poiCode === 'L.BP'))
        //         return 4;
        // }
        return 0;
    };


}
