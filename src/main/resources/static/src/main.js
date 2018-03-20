import authConfig from './authConfig';

export function configure(aurelia) {
   aurelia.use
   .standardConfiguration()
   .developmentLogging()
    .plugin('aurelia-api', config => {
      config
        .registerEndpoint('auth', '/auth')
        .registerEndpoint('addExercise', '/addExercise')
        .registerEndpoint('getUserExercises', '/getUserExercises')
        .registerEndpoint('getUnitTypes', '/getUnitTypes')
        .registerEndpoint('addMeasureLog', '/addMeasureLog')
        .registerEndpoint('getExerciseById', '/getExerciseById')
        .registerEndpoint('getExerciseSetsToday', '/getExerciseSetsToday')
        .registerEndpoint('getExerciseSets', '/getExerciseSets')
        .registerEndpoint('getMuscles', '/getMuscles')
        .registerEndpoint('getSetsByDate', '/getSetsByDateList')
    })
    .plugin('aurelia-authentication', baseConfig => {
        baseConfig.configure(authConfig);
    });

   aurelia.start().then(() => aurelia.setRoot());
}
