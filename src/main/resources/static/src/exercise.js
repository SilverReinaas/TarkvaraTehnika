import {inject, bindable} from 'aurelia-framework';
import {Endpoint} from 'aurelia-api';
import {UserAware} from 'user_aware';
import {Router} from 'aurelia-router';

@inject(Endpoint.of('addExercise'), Endpoint.of('getUnitTypes'), Endpoint.of('getMuscles'), Router)
export class Exercise extends UserAware {

    @bindable unitTypes;
    @bindable muscles;

	name = '';
	description = '';
	selectedUnitTypes = [];
	selectedMuscles = [];

	constructor(addExerciseEndpoint, getUnitTypesEndpoint, getMusclesEndpoint, router) {
	    super();
		this.addExerciseEndpoint = addExerciseEndpoint;
		this.getUnitTypesEndpoint = getUnitTypesEndpoint;
		this.getMusclesEndpoint = getMusclesEndpoint;
		this.getUnitTypes();
		this.getMuscles();
		this.router = router;
	};

    getUnitTypes() {
        this.getUnitTypesEndpoint
            .find('')
            .then(response => {
                this.unitTypes = response;
            })
            .catch(error => {
                console.log(error);
            });
    }

    getMuscles() {
         this.getMusclesEndpoint
             .find('')
             .then(response => {
                 this.muscles = response;
             })
             .catch(error => {
                 console.log(error);
             });
    }

    addExercise() {
        this.selectedUnitTypes = this.selectedUnitTypes.map(Number);
        this.selectedMuscles = this.selectedMuscles.map(Number);
        console.log(this.loggedInUserId, this.name, this.description, this.selectedUnitTypes, this.selectedMuscles);
    
		this.addExerciseEndpoint
		  .post('', {
		  name: this.name,
		  description: this.description,
		  userId: this.loggedInUserId,
		  unitTypeIds: this.selectedUnitTypes,
		  muscleIds: this.selectedMuscles
		  })
		  .then(
		    this.router.navigateToRoute('dashboard',"")
		  )
          .catch(console.error);
    };
  
}
