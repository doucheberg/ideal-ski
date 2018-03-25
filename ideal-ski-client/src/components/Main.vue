<template>
  <div>
    <sui-menu>
      <sui-menu-item><a class="menu" v-on:click="mode = 'run';">Tidtakning</a></sui-menu-item>
      <sui-menu-item><a class="menu" v-on:click="highscoreClick">Highscore</a></sui-menu-item>
      <sui-menu-item><input type="checkbox" v-model="register" id="reg" class="menu"><label for="reg">Registrering</label></sui-menu-item>
      <sui-menu-item><span style="float: right; margin:2px">{{time}}</span></sui-menu-item>
      <sui-menu-item><input type="text" v-model="year" /></sui-menu-item>
      <sui-menu-item><a class="menu" v-on:click="saveClick">Lagre</a></sui-menu-item>      
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
     <Edit v-if="edit" :skier="selectedSkier" :index="selectedSkierIndex" v-on:delete="deleteSkier" v-on:edit="updateSkier" />
  </div>
</template>

<script>
import Skier from "@/components/Skier";
import Register from "@/components/Register";
import Highscore from "@/components/Highscore";
import Edit from "@/components/Edit";

import axios from 'axios';

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
    deleteSkier(skier) {
      let newSkiers = this.skiers.slice(0);
      const skierIndex = this.findSkierIndex(skier);
      console.log(skierIndex);
      newSkiers.splice(skierIndex, 1);
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
    },
    saveClick() {
      axios.post('api/v1/renn', {year: this.year, skiers: this.skiers});
    }
  },
  mounted() {
    axios.get('api/v1/renn/2018').then((response) => {
      console.log(response);
      this.skiers = response.data.skiers;
    });
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
      year: 2018,
      mode: "run",
      register: false,
      edit: false,
      selectedSkier: null,
      selectedSkierIndex: 0,
      skiers: []
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
