const Router = require('express-promise-router');
const db = require('../db');

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
    'SELECT * FROM weathers WHERE conditions LIKE $1',
    [`%Clear%`]
  );
  res.send(rows);
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
