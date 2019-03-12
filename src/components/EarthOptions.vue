<template>
  <div class="EarthOptions"
    @mousemove="passEvents"
    @touchmove="passEvents"
    @mouseup="passEvents($event, false)"
    @touchend="passEvents($event, false)"
    @mouseleave="passEvents($event, false)">
    <div class="top">
      <OptionSelect :options="options.mode" value-key="mode" label="mode"/>
      <span class="blue upper">share</span>
    </div>
    <div class="bottom">
      <div class="left">
        <InputSlider v-model="periodRange" :options="periodOptions" color="yellow" ref="inputPeriod" :width="axisWidth"/>
        <OptionSelect :options="options.scenario" color="yellow" value-key="scenario1" label="scenario"/>
      </div>
      <div class="right">
        <InputSlider v-model="domain1" :color-scheme="range1" :options="variableOptions" ref="inputVariableRange" :width="axisWidth"/>
      </div>
    </div>
  </div>
</template>

<script>
import OptionSelect from './OptionSelect.vue'
import InputSlider from './InputSlider.vue'
import computeFromStore from '../assets/js/computeFromStore.js'
export default {
  name: 'EarthOptions',
  components: {
    OptionSelect,
    InputSlider
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
        scenario: [{
          value: 'rcp26',
          label: 'RCP 2.6'
        }, {
          value: 'rcp60',
          label: 'RCP 6.0'
        }]
      },
      // periodRange: [2005, 2010],
      periodOptions: {
        domain: [2005, 2100],
        slider: 5,
        step: 5,
        ticks: 2
      },
      variableOptions: {
        domain: [-50, 50],
        slider: 4,
        step: 1,
        ticks: 2
      }
    }
  },
  computed: {
    ...computeFromStore(['width', 'period1', 'domain1', 'range1']),

    axisWidth () {
      return this.width / 2 - 64
    },
    periodRange: {
      get () {
        return [this.period1, this.period1 + 5]
      },
      set (value) {
        this.period1 = value[0]
      }
    }
  },
  methods: {
    passEvents (e, v) {
      // this.$refs.OptionTimeAxis.setPeriod(e, v)
      this.$refs.inputPeriod.setRange(e, v)
      this.$refs.inputVariableRange.setRange(e, v)
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
  }

  .top {
    margin-bottom: $spacing / 2;
  }
}
</style>
