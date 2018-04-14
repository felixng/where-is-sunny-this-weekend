const express = require('express');
const dotenv = require('dotenv');
const config = dotenv.config();
const mountRoutes = require('./routes');
const bodyParser = require('body-parser');
const app = express();
const { Observable } = require('rxjs');
const { createRxMiddleware } = require('./utils/rx-middleware');
const { main } = require('./weather');
const { extractCityWeather, filterCities } = require('./cityWeathers');
const { getCityWeather, getCityList } = require('./requests');

app.use(bodyParser.json());
mountRoutes(app);

app.get(
  '/api/',
  createRxMiddleware(req$ =>
    req$.mergeMap(() =>
      Observable.fromPromise(getCityList())
        .map(cities => filterCities(cities))
        .mergeMap(cities => {
          return Observable.forkJoin(
            ...cities.map(city =>
              getCityWeather({
                city: city.name,
                countryCode: city.isocountry
              }).then(extractCityWeather)
            )
          );
        })
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
