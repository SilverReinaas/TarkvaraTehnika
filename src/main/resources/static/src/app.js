export class App {
	router: Router;
	
	configureRouter(config, router) {
		this.router = router;

		config.map([
		    { route: '', name: 'home', moduleId: './home', title: 'Home', nav: false },
			{ route: 'login', name: 'login', moduleId: './login' , title: 'Log in', nav: false },
			{ route: 'logout', name: 'logout', moduleId: './logout' , title: 'Log out', nav: false, auth: true },
			{ route: 'dashboard', name: 'dashboard', moduleId: './dashboard', title: 'Dashboard', nav: true, auth: true },
			{ route: 'exercise', name: 'exercise', moduleId: './exercise', title: 'Add exercise', nav: true, auth: true },
			{ route: 'analytics', name: 'analytics', moduleId: './analytics', title: 'Analytics', nav: true, auth: true },
			{ route: 'exercise-details', name: 'exercise-details', moduleId: './exercise-details', title: 'Exercise details', nav: false, auth: true },
            { route: 'description', name: 'description', moduleId: './description', title: 'Exercise description', nav: false, auth: true },
            { route: 'log-this', name: 'log-this', moduleId: './log-this', title: 'Log this Exercise', nav: false, auth: true },
            { route: 'history', name: 'history', moduleId: './history', title: 'History', nav: false, auth: true }
		]);
	}
}
