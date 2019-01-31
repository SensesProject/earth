<template>
  <div class="OptionTimeAxis">
    <div slot="label" class="upper">years</div>
    <div class="ticks">
      <div v-for="t in labeledTicks" :key="`labeled-tick-${t.label}`" class="tick" :style="t.style">{{ t.label }}</div>
    </div>
    <svg
      ref="svg"
      :width="width" height="64"
      @mousemove="setPeriod"
      @mousedown="setPeriod($event, true)"
      @mouseup="setPeriod($event, false)"
      @mouseleave="setPeriod($event, false)"
      >
      <g class="axis" transform="translate(0, 20)">
        <polyline class="axis" :points="`0,3.5 ${width},3.5`"/>
        <g v-for="t in ticks" :key="`tick-${t.x}`">
          <polyline class="axis tick" :points="`${t.x},0 ${t.x},4`"/>
        </g>
      </g>
      <rect v-bind="slider"/>
    </svg>
    <OptionSelect :options="options.scenario" color="yellow" value-key="scenario1" label="scenario"/>
  </div>
</template>

<script>
import OptionSelect from './OptionSelect.vue'

import { scaleLinear } from 'd3-scale'
import computeFromStore from '../assets/js/computeFromStore.js'

export default {
  name: 'OptionTimeAxis',
  components: {
    OptionSelect
  },
  props: {
    width: {
      type: Number,
      default: 320
    }
  },
  data () {
    return {
      domain: [2005, 2100],
      mousedown: false,
      options: {
        scenario: [{
          value: 'rcp26',
          label: 'RCP 2.6'
        }, {
          value: 'rcp60',
          label: 'RCP 6.0'
        }]
      }
    }
  },
  computed: {
    ...computeFromStore(['period1']),
    scale () {
      return scaleLinear()
        .domain(this.domain)
        .range([0, this.width])
    },
    perc_scale () {
      return scaleLinear()
        .domain(this.domain)
        .range([0, -100])
    },
    ticks () {
      return [...this.domain, ...this.scale.ticks(5)].filter((t, i, ticks) => {
        return ticks.indexOf(t) === i
      }).map((t, i, ticks) => {
        return {
          x: this.scale(t)
        }
      })
    },
    labeledTicks () {
      return this.domain.map(t => {
        return {
          label: t,
          style: {
            left: `${this.scale(t)}px`,
            transform: `translate(${this.perc_scale(t)}%)`
          }
        }
      })
    },
    slider () {
      const x = [this.period1, this.period1 + 5].map(v => this.scale(v))
      return {
        class: 'yellow',
        x: x[0],
        y: 27,
        height: 24,
        width: x[1] - x[0]
      }
    }
  },
  mounted () {
  },
  methods: {
    setPeriod (e, mousedown) {
      // console.log(mousedown, e)
      if (mousedown !== undefined) this.mousedown = mousedown
      if (!this.mousedown) return
      const stepSize = 5
      const layerX = e.clientX - this.$refs.svg.getBoundingClientRect().left
      this.period1 = Math.floor(this.scale.invert(layerX) / stepSize) * stepSize
    }
  }
}
</script>

<style scoped lang="scss">
@import "../assets/style/variables";

.OptionTimeAxis {
  .ticks {
    position: relative;

    .tick {
      position: absolute;
    }
  }
  svg {
    display: block;
    overflow: visible;
    position: relative;

    .axis {
      stroke: $color-white;

      text {
        stroke: none;
        fill: $color-white;
        text-anchor: middle;
      }
    }
  }
}
</style>
