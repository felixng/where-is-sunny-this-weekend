exports.up = pgm => {
  pgm.createTable('weathers', {
    id: 'id',
    currentDate: { type: 'varchar(1000)', notNull: true },
    forecastDate: { type: 'varchar(1000)', notNull: true },
    city: { type: 'varchar(1000)', notNull: true },
    countryCode: { type: 'varchar(1000)', notNull: true },
    conditions: { type: 'varchar(1000)', notNull: true },
    high: { type: 'int', notNull: true },
    low: { type: 'int', notNull: true },
    raw: { type: 'varchar(1000)', notNull: true },
    createdAt: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp')
    }
  });
};

exports.down = pgm => {
  pgm.dropTable('weathers', { ifExists: true });
};
