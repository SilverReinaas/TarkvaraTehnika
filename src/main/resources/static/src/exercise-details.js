import {inject, bindable} from 'aurelia-framework';
import {Endpoint} from 'aurelia-api';
import {Router} from 'aurelia-router';

@inject(Endpoint.of('getExerciseById'), Endpoint.of('addMeasureLog'), Endpoint.of('getMeasureLogsById'), Endpoint.of('getExerciseSetsToday'), Router)
export class Details{

    @bindable valueInputs = null;
    @bindable exercise = null;
    @bindable measure_logs;
    unitTypeIds = [];
    unitTypes = [];
    @bindable setsToday = null;

    constructor(exerciseEndpoint, addMeasureLogEndpoint, getExerciseSetsTodayEndpoint, getMeasureLogsByIdEndpoint, router) {
        this.exerciseEndpoint = exerciseEndpoint;
        this.addMeasureLogEndpoint = addMeasureLogEndpoint;
        this.getMeasureLogsByIdEndpoint = getMeasureLogsByIdEndpoint;
        this.getExerciseSetsTodayEndpoint = getExerciseSetsTodayEndpoint;
        this.valueInputs = [];
        this.setsToday = [];
        this.router = router;
        this.exercise;
    }
    activate(params) {
        this.getExercise(params.id);
        this.getMeasureLogsById(params.id);
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
         })
         .catch(error => {
           console.log(error);
         })
    }
    getMeasureLogsById(exerciseId) {
		this.getMeasureLogsByIdEndpoint
		  .find('', {exerciseId: exerciseId})
          .then(response => {
            this.measure_logs = response;
          })
          .catch(error => {
            console.log(error);
          });
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
}