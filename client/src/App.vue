<template>
  <div>
    <v-app id="app">
      <!-- <v-navigation-drawer app></v-navigation-drawer> -->
      <v-toolbar>
        <v-toolbar-side-icon @click.stop="editDialog = true"></v-toolbar-side-icon>
        <v-toolbar-title>Idealski</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-text-field v-model="name" />
        <v-spacer></v-spacer>
        {{editDialog}}
        <v-toolbar-items class="hidden-sm-and-down">
          {{now}}
          <v-btn flat>Link One</v-btn>
          <v-btn flat>Link Two</v-btn>
          <v-btn flat>Link Three</v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <router-view :racingSkiers="racingSkiers"></router-view>
      <v-dialog v-model="editDialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Race settings</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field label="Name" v-model="name" required></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-combobox
                  v-model="addUser"
                  :items="availableSkiers"
                  label="Add user"
                  item-text="name"
                  item-value="_id"
                  @change="addUserToRace"
                  
                />
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="editDialog = false">Close</v-btn>
          <v-btn color="blue darken-1" flat @click="editDialog = false; saveRace();">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    </v-app>
  </div>
</template>

<script>
import VueRouter from "vue-router";
import Race from "./components/Race.vue";
import Users from "./components/Users.vue";
import Edit from "./components/Edit.vue";

const router = new VueRouter({
  routes: [
    {
      path: "/",
      component: Race
    },
    {
      path: "/users",
      component: Users
    }
  ]
});
 import axios from 'axios';

export default {
  name: "app",
  router,
  data() {
    return {
      now: new Date(),
      name: `Ideal ${new Date().getFullYear()}`,
      addUser: '',
      _id: null,
      racingSkiers: [],
      availableSkiers: [],
      editDialog: false
    };
  },
  mounted() {
    this.getSkiers();
    window.setInterval(() => {
      this.now = new Date();
    }, 333);
  },
  methods: {
    addUserToRace(skier){
      if(skier._id){
        this.racingSkiers.push({...skier, startNumber: this.racingSkiers.length + 1, state: 0});
      }
      else if(skier) {
        axios.post("api/skiers", {name: skier}).then((response) => {
         this.racingSkiers.push({...response.data, startNumber: this.racingSkiers.length + 1, state: 0});
        });
      }
      this.addUser = '';
    },
    saveRace(){
      const race = {
        _id: this._id,
        name: this.name,
        skiers: this.racingSkiers
      }
      axios.post("api/races", race).then((resp) => {
        this._id = resp.data._id;
      });
    },
    getSkiers(){
      axios.get("api/skiers").then(response => {
        this.availableSkiers = response.data;
      });
    }
  }
};
</script>

<style lang="scss">
.md-bottom-bar {
  position: fixed;
  bottom: 0px;
}

.md-app {
  margin-bottom: 50px;
}

.grid {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .grid-item {
    display: flex;
    flex: 1;
    padding: 0.5em;
  }
}
button.md-dense {
  margin: 0px;
}

td.md-table-cell {
  height: 32px;
  .md-table-cell-container {
    padding: 0px 32px 0px 32px;
  }
}

.state-1 {
  background: rgb(0, 162, 255);
}

.state-2 {
  background: rgb(240, 198, 15);
}

.state-3 {
  background: rgb(77, 197, 165);
}
</style>
