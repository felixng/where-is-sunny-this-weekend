const express = require('express');
const dotenv = require('dotenv');
const config = dotenv.config();
const mountRoutes = require('./routes');
const bodyParser = require('body-parser');
const app = express();
const { Observable } = require('rxjs');
const { createRxMiddleware } = require('./utils/rx-middleware');
const { main } = require('./main');
const {
  getClearCityList,
  weatherNotExists,
  extractCityWeather,
  filterCities
} = require('./weather-repo');
const { getCityWeather, getCityList } = require('./wunderground-requests');

var PromiseThrottle = require('promise-throttle');

//Throttling 10 calls per minute
var promiseThrottle = new PromiseThrottle({
  requestsPerSecond: 0.16,
  promiseImplementation: Promise
});

app.use(bodyParser.json());
mountRoutes(app);

app.get(
  '/fetch/',
  createRxMiddleware(req$ =>
    req$.mergeMap(() =>
      Observable.fromPromise(getCityList())
        .map(cities => filterCities(cities))
        .mergeMap(cities => {
          return Observable.forkJoin(
            ...cities.slice(1, 30).map(city =>
              promiseThrottle
                .add(
                  getCityWeather.bind(this, {
                    countryCode: city.isocountry,
                    city: city.name
                  })
                )
                .then(extractCityWeather)
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

app.get('/list/get/', async (req, res, next) => {
  getClearCityList().then(list => {
    res.json(list);
  });
});

app.get('/', (req, res) => {
  res.sendStatus(200);
});

// Start the app and listen on port 3000
app.listen(3000);
