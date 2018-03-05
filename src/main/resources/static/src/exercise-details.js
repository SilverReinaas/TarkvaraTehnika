import {inject, bindable} from 'aurelia-framework';
import {Endpoint} from 'aurelia-api';
import {Router} from 'aurelia-router';

@inject(Endpoint.of('getExerciseById'), Endpoint.of('addMeasureLog'), Router)
export class Details{

    @bindable exercise;
    unitTypeIds = [];
    unitTypes = [];    

    constructor(exerciseEndpoint, addMeasureLogEndpoint, router) {
        this.exerciseEndpoint = exerciseEndpoint;
        this.addMeasureLogEndpoint = addMeasureLogEndpoint;
        
        this.router = router;
        this.exercise;
    }
    activate(params) {
        this.getExercise(params.id);
    }
    getExercise(exerciseId) {
        this.exerciseEndpoint
          .find('', {id : exerciseId})
          .then(response => {
            this.exercise = response;
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
         .post('', {exerciseId: this.exercise.id, unitTypeId: this.unitTypeIds, val: this.unitTypes})
         .then(response => {
           console.log(response);
         })
         .catch(error => {
           console.log(error);
         })
    }
}