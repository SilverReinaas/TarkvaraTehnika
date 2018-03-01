import {UserAware} from 'user_aware';
import {HttpClient, json} from 'aurelia-fetch-client';
import {bindable} from "aurelia-framework";

let httpClient = new HttpClient();

export class Dashboard extends UserAware {

    @bindable exercises;

    constructor(authService){
        super();
        //this.exercises = [{"name":"test1"}, {"name": "test2"}];
        //this.exercises = this.getExercises();
        this.exercises = [];
        this.getExercises();
    }

    getExercises(){
            let httpClient = new HttpClient();
            httpClient
                  .fetch('getUserExercises', {
                    method: 'post',
                    body: this.loggedInUserId
                  })
                  .then(response => response.json())
                  .then(response => {
                    console.log(JSON.stringify(response));
                    this.exercises = response;
                  })
                  .catch(error => {
                    console.log('Error!');
                  });
    }
}