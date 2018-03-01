export class App {  
	router: Router;
	
	configureRouter(config, router) {
		this.router = router;

		config.map([
		    { route: '', name: 'home', moduleId: './home', title: 'Home', nav: false },
			{ route: 'login', name: 'login', moduleId: './login' , title: 'Log in', nav: true },
			{ route: 'dashboard', name: 'dashboard', moduleId: './dashboard', title: 'Dashboard', nav: true, auth: true },
			{ route: 'exercise', name: 'exercise', moduleId: './exercise', title: 'Exercise', nav: true, auth: true }
		]);
	}	
}
