const mongoose = require('mongoose');

module.exports = mongoose.model('renn', {
  year: Number,
  skiers: []
}, 'renn');