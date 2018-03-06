import {inject, bindable} from 'aurelia-framework';
import {Endpoint} from 'aurelia-api';
import {Router} from 'aurelia-router';

@inject(Endpoint.of('getExerciseById'), Endpoint.of('addMeasureLog'), Endpoint.of('getExerciseSetsToday'), Endpoint.of('getExerciseSets'), Router)
export class Details{

    @bindable valueInputs = null;
    @bindable exercise = null;
    unitTypeIds = [];
    unitTypes = [];
    @bindable setsToday = null;
    @bindable sets = null;


    constructor(exerciseEndpoint, addMeasureLogEndpoint, getExerciseSetsTodayEndpoint, getExerciseSetsEndpoint, router) {
        this.exerciseEndpoint = exerciseEndpoint;
        this.addMeasureLogEndpoint = addMeasureLogEndpoint;
        this.getExerciseSetsTodayEndpoint = getExerciseSetsTodayEndpoint;
        this.getExerciseSetsEndpoint = getExerciseSetsEndpoint;
        this.valueInputs = [];
        this.setsToday = [];
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
            this.getExerciseSets(response);
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
           this.getExerciseSets(this.exercise);
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
    getExerciseSets(exercise){
        this.getExerciseSetsTodayEndpoint
        .find('', {id: exercise.id})
        .then(response => {
            this.sets = response;
            console.log(response);
        })
        .catch(error => {
            console.log(error);
        })
    }
}