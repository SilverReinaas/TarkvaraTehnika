import {inject} from 'aurelia-framework';
import {Endpoint} from 'aurelia-api';

@inject(Endpoint.of('addExercise'))
export class Training {

	name = '';
	description = '';

	constructor(endpoint) {
		this.endpoint = endpoint;
	};

    addExercise() {
		this.endpoint
		  .post('addExercise', {name: this.name, description: this.description})
		  .then(console.log)
          .catch(console.error);
    };
  
}
