const express = require('express');
const mountRoutes = require('./routes');
const bodyParser = require('body-parser');
const app = express();
const { Observable } = require('rxjs');
const { createRxMiddleware } = require('./utils/rx-middleware');
const { main } = require('./weather');
const { saveCityWeather } = require('./cityWeathers');
const { getCityWeather } = require('./requests');

var city = 'London';
var countryCode = 'UK';

app.use(bodyParser.json());
mountRoutes(app);

app.get(
  '/api/',
  createRxMiddleware(req$ =>
    req$.mergeMap(() =>
      Observable.fromPromise(getCityWeather({ countryCode, city }))
        .mergeMap(body => Observable.fromPromise(saveCityWeather(body)))
        .catch(err => {
          console.error('Couldnt get weather');
          console.log(err);
        })
    )
  )
);

// app.get('/', main);

/**
 * Get the time table
 * params: void
 * return: Object
 */
// app.get('/api/table', createRxMiddleware((req$) =>
//   req$
//     .flatMap(() =>
//       Observable
//         .fromPromise(login({ shouldSetCookies: true }).then(() => login({ email, password })))
//         .flatMap(() => Observable.fromPromise(getGymboxTimeTable()))
//         .flatMap(extractTimeTable)
//         .catch((err) => {
//           console.error('Couldnt get the time table')
//           // throw new Error(err);
//         })
//     )
// ));

// Start the app and listen on port 3000
app.listen(3000);
