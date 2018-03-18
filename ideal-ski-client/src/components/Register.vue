<template>
  <div class="dark">
      <label>First Name</label>
      <input placeholder="First Name" v-model="firstName" >
      <label>Last Name</label>
      <input placeholder="Last Name" v-model="lastName" >
       <label>Start number</label>
       <input type="number" placeholder="Startnumber" v-model="startNumber" >
      <a v-on:click="click">Add</a>
  </div>
</template>

<script>

import Skier from '@/components/Register'

export default {
  name: 'Register',
  components: { Skier },
  data () {
    return {
      firstName: '',
      lastName: '',
      startNumber: 1
    }
  },
methods: {
    click() {
        this.$emit('register', 
        {
          firstName: this.firstName, 
          lastName: this.lastName, 
          startNumber: this.startNumber,
          state: 0
          });
        this.startNumber = Number(this.startNumber) + 1;
        this.firstName = '';
        this.lastName = '';
    }
  }
}
</script>

<style scoped>
.dark {
  background-color: #333;
  color: white;
  margin: 4px;
  padding: 2px;
  position: fixed;
  top: 30px;
}
</style>

