const Router = require('express-promise-router');
const db = require('../db');
const moment = require('moment');

// create a new express-promise-router
// this has the same API as the normal express router except
// it allows you to use async functions as route handlers
const router = new Router();

// export our router to be mounted by the parent application
module.exports = router;

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const { rows } = await db.query('SELECT * FROM weathers WHERE id = $1', [id]);
  res.send(rows[0]);
});

router.get('/sunny/weekend', async (req, res) => {
  const { rows } = await db.query(
    'SELECT DISTINCT city FROM weathers WHERE conditions LIKE $1 and ("forecastDate" = $2 or "forecastDate" = $3)',
    [
      `%Clear%`,
      moment()
        .day(6)
        .format('DD-MM-YYYY'),
      moment()
        .day(7)
        .format('DD-MM-YYYY')
    ]
  );
  res.send(rows.map(row => row.city));
});

// router.post('/', async (req, res) => {
//   console.log(req.body);
//   const city = req.body.city;
//   const date = req.body.date;
//   const forecast = req.body.forecast;

//   const row = [date, city, forecast];
//   const { rows } = await db.query(
//     'INSERT INTO city_weathers(date, city, forecast) VALUES($1, $2, $3) RETURNING *',
//     row
//   );
//   res.send(rows[0]);
// });
