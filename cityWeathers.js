const db = require('./db');
const moment = require('moment');

const dateFormat = 'DD-MM-YYYY';

const saveCityWeather = data => {
  return new Promise((res, rej) => {
    var currentDate = moment().format(dateFormat);
    var forecastDate = moment.unix(data.date.epoch).format(dateFormat);
    const row = [
      currentDate,
      forecastDate,
      'London',
      'GB',
      data.conditions,
      data.high.celsius,
      data.low.celsius,
      data
    ];

    const sql = `INSERT INTO weathers("currentDate", 
                            "forecastDate", 
                            "city", 
                            "countryCode", 
                            "conditions",
                            "high",
                            "low",
                            "raw") 
       VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`;

    db
      .query(sql, row)
      .then(result => {
        return res(result.rows[0]);
      })
      .catch(err => {
        if (err.code == 23505) {
          return res(err.detail);
        }
        // console.error(e.stack);
        return rej(err);
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
