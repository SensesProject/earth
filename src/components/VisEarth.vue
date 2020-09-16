<template>
  <div class="VisEarth" ref="earth"
    @mousedown="onMouseDown"
    @mousemove="onMouseMove"
    @mouseup="onMouseUp">
    <ResizeObserver @notify="setClientSize"/>
    <ThreeScene :width="width" :height="height" :prevent-interaction="preventInteraction" :background="allColors.background" :yaw="yaw" :pitch="pitch" :zoom="zoom">
      <ObjectSphere :size="size / 2" :img-data="imgData" :baseColor="allColors.colorScale[0]"/>
      <ObjectGeo :size="size / 2" @highlight="setHighlight" :interactive="!preventInteraction && !mouseDown"
        :borderColor="allColors.borderColor" :highlightColor="allColors.highlightColor"/>
    </ThreeScene>
    <svg class="key" :width="keyWidth" :height="64">
      <g transform="translate(0 18)">
        <rect v-for="(c1, x) in colorScale" :key="`c${x}`" :width="keyWidth / colorScale.length + 0.4" height="24" :x="x * (keyWidth / colorScale.length) - 0.2" :y="0" :fill="`rgb(${c1[0]},${c1[1]},${c1[2]})`"/>
      </g>
      <text y="10" :fill="allColors.text">Land area exposed</text>
      <g class="ticks" :fill="allColors.text">
        <g v-for="(t, i) in ticks" :key="`t-${i}`">
          <rect y="18" :x="t.x" width="1" height="32"/>
          <text y="64" :x="t.x">{{ t.value }}%</text>
        </g>
      </g>
    </svg>
    <div v-if="country && !mouseMoved" class="tooltip tiny" :style="{top: `${country.y}px`, left: `${country.x}px`}">
      {{ country.name }}
    </div>
  </div>
</template>

<script>
import ThreeScene from '../components/ThreeScene.vue'
import ObjectSphere from '../components/ObjectSphere.vue'
import ObjectGeo from '../components/ObjectGeo.vue'
import { ResizeObserver } from 'vue-resize'
import { scaleLinear } from 'd3-scale'

import chroma from 'chroma-js'
import worker from 'workerize-loader!../assets/js/mapRenderer'

const defaultColors = {
  background: '#020212',
  text: '#ffffff',
  borderColor: '#292D50',
  highlightColor: '#5263ff',
  colorScale: ['#0A0924', '#C32C62', '#FFE6B5']
}

export default {
  name: 'VisEarth',
  components: {
    ThreeScene,
    ObjectSphere,
    ObjectGeo,
    ResizeObserver
  },
  props: {
    grid: String,
    scale: {
      type: Object,
      default () { return { domain: [0, 100], range: [0, 100] } }
    },
    colors: {
      type: Object,
      default () {
        return defaultColors
      }
    },
    preventInteraction: {
      type: Boolean,
      default: false
    },
    yaw: {
      type: Number,
      default: 1
    },
    pitch: {
      type: Number,
      default: -0.25
    },
    zoom: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      workerInstance: null,
      mouseMoved: false,
      imgData: null,
      country: null,
      mouseDown: false,
      keyWidth: 200,
      width: 768,
      height: 768
    }
  },
  computed: {
    // ...computeFromStore(['showCountryDetails']),
    size () {
      const { width, height } = this
      return Math.min(width, height)
    },
    allColors () {
      return { ...defaultColors, ...this.colors }
    },
    colorScale () {
      const { scale, allColors } = this
      return chroma.scale(allColors.colorScale).mode('lab').colors(scale.range[1], 'rgb')
    },
    ticks () {
      const { keyWidth, scale } = this
      const s = scaleLinear().domain(scale.range).range([0, keyWidth])
      return s.ticks(2).map(value => {
        return {
          value,
          x: s(value)
        }
      })
    }
  },
  watch: {
    grid: {
      handler () { this.updateCanvas() },
      immediate: true
    }
  },
  mounted () {
    this.setClientSize()
  },
  methods: {
    updateCanvas () {
      const { colorScale, grid } = this
      if (this.workerInstance != null) this.workerInstance.terminate()
      this.workerInstance = worker()
      this.workerInstance.renderMap({ grid, colors: colorScale }).then(cData => {
        this.imgData = cData
      })
    },
    setHighlight (country) {
      this.country = country
    },
    onMouseMove (event) {
      if (this.preventInteraction) return
      if (this.mouseDown) this.mouseMoved = true
    },
    onMouseDown (event) {
      if (this.preventInteraction) return
      this.mouseMoved = false
      this.mouseDown = true
    },
    onMouseUp (event) {
      if (this.preventInteraction) return
      if (!this.mouseMoved) this.$emit('details', this.country)
      this.mouseDown = false
      this.mouseMoved = false
    },
    setClientSize () {
      const rect = this.$refs.earth.getBoundingClientRect()
      this.width = rect.width
      this.height = rect.height
    }
  }
}
</script>

<style scoped lang="scss">
@import "../assets/style/variables";
.VisEarth {
  position: absolute;
  width: 100%;
  height: 100%;
  .pointer {
    cursor: pointer;
  }

  .key {
    position: absolute;
    bottom: $spacing / 2;
    left: $spacing / 2;
    pointer-events: none;
    overflow: visible;

    .ticks {
      text-anchor: middle;
    }
  }
  .tooltip {
    position: absolute;
    background: $color-neon;
    color: $color-white;
    transform: translate(-50%, -100%);
    pointer-events: none;
    padding: $spacing / 8 $spacing / 4;
    border-radius: $border-radius;
  }
}
</style>
