import {inject, bindable} from 'aurelia-framework';
import {Endpoint} from 'aurelia-api';
import {UserAware} from 'user_aware';

@inject(Endpoint.of('addExercise'), Endpoint.of('getUnitTypes'))
export class Exercise extends UserAware {

    @bindable unitTypes;

	name = '';
	description = '';
	selectedUnitTypes = [];

	constructor(addExerciseEndpoint, getUnitTypesEndpoint) {
	    super();
		this.addExerciseEndpoint = addExerciseEndpoint;
		this.getUnitTypesEndpoint = getUnitTypesEndpoint;
		this.getUnitTypes();
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
		  .then(console.log)
          .catch(console.error);
    };
  
}
