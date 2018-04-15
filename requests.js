const request = require('request');
const baseUrl = 'http://api.wunderground.com/api';
const apiKey = process.env.API_KEY;
const forecast10daysUrl = `${baseUrl}/${apiKey}/geolookup/conditions/forecast10day/q`;
const cityUrl = process.env.CITY_URL;

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

            if (parsedBody.location && parsedBody.location.city != city) {
              console.log(
                `Name mismatch - weathering API returning ${
                  parsedBody.location.city
                } instead of ${city}.  Overriding.`
              );
              parsedBody.location.city = city;
            }

            return res(parsedBody);
          }

          console.error(
            `Couldn't get weather with status code: ${_.statusCode}`
          );
          return rej(err);
        }
      );
    });
  },
  getCityList() {
    return new Promise((res, rej) => {
      request.get(
        {
          url: cityUrl
        },
        (err, _, body) => {
          const parsedBody = JSON.parse(body);
          if (!err && _.statusCode === 200) {
            console.log(
              'Get city list succeed with status code: ',
              _.statusCode
            );

            return res(parsedBody.rows);
          }

          console.error(
            `Couldn't get city list with status code: ${_.statusCode}`
          );
          return rej(err);
        }
      );
    });
  }
};
