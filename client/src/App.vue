<template>
  <div>
    <v-app id="app">
      <v-toolbar>
        <v-btn color="primary" fab small dark @click.stop="editDialog = true">
          <v-icon>edit</v-icon>
        </v-btn>
        <v-toolbar-title>Idealski</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-text-field v-model="selectedRace.name"/>
        <v-spacer></v-spacer>
        <v-toolbar-title>{{formatDate}}</v-toolbar-title>
      </v-toolbar>
      <router-view @removeSkier="removeSkier" :racingSkiers="selectedRace.skiers"></router-view>
      <v-dialog v-model="editDialog" max-width="800px">
        <v-card>
          <v-card-title>
            <span class="headline">Race settings</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-select
                  v-model="id"
                  :items="races"
                  label="Change race"
                  item-text="name"
                  item-value="_id"
                />
                <v-flex xs12>
                  <v-text-field label="Name" v-model="selectedRace.name" required></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <code>{{selectedRace._id}}</code>
                </v-flex>
                <v-flex xs12>
                  <v-btn color="error" @click="deleteRace">Delete race</v-btn>
                  <v-btn color="success" @click="newRace">New race</v-btn>
                  <v-btn color="info" @click="this.saveRace">Save</v-btn>
                </v-flex>
                <v-flex xs12>
                  <table>
                    <tr>
                      <td>
                    <v-input/>
                      </td>
                  <td>

                    <v-combobox
                      :items="availableSkiers"
                      label="Search user"
                      item-text="name"
                      item-value="name"
                      v-model="addUser"
                      clearable
                    />
                  </td>
                  <td>
                    <v-text-field v-if="!addUser || typeof(addUser) === 'string'" label="Manual enter" v-model="addUser"></v-text-field>
                  </td>
                  <td>
                    <v-btn color="info" @click="this.addUserToRace">Add</v-btn>
                  </td>
                    </tr></table>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="editDialog = false">Close</v-btn>
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
// import Edit from "./components/Edit.vue";
import moment from "moment";

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
import axios from "axios";

export default {
  name: "app",
  router,
  data() {
    return {
      now: new Date(),
      addUser: "",
      id: null,
      availableSkiers: [],
      races: [],
      editDialog: false
    };
  },
  mounted() {
    this.getSkiers();
    this.getRaces();
    window.setInterval(() => {
      this.now = new Date();
    }, 333);
  },
  methods: {
    removeSkier(skier) {
      if (confirm("Sure you want to delete?")) {
        const index = this.selectedRace.skiers.findIndex(
          s => s._id === skier._id
        );
        if (index > -1) {
          this.selectedRace.skiers.splice(index, 1);
        }
      }
    },

    async addUserToRace() {
      if (this.addUser._id) {
        this.selectedRace.skiers.push({
          ...this.addUser,
          startNumber: this.selectedRace.skiers.length + 1,
          state: 0
        });
      } else if (this.addUser) {
        await axios.post("api/skiers", { name: this.addUser }).then(response => {
          this.selectedRace.skiers.push({
            ...response.data,
            startNumber: this.selectedRace.skiers.length + 1,
            state: 0
          });
        });
      }
      this.addUser = "";
    },

    async saveRace() {
      const race = { ...this.selectedRace };

      await axios.post("api/races", race).then(resp => {
        this.id = resp.data._id;
      });
    },

    async saveRaceAndClose() {
      await this.saveRace();
      this.editDialog = false;
    },

    async deleteRace() {
      await axios.delete(`api/races/${this.selectedRace._id}`);
      await this.getRaces();
    },

    newRace() {
      this.id = null;
    },

    getSkiers() {
      axios
        .get("api/skiers")
        .then(response => {
          this.availableSkiers = response.data;
        })
        .catch(reason => alert(reason));
    },

    async getRaces() {
      const { data } = await axios.get("api/races");
      this.races = data;
    }
  },
  computed: {
    selectedRace() {
      const race = this.races.find(r => r._id === this.id);
      return race || { _id: null, skiers: [], name: "" };
    },

    formatDate() {
      return moment(this.now).format("HH:mm:ss");
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
