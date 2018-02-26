export class App {  
	router: Router;
	
	configureRouter(config, router) {
		this.router = router;

		config.map([
		    { route: '', name: 'home', moduleId: './home', title: 'Home', nav: 'true' },
			{ route: 'login', name: 'login', moduleId: './login' , title: 'Log in', nav: 'true' },
			{ route: 'training', name: 'training', moduleId: './training', title: 'Training', nav: 'true' }
		]);
	}	
}
