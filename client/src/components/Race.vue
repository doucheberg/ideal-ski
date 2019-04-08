<template>
<div>
  <v-content>
    <v-container fluid>
        <v-progress-linear v-if="loading" :indeterminate="true"></v-progress-linear>
        <table>
          <tr>
            <th><a @click="sort = 'nr'">Startnr</a></th>
            <th><a @click="sort = 'diff'">Pos</a></th>
             <th><a @click="sort = 'diff'">Idealtid</a></th>
            <th>Navn</th>
            <th>Status</th>
            <th>Runde 1</th>
            <th>Runde 2</th>
           
            <th>Start</th>
            <th>Runde</th>
            <th>Mål</th>
            <th></th>
          </tr>
          <tr v-for="(skier) in skiers" v-bind:key="skier._id" :class="`state-${skier.state}`">
            <td>{{skier.startNumber}}</td>
            <td>{{skier.position}}</td>
             <td>{{skier.diff}}</td>
            <td>{{skier.name}}</td>
            <td>
              <v-btn small color="primary" @click="next(skier)">{{stateText(skier.state)}}</v-btn>
              <v-btn small flat icon @click="back(skier)">
                <v-icon>undo</v-icon>
              </v-btn>
            </td>
            <td>
              {{skier.state == 1 ? calculateSecs(skier.startTime, now.valueOf()) : skier.r1}}
            </td>
            <td>
              {{skier.state == 2 ? calculateSecs(skier.roundTime, now.valueOf()) : skier.r2}}
            </td>
           
            <td>{{skier.startTime ? new Date(skier.startTime).toLocaleTimeString() : '-' }}</td>
            <td>{{skier.roundTime ? new Date(skier.roundTime).toLocaleTimeString() : '-' }}</td>
            <td>{{skier.endTime ? new Date(skier.endTime).toLocaleTimeString() : '-' }}</td>
            <td>
              <v-btn small flat icon @click="remove(skier)">
                <v-icon>clear</v-icon>
              </v-btn>
            </td>
          </tr>
        </table>
    </v-container>
  </v-content>
  </div>
</template>

<script>
  import axios from 'axios';
  
  export default {
    name: 'Race',
    data() {
      return {
        rawSkiers: [],
        loading: false,
        now: new Date(),
        sort: 'nr',
      }
    },
    props: ['racingSkiers'],
    mounted() {
      window.setInterval(() => {
        this.now = new Date();
      }, 333);
    },
    methods: {
      updatePositions(){
        let count = 0;
        let pos = 0;
        let prevDiff = -1;
        let samePos = 0;
        this.racingSkiers.sort((a, b) => a.diff - b.diff).forEach(skier => {
          const skierDiff = parseInt(skier.diff);
          if(skierDiff === prevDiff){
            samePos = samePos + 1;
            skier.position = pos;
          }
          else {
            pos = pos + samePos + 1;
            samePos = 0;
            skier.position = pos + samePos;
          }
          prevDiff = skierDiff;
        });
      },

      stateText(state) {
        switch (state) {
          case 0:
            return 'Init';
          case 1:
            return 'Startet';
          case 2:
            return 'Runde';
          case 3:
            return 'Ferdig';
        }
      },
      back(skier) {
        const time = new Date().valueOf();
        if (skier.state > 0) {
          skier.state = skier.state - 1;
          this.updateTime(time, skier);
        }
      },
      next(skier) {
        const time = new Date().valueOf();
        if (skier.state < 3) {
          skier.state = skier.state + 1;
          this.updateTime(time, skier);
        }
      },
      calculateSecs(from, to) {
        if (!from || !to) return '000';
        return Math.abs(Math.round((to - from) / 1000))
          .toLocaleString('en-US', {
            minimumIntegerDigits: 3,
            useGrouping: false
          });
      },
      updateStats(skier) {
        skier.r1 = this.calculateSecs(skier.startTime, skier.roundTime);
        skier.r2 = this.calculateSecs(skier.roundTime, skier.endTime);
        if (skier.endTime && skier.roundTime && skier.startTime) {
          skier.diff = this.calculateSecs(skier.endTime - skier.roundTime, skier.roundTime - skier.startTime);
        } else {
          skier.diff = '000';
        }
  
      },
  
      updateTime(time, skier) {
        switch (skier.state) {
          case 0:
            skier.startTime = null;
            skier.roundTime = null;
            skier.endTime = null;
            break;
          case 1:
            skier.startTime = time;
            skier.roundTime = null;
            skier.endTime = null;
            break;
          case 2:
            skier.roundTime = time;
            skier.endTime = null;
            break;
          case 3:
            skier.endTime = time;
            break;
          default:
            skier.startTime = time;
            break;
        }
        this.updateStats(skier);
        this.updatePositions();
      },

      remove(skier){
        this.$emit('removeSkier', skier);
      }
    },
    computed: {
      skiers() {
        if(this.sort === 'nr'){
          return this.racingSkiers.sort((a, b) => a.startNumber - b.startNumber);
        }else {
          return this.racingSkiers.sort((a, b) => a.diff - b.diff);
        }
        
      }
    }
  }
</script>

<style lang="scss">
  table {
    width: 100%;
    border-spacing: 0px;
    .v-btn {
      margin: 1px 8px;
    }
    tr:hover {
      td {
        background-color: rgba(0, 0, 0, 0.1);
      }
    }
    tr {
      line-height: 1;
    }
    td,
    th {
      text-align: left;
      line-height: 16px;
      border-spacing: 0px;
      border: 0px;
      border-bottom: 1px #aaa solid;
      padding: 0px 6px 0px 6px;
    }
  }
</style>
