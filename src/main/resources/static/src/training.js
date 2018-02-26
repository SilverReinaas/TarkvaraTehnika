import {inject} from 'aurelia-framework';
import {Endpoint} from 'aurelia-api';

@inject(Endpoint.of('addTraining'))
export class Training {

	comment = '';
	trainingTime = null;
	endpoint = null;

	constructor(endpoint) {
		this.endpoint = endpoint;
	};

    addTraining() {
		this.trainingTime = Date.now();

		console.log(this.comment);
		console.log(this.trainingTime);

		this.endpoint
		  .post('', {comment: this.comment, trainingTime: this.trainingTime})
		  .then(console.log)
          .catch(console.error);
    };
  
}
