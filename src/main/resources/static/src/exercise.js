import {inject, bindable} from 'aurelia-framework';
import {Endpoint} from 'aurelia-api';
import {UserAware} from 'user_aware';
import {Router} from 'aurelia-router';

@inject(Endpoint.of('addExercise'), Endpoint.of('getUnitTypes'), Router)
export class Exercise extends UserAware {

    @bindable unitTypes;

	name = '';
	description = '';
	selectedUnitTypes = [];

	constructor(addExerciseEndpoint, getUnitTypesEndpoint, router) {
	    super();
		this.addExerciseEndpoint = addExerciseEndpoint;
		this.getUnitTypesEndpoint = getUnitTypesEndpoint;
		this.getUnitTypes();
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

    addExercise() {
        this.selectedUnitTypes = this.selectedUnitTypes.map(Number)
        console.log(this.loggedInUserId, this.name, this.description, this.selectedUnitTypes);
    
		this.addExerciseEndpoint
		  .post('', {name: this.name, description: this.description, userId: this.loggedInUserId, unitTypeIds: this.selectedUnitTypes}) 
		  .then(
		    this.router.navigateToRoute('dashboard',"")
		  )
          .catch(console.error);
    };
  
}
