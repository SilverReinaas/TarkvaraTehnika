import {inject, bindable} from 'aurelia-framework';
import {Endpoint} from 'aurelia-api';
import {UserAware} from 'user_aware';
import {Router} from 'aurelia-router';

@inject(Endpoint.of('getExerciseById'),
        Endpoint.of('addMeasureLog'),
        Endpoint.of('getExerciseSetsToday'),
        Endpoint.of('getDaySetsList'),
        Endpoint.of('getExerciseStatistics'),
        Router)
export class Details extends UserAware {

    @bindable valueInputs = null;
    @bindable exercise = null;
    @bindable exerciseStatistics = null;
    unitTypeIds = [];
    unitTypes = [];
    @bindable setsToday = null;
    @bindable setsByDay = null;
    @bindable logDate;

    constructor(exerciseEndpoint, addMeasureLogEndpoint, getExerciseSetsTodayEndpoint, getDaySetsListEndpoint, getExerciseStatisticsEndpoint, router) {
        super();
        this.exerciseEndpoint = exerciseEndpoint;
        this.addMeasureLogEndpoint = addMeasureLogEndpoint;
        this.getExerciseSetsTodayEndpoint = getExerciseSetsTodayEndpoint;
        this.getDaySetsListEndpoint = getDaySetsListEndpoint;
        this.getExerciseStatisticsEndpoint = getExerciseStatisticsEndpoint;
        this.valueInputs = [];
        this.setsToday = [];
        this.daySetsList = [];
        this.router = router;
        this.start = "";
        this.end = "";
        this.logDate;
    }
    activate(params) {
        $(() => {
            this.logDate = moment().format('YYYY-MM-DD');
            this.start = moment().subtract(6, 'days').format('YYYY-MM-DD');
            this.end = moment().format('YYYY-MM-DD');
            this.getExercise(params.id);
        })
    }

    fillValueInputs(exercise){
        this.valueInputs = [];
        for(let unitType of exercise.unitTypes){
            this.valueInputs.push(null);
        }
    }

    getExercise(exerciseId) {
        this.exerciseEndpoint
          .find('', {id : exerciseId})
          .then(response => {
            this.exercise = response;
            this.getExerciseSetsToday(response);
            this.getDaySetsList();
            this.fillValueInputs(response);
            this.getExerciseStatistics();
            console.log(JSON.stringify(response));
          })
          .catch(error => {
            console.log(error);
          });
    }
    addMeasureLog() {
        this.addMeasureLogEndpoint
         .post('', {exerciseId: this.exercise.id, unitTypes: this.exercise.unitTypes, values: this.valueInputs, logDate: this.logDate})
         .then(response => {
           console.log(response);
           this.fillValueInputs(this.exercise);
           this.getExerciseSetsToday(this.exercise);
           this.getDaySetsList(this.exercise);
         })
         .catch(error => {
           console.log(error);
         })
    }

    getExerciseSetsToday(){
        this.getExerciseSetsTodayEndpoint
        .find('', {id: this.exercise.id})
        .then(response => {
            this.setsToday = response;
            console.log(response);
        })
        .catch(error => {
            console.log(error);
        })
    }
    getDaySetsList(){
        this.getDaySetsListEndpoint
        .find('', {id: this.exercise.id, start: this.start, end: this.end})
        .then(response => {
            this.daySetsList = response;
        })
        .catch(error => {
            console.log(error);
        })
    }

    getExerciseStatistics() {
        this.getExerciseStatisticsEndpoint
        .find('', {userId: this.loggedInUserId, exerciseId: this.exercise.id})
        .then(response => {
            this.exerciseStatistics = response;
            console.log(this.exerciseStatistics);
        }).catch(error => {
            console.log(error);
        })
    }

    attached(){
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
              this.getDaySetsList();
            })

            cb(start, end);
        });
    }
}