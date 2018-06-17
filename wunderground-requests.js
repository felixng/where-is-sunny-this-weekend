const request = require('request');
const baseUrl = 'http://api.wunderground.com/api';
const apiKey = process.env.API_KEY;
const forecast10daysUrl = `${baseUrl}/${apiKey}/geolookup/conditions/forecast10day/q`;
const cityUrl = process.env.CITY_URL;
const { weatherNotExists } = require('./weather-repo');

const getCityWeatherExternal = ({ countryCode, city }) => {
  return new Promise((res, rej) => {
    request.get(
      {
        url: forecast10daysUrl + `/${countryCode}/${city}.json`
      },
      (err, _, body) => {
        try {
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
        } catch (e) {
          console.log("API didn't return proper JSON: ", e);
        }

        console.error(`Couldn't get weather with status code: ${_.statusCode}`);
        return rej(err);
      }
    );
  });
};

module.exports = {
  getCityWeather({ countryCode, city }) {
    return new Promise((res, rej) => {
      weatherNotExists({ countryCode, city }).then(notExist => {
        if (notExist) {
          return res(getCityWeatherExternal({ countryCode, city }));
        }

        return rej(`${city} already has data for the today.`);
      });
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
