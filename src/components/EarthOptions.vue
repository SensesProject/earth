<template>
  <div class="EarthOptions">
    <div class="top">
      <OptionSelect :options="options.mode" value-key="mode" label="mode"/>
      <span class="blue upper">share</span>
    </div>
    <div class="bottom">
      <OptionTimeAxis class="left" :width="axisWidth"/>
      <div class="right">
        <OptionSelect :options="options.variable" color="green" value-key="variable1" label="variable"/>
      </div>
      <!-- <input v-model="year" type="range" min="2005" max="2095" step="5">
      <select v-model="scenario">
        <option value="rcp26">rcp26</option>
        <option value="rcp60">rcp60</option>
      </select> -->
    </div>
  </div>
</template>

<script>
import OptionSelect from './OptionSelect.vue'
import OptionTimeAxis from './OptionTimeAxis.vue'
import computeFromStore from '../assets/js/computeFromStore.js'
export default {
  name: 'EarthOptions',
  components: {
    OptionSelect,
    OptionTimeAxis
  },
  data () {
    return {
      options: {
        mode: [{
          value: 0,
          label: 'single variable'
        }, {
          value: 1,
          label: 'compare variables'
        }],
        variable: [{
          value: 'tas',
          label: 'temperature'
        }]
      }
    }
  },
  computed: {
    ...computeFromStore(['width']),

    axisWidth () {
      return this.width / 2 - 64
    }
  }
}
</script>

<style scoped lang="scss">
@import "../assets/style/variables";

.EarthOptions {
  position: absolute;
  background: $color-overlay-background;
  width: 100%;
  bottom: 0;
  left: 0;

  padding: $spacing / 2 $spacing;

  display: flex;
  flex-direction: column;

  .top, .bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .top {
    margin-bottom: $spacing / 2;
  }
}
</style>
