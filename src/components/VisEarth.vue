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
    <component :is="portal != null ? 'Portal' : 'div'" :to="portal" class="key tiny" :style="{color: colors.text}">
      <div class="scale">
        <span class="tick">{{ scale.range[0] }}%</span>
        <svg :width="keyWidth" :height="16">
          <g>
            <rect v-for="(c1, x) in colorScale" :key="`c${x}`" :width="keyWidth / colorScale.length + 0.4" height="16" :x="x * (keyWidth / colorScale.length) - 0.2" :y="0" :fill="`rgb(${c1[0]},${c1[1]},${c1[2]})`"/>
          </g>
        </svg>
        <span class="tick">{{ scale.range[1] }}%</span>
      </div>
      <div class="label" v-if="!hideKeyLabel">
        Land area exposed
      </div>
    </component>
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
import { Portal } from 'portal-vue'
import { renderMap } from '../assets/js/mapRenderer'

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
    ResizeObserver,
    Portal
  },
  props: {
    portal: {
      type: String,
      default: null
    },
    hideKeyLabel: {
      type: Boolean,
      default: false
    },
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
      keyWidth: 120,
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
      return scale.range.map(value => {
        return {
          value,
          x: s(value)
        }
      })
    }
  },
  watch: {
    grid: {
      handler (grid) {
        if (grid !== null) this.updateCanvas()
      },
      immediate: true
    }
  },
  mounted () {
    this.setClientSize()
  },
  methods: {
    updateCanvas () {
      const { colorScale, grid } = this
      // const time = new Date().getTime()
      // if (this.workerInstance != null) this.workerInstance.terminate()
      // this.workerInstance = worker()
      // this.workerInstance.renderMap({ grid, colors: colorScale }).then(cData => {
      //   console.log(new Date().getTime() - time)
      //   // this.imgData = cData
      //   console.log(new Date().getTime() - time)
      // })
      this.imgData = renderMap({ grid, colors: colorScale })
      // console.log(new Date().getTime() - time)
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
    right: $spacing / 2;
    display: flex;
    // align-items: center;
    flex-direction: column;
    pointer-events: none;
    // color: $color-white;
    .label {
      padding: $spacing / 8 0 0 0;
    }
    .scale {
      display: flex;
      // justify-content: center;
      align-items: center;

      svg {
        border-radius: $border-radius;
      }

      .tick {
        // width: 60px;
        // background: green;
        &:first-of-type {
          text-align: right;
          padding: 0 $spacing / 4 0 0;
        }
        &:last-of-type {
          padding: 0 0 0 $spacing / 4;
        }
      }
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
