const { getCityWeather } = require('./requests');

const main = () => {
  getCityWeather({ country: 'UK', city: 'London' }).catch(err => {
    let errorMessage;

    if (typeof err === 'string') {
      errorMessage = err;
    }

    if (err instanceof Error) {
      errorMessage = err.message;
    }

    if (typeof err === 'object' && err.Message) {
      errorMessage = err.Message;
    }

    console.error('error: ', errorMessage);
  });
};

module.exports = {
  main
};
