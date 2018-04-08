exports.up = pgm => {
  pgm.alterColumn('weathers', 'raw', { type: 'text' });
};

exports.down = pgm => {
  pgm.alterColumn('weathers', 'raw', { type: 'varchar(1000)' });
};
