const { getCityWeather, getCityList } = require('./wunderground-requests');
const { Observable } = require('rxjs');

const getAllWeather = async () => {
  var PromiseThrottle = require('promise-throttle');
  console.log('getting all weather');
  //Throttling 10 calls per minute
  var promiseThrottle = new PromiseThrottle({
    requestsPerSecond: 0.16,
    promiseImplementation: Promise
  });

  promiseThrottle.add(getCityWeather);

  Observable.fromPromise(getCityList())
    .flatMap(cities => filterCities(cities))
    .map(cities => {
      return cities.slice(1, 100).map(city => {
        var data = {
          countryCode: city.isocountry,
          city: city.name
        };
        promiseThrottle
          .add(getCityWeather.bind(this, data))
          .then(extractCityWeather);
      });
    })
    .catch(err => {
      console.error('Couldnt get weather');
      console.log(err);
    });

  console.log('all done');
};

module.exports = {
  getAllWeather
};
