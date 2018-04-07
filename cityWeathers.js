const db = require('./db');

const saveCityWeather = body => {
  return new Promise((res, rej) => {
    const ts = Math.round(new Date().getTime() / 1000);
    const row = [ts, 'London', 'GB', body];
    const sql =
      'INSERT INTO city_weathers(date, city, country, forecast) VALUES($1, $2, $3, $4) RETURNING *';
    db
      .query(sql, row)
      .then(result => {
        //console.log(res.rows[0])
        return res(result.rows[0]);
      })
      .catch(e => {
        console.error(e.stack);
        return rej(e);
      });
  });
};

module.exports = {
  saveCityWeather
};
