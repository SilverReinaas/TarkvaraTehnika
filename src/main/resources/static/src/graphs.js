import Highcharts from "highcharts";
import {inject, bindable} from 'aurelia-framework';
import {Endpoint} from 'aurelia-api';
import {UserAware} from 'user_aware';
import {DOM} from "aurelia-pal";

@inject(DOM,
        Endpoint.of('getAllSetsList'),
        Endpoint.of('getUserExercises'),
        Endpoint.of('getDaySetsList'))

export class Graphs extends UserAware{
    message = "Graphs";

    @bindable allSetsDatesList = null;
    @bindable numberOfSets = null;
    @bindable exercises = null;
    @bindable exercise = null;

    constructor(DOM, getAllSetsListEndpoint, userExercisesEndpoint, getDaySetsListEndpoint) {
        super();
        this.DOM = DOM;
        this.getAllSetsListEndpoint = getAllSetsListEndpoint;
        this.allSetsList = [];
        this.allSetsDatesList = [];
        this.numberOfSets = [];
        this.start = "";
        this.end = "";
        this.userExercisesEndpoint = userExercisesEndpoint;
        this.exercises = [];
        this.getDaySetsListEndpoint = getDaySetsListEndpoint;
        this.daySetsList = [];
    }

    activate(params) {
        $(() => {
            this.start = moment().subtract(29, 'days').format('YYYY-MM-DD');
            this.end = moment().format('YYYY-MM-DD');
            this.getAllSetsList();
            this.getExercises();
            for(let exercise of this.exercises) {
                exercise.sets = [];
            }
            for(var i = 0; i < this.exercises.length; i++) {
              this.exercises[i].sets = [];
              this.exercise = this.exercises[i];
              this.getDaySetsList();
            }
            //this.showExercisesSetsChart();
        })
    }

    getAllSetsList(){
        this.getAllSetsListEndpoint
        .find('', {id: this.loggedInUserId, start: this.start, end: this.end})
        .then(response => {
            this.allSetsList = response;
            console.log(this.allSetsList);
            this.allSetsDatesList = [];
            this.numberOfSets = [];
            var i;
            for(i = new Date(this.start); i <= new Date(this.end); i.setDate(i.getDate()+1) ){
                var periodMonth = Number(i.getUTCMonth())+1;
                var periodDate = i.getUTCDate() + '.' + periodMonth + '.' + i.getUTCFullYear();
                this.allSetsDatesList.push(periodDate);
                var found = 0;
                for(let daySet of this.allSetsList){
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

    getExercises() {
        this.userExercisesEndpoint
          .find('', {userId: this.loggedInUserId})
          .then(response => {
            console.log("getExercises()");
            this.exercises = response;
          })
          .catch(error => {
            console.log(error);
          });
    }

    getDaySetsList(){
        this.getDaySetsListEndpoint
        .find('', {id: this.exercise.id, start: this.start, end: this.end})
        .then(response => {
            console.log(response);
            this.daySetsList = response;
            for (var i = 0; i < this.exercises.length; i++) {
                for (var j = 0; j < this.daySetsList.length; j++) {
                    for (var k = 0; k < this.daySetsList[j].sets.length; k++) {
                        this.exercises[i].sets.push(this.daySetsList[j].sets[k]);
                    }
                }
            }
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
              this.getExercises();
              for(let exercise of this.exercises) {
                  exercise.sets = [];
              }
              for(var i = 0; i < this.exercises.length; i++) {
                  this.exercise = this.exercises[i];
                  this.getDaySetsList();
                  console.log(this.exercises[i]);
              }
              console.log(this.exercises);
              this.showExercisesSetsChart();
            })

            cb(start, end);

        });
    }

    showSetsChart() {
        $(() => {
            var i = 0;
            this.data = [];
            for(i = 0; i <= this.numberOfSets.length; i++) {
                this.dataobject = [];
                this.dataobject.push(this.allSetsDatesList[i]);
                this.dataobject.push(this.numberOfSets[i]);
                this.data.push(this.dataobject);
                }
            Highcharts.chart('allSets', {
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

    showExercisesSetsChart() {
        $(() => {
            console.log("showSetsChart()");
            var i = 0;
            var xd = 0;
            this.data = [];
            for(i = 0; i < this.exercises.length; i++) {
                this.dataobject = [];
                this.dataobject.push(this.exercises[i].name);
                console.log(this.exercises[i].sets);
                this.dataobject.push(this.exercises[i].sets.length);
                this.data.push(this.dataobject);
                }
            Highcharts.chart('allExercisesSets', {
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Sets per Exercise '
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