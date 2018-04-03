import Highcharts from "highcharts";
import {inject, bindable} from 'aurelia-framework';
import {Endpoint} from 'aurelia-api';
import {UserAware} from 'user_aware';
import {DOM} from "aurelia-pal";

@inject(DOM,
        Endpoint.of('getAllSetsList'),)
export class Graphs extends UserAware{
    message = "Graphs";

    @bindable daySetsDatesList = null;
    @bindable numberOfSets = null;

    constructor(DOM, getAllSetsListEndpoint,) {
        super();
        this.DOM = DOM;
        this.getAllSetsListEndpoint = getAllSetsListEndpoint;
        this.daySetsList = [];
        this.daySetsDatesList = [];
        this.numberOfSets = [];
        this.start = "";
        this.end = "";
    }

    activate(params) {
        $(() => {
            this.start = moment().subtract(29, 'days').format('YYYY-MM-DD');
            this.end = moment().format('YYYY-MM-DD');
            this.getAllSetsList();
        })
    }

    getAllSetsList(){
        this.getAllSetsListEndpoint
        .find('', {id: this.loggedInUserId, start: this.start, end: this.end})
        .then(response => {
            this.daySetsList = response;
            this.daySetsDatesList = [];
            this.numberOfSets = [];
            var i;
            for(i = new Date(this.start); i <= new Date(this.end); i.setDate(i.getDate()+1) ){
                var periodMonth = Number(i.getUTCMonth())+1;
                var periodDate = i.getUTCDate() + '.' + periodMonth + '.' + i.getUTCFullYear();
                this.daySetsDatesList.push(periodDate);
                var found = 0;
                for(let daySet of this.daySetsList){
                    var daySetDate = daySet.date.dayOfMonth + '.' + daySet.date.monthValue + '.' + daySet.date.year;
                    if(daySetDate == periodDate){
                        this.numberOfSets.push(daySet.sets.length);
                        found = 1;
                    }
                }
                if(found == 0){
                    this.numberOfSets.push(0);
                }
                found = 0;
            }
            this.showSetsChart();
        })
        .catch(error => {
            console.log(error);
        })
    }

    attached() {
    $(() => {
            var start = moment().subtract(29, 'days');
            var end = moment();

            function cb(start, end) {
                $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
            }

            $('#reportrange').daterangepicker({
                numberOfMonths : 1,
                autoUpdateInput : true,
                startDate: start,
                endDate: end,
                ranges: {
                   'Today': [moment(), moment()],
                   'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                   'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                   'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                   'This Month': [moment().startOf('month'), moment().endOf('month')],
                   'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                }
            }, cb);
            $('#reportrange').on('apply.daterangepicker', (ev, picker) => {
              console.log(picker.startDate.format('YYYY-MM-DD'));
              console.log(picker.endDate.format('YYYY-MM-DD'));
              this.start = picker.startDate.format('YYYY-MM-DD');
              this.end = picker.endDate.format('YYYY-MM-DD');
              this.getAllSetsList();
            })

            cb(start, end);

        });
    }

    showSetsChart(){
        $(() => {
            var i = 0;
            this.data = [];
            for(i = 0; i < this.numberOfSets.length; i++) {
                this.dataobject = [];
                this.dataobject.push(this.daySetsDatesList[i]);
                this.dataobject.push(this.numberOfSets[i]);
                this.data.push(this.dataobject);
                }
            Highcharts.chart('container', {
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Sets per day'
                },
                subtitle: {
                    },
                xAxis: {
                    type: 'category',
                    labels: {
                        rotation: -45,
                        style: {
                            fontSize: '9px',
                            fontFamily: 'Verdana, sans-serif'
                        }
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Sets'
                    }
                },
                legend: {
                    enabled: false
                },
                tooltip: {
                    pointFormat: 'Number of sets: <b>{point.y}</b>'
                },
                series: [{
                    name: 'Population',
                    data: this.data,
                }]
            });
        });
    }
}