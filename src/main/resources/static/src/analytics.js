import Highcharts from "highcharts";
import {inject, bindable} from 'aurelia-framework';
import {Endpoint} from 'aurelia-api';
import {UserAware} from 'user_aware';
import {DOM} from "aurelia-pal";

@inject(DOM,
        Endpoint.of('getAllSetsList'),)
export class Analytics extends UserAware{
    message = "Analytics";

    @bindable numberOfSets = null;
    @bindable daySetsDatesList = null;

    constructor(DOM, getAllSetsListEndpoint,) {
        super();
        this.DOM = DOM;
        this.getAllSetsListEndpoint = getAllSetsListEndpoint;
        this.daySetsList = [];
        this.daySetsDatesList = ["31.03", "01.04"];
        this.numberOfSets = [14, 19];
        this.start = "";
        this.end = "";
    }

    activate(params) {
        $(() => {
            this.start = moment().subtract(6, 'days').format('YYYY-MM-DD');
            this.end = moment().format('YYYY-MM-DD');
        })
    }

    getAllSetsList(){
        this.getAllSetsListEndpoint
        .find('', {id: this.loggedInUserId, start: this.start, end: this.end})
        .then(response => {
            this.daySetsList = response;
            for(let daySet of this.daySetsList){
                this.daySetsDatesList.push(daySet.date.dayOfMonth + '.' + daySet.date.monthValue);
                let n = 0;
                for(let set of daySet.sets) {
                    for(let measure of set.measureLogs) {
                    n+=measure.val;
                    }
                }
                this.numberOfSets.push(n);
                n=0;
            }
            console.log(this.daySetsDatesList);
            console.log(this.numberOfSets);
        })
        .catch(error => {
            console.log(error);
        })
    }

    attached() {
    $(() => {
            var start = moment().subtract(6, 'days');
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

        let element = this.DOM.getElementById('container');

        var myChart = Highcharts.chart('container', {
              chart: {
                  type: 'line'
              },
              title: {
                  text: 'Sets per day'
              },
              xAxis: {
                  categories: this.daySetsDatesList
              },
              yAxis: {
                  title: {
                      text: 'Sets'
                  }
              },
              plotOptions: {
                  line: {
                      dataLabels: {
                          enabled: true
                      },
                      enableMouseTracking: false
                  }
              },
              series: [{
                  name: 'Date',
                  data: this.numberOfSets
              }]
          });
    }

}