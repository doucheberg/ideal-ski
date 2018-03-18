<template>
  <div>
    <table>
      <thead>
        <tr><th>#</th><th>Tidsdiff</th><th>Navn</th><th>Etternavn</th><th>Runde 1</th><th>Runde 2</th></tr>
        </thead>
        <tbody>
      <tr v-for="(skier, index) in sorted" v-bind:key="index">
        <td>{{skier.nr}}</td>
        <td>{{skier.diff}}</td>
        <td>{{skier.firstName}}</td>
        <td>{{skier.lastName}}</td>
        <td>{{skier.r1}}</td>
        <td>{{skier.r2}}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import Skier from "@/components/Register";

export default {
  name: "Register",
  props: ["skiers"],
  computed: {
    sorted() {
      let copy = this.skiers.slice(0);
      copy.forEach((s) => {
        s.r1 = ((s.roundTime - s.startTime));
        s.r2 = ((s.endTime - s.roundTime));
        if(s.startTime && s.roundTime && s.endTime){
          s.diff = Math.abs((s.r2)-(s.r1));        
        }else {
          s.diff = NaN;
        }
      });
      console.log(copy);
      copy.sort((a, b) => {
        if(isNaN(a.diff)) return 1;
        if(isNaN(b.diff)) return -1;
        return a.diff - b.diff;
      });
      let nr = 1, prevTime = copy[0].diff;
      copy[0].nr = 1;
      if(copy.length < 2) return copy;
      for(let i = 1; i < copy.length; i++){
        const skier = copy[i];
       if(skier.diff === prevTime){
         skier.nr = nr;
       }else {
         skier.nr = i + 1;
         nr = skier.nr;
         prevTime = skier.diff;
       }
      }
      return copy;
    }
  }
};
</script>
<style scoped>
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
</style>
