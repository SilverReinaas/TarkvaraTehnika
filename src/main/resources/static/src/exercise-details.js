import {inject, bindable} from 'aurelia-framework';
import {Endpoint} from 'aurelia-api';
import {Router} from 'aurelia-router';

@inject(Endpoint.of('getExerciseById'),
        Endpoint.of('addMeasureLog'),
        Endpoint.of('getExerciseSetsToday'),
        Endpoint.of('getDaySetsList'),
        Router)
export class Details{

    @bindable valueInputs = null;
    @bindable exercise = null;
    unitTypeIds = [];
    unitTypes = [];
    @bindable setsToday = null;
    @bindable setsByDay = null;


    constructor(exerciseEndpoint, addMeasureLogEndpoint, getExerciseSetsTodayEndpoint, getDaySetsListEndpoint, router) {
        this.exerciseEndpoint = exerciseEndpoint;
        this.addMeasureLogEndpoint = addMeasureLogEndpoint;
        this.getExerciseSetsTodayEndpoint = getExerciseSetsTodayEndpoint;
        this.getDaySetsListEndpoint = getDaySetsListEndpoint;
        this.valueInputs = [];
        this.setsToday = [];
        this.daySetsList = [];
        this.router = router;
        this.exercise;
    }
    activate(params) {
        this.getExercise(params.id);
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
            this.getDaySetsList(response);
            this.fillValueInputs(response);
            console.log(JSON.stringify(response));
          })
          .catch(error => {
            console.log(error);
          });
    }
    addMeasureLog() {
//        let measurements = {};
//        
//        for (let i = 0; i < this.unitTypeIds.length; i++) {
//            measurements[this.unitTypeIds] = this.unitTypes;
//        }
        this.addMeasureLogEndpoint
         .post('', {exerciseId: this.exercise.id, unitTypes: this.exercise.unitTypes, values: this.valueInputs})
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

    getExerciseSetsToday(exercise){
        this.getExerciseSetsTodayEndpoint
        .find('', {id: exercise.id})
        .then(response => {
            this.setsToday = response;
            console.log(response);
        })
        .catch(error => {
            console.log(error);
        })
    }
    getDaySetsList(exercise){
        this.getDaySetsListEndpoint
        .find('', {id: exercise.id})
        .then(response => {
            console.log("Sets by date: ");
            this.daySetsList = response;
            console.log(response);
        })
        .catch(error => {
            console.log(error);
        })
    }

    attached(){
        $(function() {

            var start = moment().subtract(7, 'days');
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
            $('#reportrange').on('apply.daterangepicker', function(ev, picker) {
              console.log(picker.startDate.format('YYYY-MM-DD'));
              console.log(picker.endDate.format('YYYY-MM-DD'));
            });

            cb(start, end);

        });
    }
}