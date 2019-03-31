const mongoose = require('mongoose');

module.exports = mongoose.model('Race', {
  name: String,
  skiers: []
});