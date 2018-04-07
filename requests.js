const request = require('request');
const baseUrl = 'http://api.wunderground.com/api';
const apiKey = process.env.API_KEY;
const forecast10daysUrl = `${baseUrl}/${apiKey}/geolookup/conditions/forecast10day/q`;

module.exports = {
  getCityWeather({ countryCode, city }) {
    console.log(forecast10daysUrl + `/${countryCode}/${city}.json`);
    return new Promise((res, rej) => {
      request.get(
        {
          url: forecast10daysUrl + `/${countryCode}/${city}.json`
        },
        (err, _, body) => {
          const parsedBody = JSON.parse(body);
          if (!err && _.statusCode === 200) {
            console.log('Get weather succeed with status code: ', _.statusCode);

            return res(parsedBody);
          }

          console.error(
            `Couldn't get weather with status code: ${_.statusCode}`
          );
          return rej(err);
        }
      );
    });
  }
};
