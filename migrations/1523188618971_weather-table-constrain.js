exports.up = pgm => {
  pgm.addConstraint('weathers', 'currentdate_forecastdate_city_country', {
    unique: ['currentDate', 'forecastDate', 'city', 'countryCode']
  });
};

exports.down = pgm => {
  pgm.dropConstraint('weathers', 'currentdate_forecastdate_city_country', {
    ifExists: true
  });
};
