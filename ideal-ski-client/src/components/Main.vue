<template>
  <div>
    <sui-menu>
      <sui-menu-item><a class="menu" v-on:click="mode = 'run';">Tidtakning</a></sui-menu-item>
      <sui-menu-item><a class="menu" v-on:click="highscoreClick">Highscore</a></sui-menu-item>
      <sui-menu-item><input type="checkbox" v-model="register" id="reg" class="menu"><label for="reg">Registrering</label></sui-menu-item>
      <sui-menu-item><span style="float: right; margin:2px">{{time}}</span></sui-menu-item>
  </sui-menu>
  <table v-if="mode == 'run'">
    <thead>
      <tr>
        <th>Startnr</th>
        <th>Navn</th>
        <th></th>
        <th>Runde 1</th>
        <th>Runde 2</th>
        <th>Idealtid</th>
        <th>Rediger</th>
        <th>Start</th>
        <th>Runde</th>
        <th>Mål</th>
      </tr>
    </thead>
    <tbody>
      <Skier v-for="(skier, index) in skiersSorted" v-bind:key="index" :now="now" :skier="skier" :index="index" v-on:edit="editSkier" v-on:update="updateSkier" />
    </tbody>
    </table>
     <Register v-if="register" v-on:register="addSkier"/>
     <Highscore v-if="mode == 'highscore'" :skiers="skiersSorted" />
     <Edit v-if="edit" :skier="selectedSkier" :index="selectedSkierIndex" v-on:edit="updateSkier" />
  </div>
</template>

<script>
import Skier from "@/components/Skier";
import Register from "@/components/Register";
import Highscore from "@/components/Highscore";
import Edit from "@/components/Edit";

export default {
  name: "Main",
  components: { Skier, Register, Highscore, Edit },
  methods: {
    addSkier(skier) {
      this.skiers.push(skier);
    },
    findSkierIndex(skier){
      for(let i = 0; i < this.skiers.length; i++){
        if(this.skiers[i].firstName === skier.firstName) return i;
      }
      return null;
    },
    updateSkier(skier) {
      const newSkiers = this.skiers.slice(0);
      const skierIndex = this.findSkierIndex(skier);
      console.log(newSkiers);
      newSkiers[skierIndex] = Object.assign({}, newSkiers[skierIndex], skier);
      this.skiers = newSkiers;
      this.edit = false;
    },
    editSkier(skier, index) {
      this.selectedSkier = skier;
      this.selectedSkierIndex = index;
      this.edit = true;
    },
    highscoreClick() {
      this.mode = "highscore";
    }
  },
  mounted() {
    setInterval(() => {
      this.now = Math.round(new Date().valueOf() / 1000);
      this.time = new Date().toLocaleTimeString("it-IT");
    }, 333);
  },
  computed: {
    skiersSorted() {
     let copy = this.skiers.slice(0);
       copy.sort((a, b) => {
        return a.startNumber - b.startNumber;
      });
      return copy;
    }
  },
  data() {
    return {
      time: "00:00:00",
      now: new Date().valueOf(),
      mode: "run",
      register: false,
      edit: false,
      selectedSkier: null,
      selectedSkierIndex: 0,
      skiers: [
        { firstName: "Kristian Mehus", state: 0, startNumber: 99999 },
        { firstName: "Jan Olav Fredriksen", state: 0, startNumber: 99999 },
        { firstName: "Eira Kristine Håkonsen", state: 0, startNumber: 99999 },
        { firstName: "Berit Olsen", state: 0, startNumber: 99999 },
        { firstName: "Kjersti Haugen", state: 0, startNumber: 99999 },
        { firstName: "Lars Håkonsen", state: 0, startNumber: 99999 },
        { firstName: "Andreas Mehus", state: 0, startNumber: 99999 },
        { firstName: "Ragnar Niemi Berg", state: 0, startNumber: 99999 },
        { firstName: "Marius Lehnes", state: 0, startNumber: 99999 },
        { firstName: "Tor Hansen", state: 0, startNumber: 99999 },
        { firstName: "Birgit Solem", state: 0, startNumber: 99999 },
        { firstName: "Emilie Hogstad Haugen", state: 0, startNumber: 99999 },
        { firstName: "Maiken Lehnes", state: 0, startNumber: 99999 },
        { firstName: "Hege Rustad", state: 0, startNumber: 99999 },
        { firstName: "Markus Solem", state: 0, startNumber: 99999 },
        { firstName: "Magnus Håkonsen", state: 0, startNumber: 99999 },
        { firstName: "Håvard Bakka", state: 0, startNumber: 99999 },
        { firstName: "Håkon Rustad", state: 0, startNumber: 99999 },
        { firstName: "Bjørn Hervik", state: 0, startNumber: 99999 },
        { firstName: "Bjørg Bakka", state: 0, startNumber: 99999 },
        { firstName: "Mari Ono", state: 0, startNumber: 99999 },
        { firstName: "Ida Sofie Dahl", state: 0, startNumber: 99999 },
        { firstName: "Petter Mehus", state: 0, startNumber: 99999 },
        { firstName: "Iver Rustad", state: 0, startNumber: 99999 },
        { firstName: "Helena Solem", state: 0, startNumber: 99999 },
        { firstName: "Annie Dahl", state: 0, startNumber: 99999 },
        { firstName: "Magne Lehnes", state: 0, startNumber: 99999 },
        { firstName: "Kjetil Dahl", state: 0, startNumber: 99999 },
        { firstName: "Gunnar Lindbeck", state: 0, startNumber: 99999 },
        { firstName: "Tobias H Halvorsen", state: 0, startNumber: 99999 },
        { firstName: "Trine & Elias Hogstad", state: 0, startNumber: 99999 },
        { firstName: "Per Åge Kjerneli", state: 0, startNumber: 99999 },
        { firstName: "Kristine Dahl", state: 0, startNumber: 99999 },
        { firstName: "Anders Ono", state: 0, startNumber: 99999 },
        { firstName: "Oliver H Halvorsen", state: 0, startNumber: 99999 },
        { firstName: "Birk Bakka", state: 0, startNumber: 99999 },
        { firstName: "Ingrid Ono", state: 0, startNumber: 99999 },
        { firstName: "Tina Akerholt", state: 0, startNumber: 99999 },
        { firstName: "Gerd Berget", state: 0, startNumber: 99999 },
        { firstName: "Sara Madelen Mathiesen", state: 0, startNumber: 99999 }
      ]
    };
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped >
table {
  width: 100%;
  border-collapse: collapse;
  margin: 4px;
}
th {
  text-align: left;
}
tr {
  border-bottom: 1px solid #f2f2f2;
}
td {
  padding-top: 5px;
  padding-bottom: 5px;
}

.menu {
  cursor: pointer;
}
</style>
