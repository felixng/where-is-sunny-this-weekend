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
      data.location.city,
      data.location.country_iso3166,
      data.conditions,
      data.high.celsius.trim() == '' ? 0 : data.high.celsius.trim(),
      data.low.celsius.trim() == '' ? 0 : data.low.celsius.trim(),
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
        console.error(`error running sql query: ${sql}`);
        console.error(e.stack);
        return res(err);
      });
  });
};

const cityCriteria = row => {
  return row.type === 'large_airport' && row.name !== 0 && row.isocountry !== 0;
};

const filterCities = rows => {
  return rows.filter(cityCriteria);
};

const extractCityWeather = body => {
  if (body.forecast) {
    var days = body.forecast.simpleforecast.forecastday;
    days.map(day => (day.location = body.location));

    return Promise.all(days.map(saveCityWeather));
  }

  console.error("API didn't return forecasts!");
};

module.exports = {
  saveCityWeather,
  extractCityWeather,
  filterCities
};
