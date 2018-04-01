import {inject, bindable} from 'aurelia-framework';
import {UserAware} from 'user_aware';
import {Endpoint} from 'aurelia-api';
import Highcharts from "highcharts";
import {DOM} from "aurelia-pal";

@inject(DOM, Endpoint.of('getMuscleSetsList'))
export class Muscles extends UserAware{
    message="Muscles";

    constructor(DOM, getMuscleSetsListEndpoint) {
        super();
        this.DOM = DOM;
        this.start = "";
        this.end = "";
        this.muscleSetsList = [];
        this.getMuscleSetsListEndpoint = getMuscleSetsListEndpoint;
        this.muscleData = [];
    }

    activate() {
        $(() => {
            this.start = moment().subtract(29, 'days').format('YYYY-MM-DD');
            this.end = moment().format('YYYY-MM-DD');
            this.getMuscleSetsList();
        })

    }

    getMuscleSetsList(){
        this.getMuscleSetsListEndpoint
        .find('', {userId: this.loggedInUserId, start: this.start, end: this.end})
          .then(response => {
            this.muscleSetsList = [];
            this.muscleData = [];
            this.muscleSetsList = response;
            this.showMuscleData();
          })
          .catch(error => {
            console.log(error);
          });
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
              this.getMuscleSetsList();
            })

            cb(start, end);

            });
        }

    showMuscleData(){
    $(() => {
        var i = 0;
        var data = [];
        var setsSum = 0;
        for (i = 0; i < this.muscleSetsList.length; i++) {
           setsSum += this.muscleSetsList[i].exerciseSets.length;
        }
        for (i = 0; i < this.muscleSetsList.length; i++) {
            if(this.muscleSetsList[i].exerciseSets.length/setsSum > 0){
                this.muscleData.push({name: this.muscleSetsList[i].muscle.muscleName, y: ((this.muscleSetsList[i].exerciseSets.length/setsSum)*100).toFixed(2)});
            }
        }
        console.log(this.muscleData)
        for (i = 0; i < this.muscleData.length; i++) {
            data.push(
                {name: this.muscleData[i].name, y: parseFloat(this.muscleData[i].y)}
            );
        }
            Highcharts.chart('container', {
                chart: {
                    type: 'pie'
                },
                plotOptions: {
                    series: {
                        dataLabels: {
                            enabled: true,
                            format: '{point.name}: {point.y:.1f}%'
                        }
                    }
                },

                tooltip: {
                    headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                    pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
                },
                series: [{
                    name: 'Muscles',
                    colorByPoint: true,
                    data: data,
                }]
            });
            console.log(this.muscleData);
        });
    }
}