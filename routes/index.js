// ./routes/index.js
const weathers = require('./weathers');

module.exports = app => {
  app.use('/weathers', weathers);
};
