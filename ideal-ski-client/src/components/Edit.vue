<template>
  <div class="dark">
      <label>First Name</label>
      <input placeholder="First Name" v-model="skier.firstName" >

      <label>Last Name</label>
      <input placeholder="Last Name" v-model="skier.lastName" >

       <label>Start number</label>
       <input type="number" placeholder="Startnumber" v-model="skier.startNumber" >

    <a v-on:click="click">Lukk</a>

  </div>
</template>

<script>
export default {
  name: 'Edit',
  props: ['skier', 'index'],
methods: {
    click() {
        this.$emit('edit', 
        {
          firstName: this.firstName, 
          lastName: this.lastName, 
          startNumber: this.startNumber
          }, this.index);
        // this.startNumber = Number(this.startNumber) + 1;
        // this.firstName = '';
        // this.lastName = '';
    }
  }
}
</script>
<style scoped>
a {
  cursor: pointer;
}
.dark {
  background-color: #333;
  color: white;
  margin: 4px;
  padding: 8px;
  position: fixed;
  top: 0px;
}
</style>

