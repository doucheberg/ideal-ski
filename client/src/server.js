import axios from "axios";

const getSkiers = async () =>  axios.get("api/skiers").then((response) => response.data);
const createSkier = async (skier) =>  axios.post("api/skiers", skier).then(res => res.data);
const deleteSkier = async (id) =>  axios.delete(`api/skiers/${id}`);

const getRaces = async () => axios.get("api/races").then(resp => resp.data);
const createRace = async (race) =>  axios.post("api/races", race).then(res => res.data._id);
const deleteRace = async (id) =>  axios.delete(`api/races/${id}`);

export default {
  getSkiers,
  createSkier,
  deleteSkier,
  getRaces,
  createRace,
  deleteRace
}