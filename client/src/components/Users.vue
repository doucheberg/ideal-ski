<template>
  <div>
    <v-text-field type="text" @change="addUser" v-model="name" label="New user"/>
    <v-progress-linear v-if="loading" :indeterminate="true"></v-progress-linear>
    <table>
      <tr class="grid-item" v-for="(user, index) in users" v-bind:key="user.id">
        <td>{{index}}</td>
        <td>
          <span>{{user.name}}</span>
        </td>
        <td>
          <v-btn @click="deleteUser(user._id)" color="primary">Delete</v-btn>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import server from '../server';

export default {
  name: "Users",
  data() {
    return {
      users: null,
      name,
      loading: false
    };
  },
  mounted() {
    this.getUsers();
  },
  methods: {
    deleteUser(id) {
      server.deleteSkier(id).then(() => this.getUsers());
    },
    addUser() {
      server.createSkier({ name: this.name }).then(() => {
        this.name = "";
        this.getUsers();
      });
    },
    getUsers() {
      this.loading = true;
      server.getSkiers().then(response => {
        const users = response.data;

        this.users = users.sort((a, b) => {
          const aName = a.name.toLowerCase();
          const bName = b.name.toLowerCase();
          if (aName < bName) {
            return -1;
          }
          if (aName > bName) {
            return 1;
          }
          return 0;
        });
        this.loading = false;
      });
    }
  }
};
</script>

