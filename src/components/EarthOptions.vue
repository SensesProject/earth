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
      <OptionTimeAxis ref="OptionTimeAxis" class="left" :width="axisWidth"/>
      <div class="right">
        <OptionSelect :options="options.variable" color="green" value-key="variable1" label="variable"/>
      </div>
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
        }, {
          value: 'pr',
          label: 'precipitation'
        }]
      }
    }
  },
  computed: {
    ...computeFromStore(['width']),

    axisWidth () {
      return this.width / 2 - 64
    }
  },
  methods: {
    passEvents (e, v) {
      this.$refs.OptionTimeAxis.setPeriod(e, v)
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
