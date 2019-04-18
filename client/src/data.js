import server from "./server";
import uuid from 'uuid';
const skiersKey = 'ideal.skiers';
const racesKey = 'ideal.races';
const currentRaceKey = 'ideal.currentrace';

// we store race and skiers in localstorage

const setCache = (key, data) => window.localStorage.setItem(key, JSON.stringify(data));
const getCache = (key) => {
  const json = window.localStorage.getItem(key);
  if(json){
    return JSON.parse(json);
  }
  return [];
}

const getSkiers = async (forceUpdate) => {
  if(!window.localStorage.getItem(skiersKey) || forceUpdate){
    const skiers = await server.getSkiers();
    setCache(skiersKey, skiers);
    return skiers;
  } else {
    return getCache(skiersKey);
  }
};

let skiersToBeUploaded = [];
const createSkier = async (skier) =>  {
  const newSkier = {...skier, _id: uuid.v1()};
  skiersToBeUploaded.push(newSkier);
  const skiers = await getSkiers();
  skiers.push(newSkier);
  setCache(skiersKey, skiers);
  return newSkier;
};

const deleteSkier = server.deleteSkier;

const getRaces = async (forceUpdate) => {
  if(!window.localStorage.getItem(racesKey) || forceUpdate){
    const races = await server.getRaces();
    setCache(racesKey, races);
    return races;
  } else {
    return getCache(racesKey);
  }
};

function setCachedRace(race){
  console.time('save cached race');
  window.localStorage.setItem(currentRaceKey, JSON.stringify(race));
  console.timeEnd('save cached race');
}

let cachedRace = getCachedRace() || {name: "Nytt renn", skiers: []};
function getCachedRace(){
  if(!cachedRace){
    const json = window.localStorage.getItem(currentRaceKey);
    if(json) cachedRace = JSON.parse(json);
  }
  return cachedRace;
}

function removedCachedRace(){
  window.localStorage.removeItem(currentRaceKey);
}


const createRace = async(race) => {
  const cached = getCachedRace();
  if(cached){
    setCachedRace(race);
    return race.id;
  }
  else return server.createRace;
};
const deleteRace = server.deleteRace;

async function updateCache() {
  if(skiersToBeUploaded.length > 0){
    await Promise.all(skiersToBeUploaded.map(s => server.createSkier(s)));
    skiersToBeUploaded = [];
  }
  await getSkiers(true);
  await getRaces(true);
}

function clearCache() {
  localStorage.removeItem(skiersKey);
  localStorage.removeItem(racesKey);
  localStorage.removeItem(currentRaceKey);
}

export default {
  getSkiers,
  createSkier,
  deleteSkier,
  getRaces,
  createRace,
  deleteRace,
  updateCache,
  setCachedRace,
  getCachedRace,
  removedCachedRace,
  clearCache
}
