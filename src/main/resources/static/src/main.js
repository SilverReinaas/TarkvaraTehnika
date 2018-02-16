import authConfig from './authConfig';

export function configure(aurelia) {
   aurelia.use
   .standardConfiguration()
   .developmentLogging()
    .plugin('aurelia-api', config => {
      config.registerEndpoint('auth', '/auth');
    })
    .plugin('aurelia-authentication', baseConfig => {
        baseConfig.configure(authConfig);
    });

   aurelia.start().then(() => aurelia.setRoot());
}
