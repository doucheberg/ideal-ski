const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const db = require("./db");

app.use(express.static("static"));

app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

app.get("/api", (req, res) => {
  res.send(`Time is ${new Date().toString()}`);
});

app.get("/api/users/:year", (req, res) => {
  const year = Number(req.params["year"]) || 2018;
  db.once("open");
});

app.get("/api/skiers", async (req, res) => {
  const skiers = await db.Skier.find();
  res.send(skiers);
});
app.post("/api/skiers", async (req, res) => {
  const skier = await new db.Skier(req.body).save();
  res.send(skier);
});
app.delete("/api/skiers/:id", async (req, res) => {
  await db.Skier.deleteOne({ _id: req.params.id });
  res.send("Deleted");
});

app.post("/api/races", async (req, res) => {
  if (req.body._id) {
    const race = db.Race.findByIdAndUpdate(req.body._id, req.body);
    return race;
  } else {
    const race = new db.Race(req.body);
    race.markModified("skiers");
    race.save();
    res.send(race);
  }
});

app.get("/api/races", async (req, res) => {
  const races = await db.Race.find();
  res.send(races);
});

app.delete("/api/races/:id", async (req, res) => {
  await db.Race.deleteOne({ _id: req.params.id });
  res.send("Deleted");
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

const findCollections = (db, collectionName, callback) => {
  // Get the documents collection
  const collection = db.collection(collectionName);
  // Find some documents
  collection.find({}, { fields: { runners: 0 } }).toArray(function(err, docs) {
    if (err) {
      console.log(err);
    }
    callback(docs);
  });
};

