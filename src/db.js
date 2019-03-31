const mongoose = require('mongoose');

const renn = require('./models/renn');
const Skier = require('./models/skier');
const Race = require('./models/race');

const dbString = "mongodb://paske:StoredInGithubCode2018!@ds033986.mlab.com:33986/paske";
mongoose.connect(dbString, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
module.exports = {
  renn,
  Race,
  Skier
}