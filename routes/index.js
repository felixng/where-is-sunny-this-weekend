// ./routes/index.js
const cityWeathers = require('./cityWeather');

module.exports = app => {
  app.use('/cityWeather', cityWeathers);
};
