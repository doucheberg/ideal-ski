const mongoose = require('mongoose');

const renn = require('./models/renn');
const Skier = require('./models/skier');
const Race = require('./models/race');

const dbString = "mongodb+srv://paske:StoredInGithubCode2018!@paske.tnt0l.mongodb.net/paske?retryWrites=true&w=majority";
mongoose.connect(dbString, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
module.exports = {
  renn,
  Race,
  Skier
}
