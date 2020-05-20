<template>
  <div class="VisEarth"
    @mousedown="onMouseDown"
    @mousemove="onMouseMove"
    @mouseup="onMouseUp">
    <ThreeScene :width="width" :height="height">
      <ObjectSphere :size="size / 2" :img-data="imgData"/>
      <ObjectGeo :size="size / 2" @highlight="setHighlight" :interactive="!mouseDown"/>
    </ThreeScene>
    <svg class="key" :width="keyWidth" :height="64">
      <g transform="translate(0 18)">
        <g v-if="compareValue == null">
          <rect v-for="(c1, x) in colors" :key="`c${x}`" width="4" height="24" :x="x * 4" :y="0" :fill="`rgb(${c1[0]},${c1[1]},${c1[2]})`"/>
        </g>
        <g v-else>
          <rect v-for="(c1, x) in colors" :key="`cg${x}`" width="15" height="8" :x="x * 15" :y="16" :fill="`rgb(${colors[0][x][0]},${colors[0][x][1]},${colors[0][x][2]})`"/>
          <rect v-for="(c1, x) in colors" :key="`cw${x}`" width="15" height="8" :x="x * 15" :y="8" :fill="`rgb(${c1[x][0]},${c1[x][1]},${c1[x][2]})`"/>
          <rect v-for="(c1, x) in colors" :key="`cv${x}`" width="15" height="8" :x="x * 15" :y="0" :fill="`rgb(${c1[0][0]},${c1[0][1]},${c1[0][2]})`"/>
        </g>
      </g>
      <text y="10">Land Area Affected</text>
      <g class="ticks">
        <rect y="18" width="1" height="32"/>
        <text y="64" text-anchor="middle">0%</text>
        <rect y="18" :x="keyWidth * 0.5" width="1" height="32"/>
        <text y="64" :x="keyWidth * 0.5" text-anchor="middle">{{ scale.domain[1]/2 }}%</text>
        <!-- <rect y="18" :x="keyWidth * 0.75" width="1" height="32"/>
        <text y="64" :x="keyWidth * 0.75" text-anchor="middle">Quadrennial</text> -->
        <rect y="18" :x="keyWidth - 1" width="1" height="32"/>
        <text y="64" :x="keyWidth - 1" text-anchor="middle">{{ scale.domain[1] }}%</text>
      </g>
    </svg>
    <div v-if="country && !mouseMoved" class="tooltip" :style="{top: `${country.y}px`, left: `${country.x}px`}">
      {{ country.name }}
    </div>
  </div>
</template>

<script>
import ThreeScene from '@/components/ThreeScene.vue'
import ObjectSphere from '@/components/ObjectSphere.vue'
import ObjectGeo from '@/components/ObjectGeo.vue'

import { mapGetters } from 'vuex'
import chroma from 'chroma-js'
import worker from 'workerize-loader!../assets/js/mapRenderer'
import computeFromStore from '../assets/js/computeFromStore.js'

export default {
  name: 'VisEarth',
  components: {
    ThreeScene,
    ObjectSphere,
    ObjectGeo
  },
  data () {
    return {
      workerInstance: null,
      mouseMoved: false,
      imgData: null,
      country: null,
      mouseDown: false
    }
  },
  computed: {
    ...computeFromStore(['showCountryDetails']),
    ...mapGetters(['scale']),
    keyWidth () {
      return 4 * this.colors.length
    },
    size () {
      const { width, height } = this
      return Math.min(width, height)
    },
    grid () {
      return this.$store.state.map
    },
    gridComparison () {
      return this.$store.state.mapComparison
    },
    compareValue   () {
      return this.$store.state.compareValue
    },
    width () {
      return this.$store.state.width
    },
    height () {
      return this.$store.state.height
    },
    grids () {
      return this.$store.state.grids
    },
    period1 () {
      return this.$store.state.period1
    },
    range1 () {
      return this.$store.state.range1
    },
    domain1 () {
      return this.$store.state.domain1
    },
    temperature () {
      return this.$store.state.temperature
    },
    colors () {
      const { scale } = this
      const color0 = '#070019'
      const color1 = '#ddd6ff'

      return chroma.scale([color0, color1]).mode('lab').colors(scale.range[1], 'rgb')
    }
  },
  watch: {
    grid () {
      console.log('updates')
      this.updateCanvas()
    },
    gridComparison () {
      this.updateCanvas()
    },
    domain1 () {
      this.updateCanvas()
    }
  },
  mounted () {
  },
  methods: {
    setHighlight (country) {
      this.country = country
    },
    updateCanvas () {
      const { temperature, range1, domain1, colors, compareValue, grid, gridComparison } = this
      // grid.forEach(l => {
      //   l.forEach(v => {
      //     if (v !== 0) console.log(v)
      //   })
      // })
      // console.log(colors)
      if (this.workerInstance != null) this.workerInstance.terminate()
      this.workerInstance = worker()
      this.workerInstance.renderMap({ grid, gridComparison, comparing: compareValue != null, temperature, range1, domain1, colors }).then(cData => {
        this.$store.dispatch('addGrid', { temperature, grid: cData })
        this.imgData = cData
      })
    },
    onMouseMove (event) {
      if (this.mouseDown) this.mouseMoved = true
    },
    onMouseDown (event) {
      this.mouseMoved = false
      this.mouseDown = true
    },
    onMouseUp (event) {
      // if (!this.mouseMoved) this.showCountryDetails = this.country
      this.mouseDown = false
      this.mouseMoved = false
    }
  }
}
</script>

<style scoped lang="scss">
@import "../assets/style/variables";
.VisEarth {
  position: absolute;
  // cursor: all-scroll;

  .pointer {
    cursor: pointer;
  }

  .key {
    position: absolute;
    // z-index: 100;
    bottom: $spacing;
    left: $spacing;
    pointer-events: none;
    overflow: visible;
    // background: $color-blue;

    text {
      fill: $color-white;
      font-family: $font-mono;
      font-size: 0.7em;
    }

    .ticks {
      fill: $color-white;
    }
  }
  .tooltip {
    position: absolute;
    background: $color-neon;
    color: $color-white;
    transform: translate(-50%, -100%);
    pointer-events: none;
    padding: $spacing / 8 $spacing / 4;
    font-size: 0.8em;
    border-radius: 2px;
  }
}
</style>
