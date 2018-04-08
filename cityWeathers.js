const db = require('./db');
const moment = require('moment');

const dateFormat = 'DD-MM-YYYY';

const saveCityWeather = day => {
  return new Promise((res, rej) => {
    var currentDate = moment().format(dateFormat);
    var forecastDate = moment.unix(day.date.epoch).format(dateFormat);
    const row = [currentDate, forecastDate, 'London', 'GB', day, moment()];
    const sql =
      'INSERT INTO cityweathers(currentDate, forecastDate, city, countrycode, forecast, timestamp) VALUES($1, $2, $3, $4, $5, $6) RETURNING *';

    db
      .query(sql, row)
      .then(result => {
        return res(result.rows[0]);
      })
      .catch(e => {
        console.error(e.stack);
        return rej(e);
      });
  });
};

const extractCityWeather = body => {
  if (body.forecast) {
    var days = body.forecast.simpleforecast.forecastday;
    return Promise.all(days.map(saveCityWeather));
  }

  console.error("API didn't return forecasts!");
};

module.exports = {
  saveCityWeather,
  extractCityWeather
};
