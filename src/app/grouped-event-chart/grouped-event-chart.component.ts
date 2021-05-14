import { formatDate } from "@angular/common";
import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { ChartDataSets, ChartOptions, ChartType } from "chart.js";
import { Label } from "ng2-charts";
import { GroupedEventDetails } from "src/models/dto";

@Component({
    selector: "app-grouped-event-chart",
    templateUrl: "./grouped-event-chart.component.html",
    styleUrls : ["./grouped-event-chart.component.css"]
})
export class GroupedEventChartComponent implements OnChanges {
    @Input() groupedEventDetails: GroupedEventDetails;

    chartOptions: ChartOptions = {
        scales: {
            xAxes: [{
                type: 'time',
                position: 'linear',
                time: { unit: 'month' },
                bounds: 'ticks'
            }],
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'mg'
                }
            }]
        }
      };

      chartLabels: Label[] = [];
      chartType: ChartType = 'scatter';
      chartLegend = true;
      chartPlugins = [];

      chartData: ChartDataSets[] = [];


    ngOnChanges(changes: SimpleChanges): void {
        if (changes.groupedEventDetails?.currentValue) {
            this.setupChartData();
        }
    }

    setupChartData() {

        const ged = this.groupedEventDetails;

        // Plot data points
        // Noe that all Date properties received via the API have not been properly instantiated
        // so they have the correct fields but won't have any of the Date methods such as getTime().
        // We explicitly create a new Date object around each Date.
        var data = [];
        for (var i = 0; i < ged.pois.length; i++) {
            var poi = ged.pois[i];
            data.push({
                x: new Date(poi.timestamp),
                y: poi.poiValue
            });
        }

        // Create trend line
        //   Dates from .C# get converted to "/Date(1234567890123)/". Convert them to a Javascript Date
        var mindate : Date = new Date(ged.trendLine.actualDataRange.start);
        var maxdate : Date = new Date(ged.trendLine.actualDataRange.end);
        var targetdate = new Date(ged.trendLine.targetDate);
        var trendlinedata = [
            { x: mindate, y: (mindate.getTime() - targetdate.getTime()) / 86400000 * ged.trendLine.gradient + ged.trendLine.offset },
            { x: maxdate, y: ged.trendLine.valueAtLastDate }
        ];

        this.chartData =  [
            {
                label: 'Peak ' + this.groupedEventDetails.poiCodeDesc,
                data: data,
                pointRadius: 4,
                backgroundColor: '#4080e0',
                borderColor: '#204090',
                pointBorderColor: '#204090',
                pointBackgroundColor: '#4080E0'
            },
            {
                label: 'Trendline',
                data: trendlinedata,
                pointRadius: 0,
                borderColor: '#008000',
                fill: false,
                lineTension: 0,
                showLine: true
            }
        ];
    }

}
