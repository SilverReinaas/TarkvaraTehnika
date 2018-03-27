import Highcharts from "highcharts";
import {inject} from "aurelia-framework";
import {DOM} from "aurelia-pal";

@inject(DOM)
export class Analytics{
    message = "Analytics";

    constructor(DOM) {
        this.DOM = DOM;
    }

    attached() {
        let element = this.DOM.getElementById('container');

        var myChart = Highcharts.chart('container', {
            chart: {
                type: 'bar'
            },
            title: {
                text: 'Fruit Consumption'
            },
            xAxis: {
                categories: ['Apples', 'Bananas', 'Oranges']
            },
            yAxis: {
                title: {
                    text: 'Fruit eaten'
                }
            },
            series: [{
                name: 'Jane',
                data: [1, 0, 4]
            }, {
                name: 'John',
                data: [5, 7, 3]
            }]
        });
    }

}