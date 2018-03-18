<template>
  <tr style="margin: 2px;" class="avatar">
      <td>
        <h5 style="white-space: nowrap; font-size: 90%;">{{skier.startNumber}}</h5>
      </td>
      <td>
        <h5 style="white-space: nowrap; font-size: 90%;">{{skier.firstName}}</h5>
      </td>
      <td style="width:115px;">
        <a :class="stateCss" class="pill noselect" v-on:click="changeStateUp">
        {{stateText}}
        </a>
                <a v-on:click="changeStateDown"><i class="undo icon"></i></a>
        </td>
            <td>
              {{round}}
            </td>
            <td>
              {{finish}}
            </td>
            <td>
              {{diff}}
            </td>
            <td>
        <a v-on:click="edit"><i class="edit icon"></i></a>
      </td>
      <td>
        <span @click="manualChange('start')">{{startTimeParsed}}</span>
        </td>
        <td>
        <span @click="manualChange('round')">{{roundTimeParsed}}</span>
        </td>
        <td>
        <span @click="manualChange('end')">{{endTimeParsed}}</span>
      </td>       
  </tr>
</template>

<script>

import moment from "moment";

export default {
  name: "Skier",
  props: ["skier", "index", "now"],
  methods: {
    changeStateUp(e) {
      e.cancelBubble = true;
      const state = Math.min(this.skier.state + 1, 3);
      if (state != this.skier.state) {
        console.log(this.skier, state);
        this.calculateTimes(state);
      }
      return false;
    },
    changeStateDown(e) {
      e.cancelBubble = true;
      const state = Math.max(this.skier.state - 1, 0);
      if (state != this.skier.state) {
        this.calculateTimes(state);
      }
      return false;
    },
    edit(e) {
      e.cancelBubble = true;
      this.$emit("edit", this.skier);      
      return false;
    },
    calculateTimes(state) {
      let startTime, roundTime, endTime;
      switch (state) {
        case 0:
          startTime = undefined;
          this.$emit("update", { firstName: this.skier.firstName, startTime, state });

          break;
        case 1:
          startTime = Math.round(new Date().valueOf()/1000);
          roundTime = undefined;
          this.$emit("update", { firstName: this.skier.firstName, startTime, roundTime, state });

          break;
        case 2:
          roundTime = Math.round(new Date().valueOf()/1000);
          endTime = undefined;
          this.$emit("update", { firstName: this.skier.firstName, roundTime, endTime, state });
          break;
        case 3:
          endTime = Math.round(new Date().valueOf()/1000);
          this.$emit("update", { firstName: this.skier.firstName, endTime, state });
          break;
      }
    },
    manualChange(type, newValue){
      try {
        let input, time
          switch(type){
            case "start":
            input = prompt("new value", this.startTimeParsed);
            if(!input) return;
            time = Math.round(moment(input, "HH:mm:ss").valueOf() / 1000);
            this.$emit("update", { firstName: this.skier.firstName, startTime : time });
            break;
            case "round":
            input = prompt("new value", this.roundTimeParsed);
            if(!input) return;
            time = Math.round(moment(input, "HH:mm:ss").valueOf() / 1000);
            this.$emit("update", { firstName: this.skier.firstName, roundTime : time });
            break;
            case "end":
            input = prompt("new value", this.endTimeParsed);
            if(!input) return;
            time = Math.round(moment(input, "HH:mm:ss").valueOf() / 1000);
            this.$emit("update", { firstName: this.skier.firstName, endTime : time });
            break;
          }
        } catch (err) {
          console.log(err);
        }
    },
    padNumber(number){
      let parsed;
      if(number <= 0){
        parsed = `0000`;
      }
      else if(number < 10){
        parsed = `000${number}`;
      } else if(number < 100){
        parsed = `00${number}`;
      } else if (number < 1000){
        parsed = `0${number}`;
      }
      else if (number < 10000){
        parsed = `${number}`;
      }
      return parsed;
    }
  },
  computed: {
    diff() {
      let value;
      if (this.skier.endTime && this.skier.roundTime && this.skier.startTime) {
        const seconds = Math.abs(
          (this.skier.endTime - this.skier.roundTime) -
            (this.skier.roundTime - this.skier.startTime)
        );
        value = seconds;
      } else {
        value = 0;
      }
      console.log(value);
      return this.padNumber(value);
    },
    round() {
      let value = 0;
      if(this.skier.startTime){
        if(this.skier.roundTime){
          value = this.skier.roundTime - this.skier.startTime;
        }else {
          value = this.now - this.skier.startTime;
        }
      }
      return this.padNumber(value);
    },
    finish() {
      let value = 0;
      if(this.skier.roundTime){
        if(this.skier.endTime){
          value = this.skier.endTime - this.skier.roundTime;
        }else {
          value = this.now - this.skier.roundTime;
        }
      }
      return this.padNumber(value);
    },
    startTimeParsed() {
      return new Date(this.skier.startTime*1000).toLocaleTimeString();
    },
     roundTimeParsed() {
      return new Date(this.skier.roundTime*1000).toLocaleTimeString();
    },
     endTimeParsed() {
      return new Date(this.skier.endTime*1000).toLocaleTimeString();
    },
    stateText() {
      let text = "init";
      switch (this.skier.state) {
        case 0:
          text = "init";
          break;
        case 1:
          text = "startet";
          break;
        case 2:
          text = "runde";
          break;
        case 3:
          text = "ferdig";
          break;
      }
      return text;
    },
    stateCss() {
      let css = "";
      switch (this.skier.state) {
        case 0:
          css = "yellow";
          break;
        case 1:
          css = "blue";
          break;
        case 2:
          css = "red";
          break;
        case 3:
          css = "green";
          break;
      }
      return css;
    }
  }
};
</script>

<style scoped>
input {
  width: 80px;
}
:hover {
  background: lightgray;
}
.pill {
  padding: 2px 8px;
  color: white;
  cursor: pointer;
  border-radius: 2px;
  width: 70px;
  display: inline-block;
  text-align: center
}
.yellow {
  background-color: rgb(126, 126, 126);
}
.blue {
  background-color: rgb(0, 110, 255);
}
.red {
  background-color: rgb(216, 34, 21);
}
.green {
  background-color: green;
}
div {
  font-size: 90%;
}
.ui.button {
  font-size: 90%;
}
.ui.card {
  width: 120px;
}
.noselect {
  -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
     -khtml-user-select: none; /* Konqueror HTML */
       -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome and Opera */
}
</style>
