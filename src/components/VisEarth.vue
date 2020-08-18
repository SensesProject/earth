<template>
  <div class="VisEarth" ref="earth"
    @mousedown="onMouseDown"
    @mousemove="onMouseMove"
    @mouseup="onMouseUp">
    <ResizeObserver @notify="setClientSize"/>
    <ThreeScene :width="width" :height="height">
      <ObjectSphere :size="size / 2" :img-data="imgData"/>
      <ObjectGeo :size="size / 2" @highlight="setHighlight" :interactive="!mouseDown"/>
    </ThreeScene>
    <svg class="key" :width="keyWidth" :height="64">
      <g transform="translate(0 18)">
        <rect v-for="(c1, x) in colors" :key="`c${x}`" :width="keyWidth / colors.length + 0.4" height="24" :x="x * (keyWidth / colors.length) - 0.2" :y="0" :fill="`rgb(${c1[0]},${c1[1]},${c1[2]})`"/>
      </g>
      <text y="10">Land area exposed</text>
      <g class="ticks">
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
import ThreeScene from '@/components/ThreeScene.vue'
import ObjectSphere from '@/components/ObjectSphere.vue'
import ObjectGeo from '@/components/ObjectGeo.vue'
import { ResizeObserver } from 'vue-resize'
import { scaleLinear } from 'd3-scale'

import chroma from 'chroma-js'
import worker from 'workerize-loader!../assets/js/mapRenderer'

export default {
  name: 'VisEarth',
  components: {
    ThreeScene,
    ObjectSphere,
    ObjectGeo,
    ResizeObserver
  },
  props: ['grid', 'scale'],
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
    colors () {
      const { scale } = this
      const color0 = '#0A0924'
      const color1 = '#C32C62'
      const color2 = '#FFE6B5'

      return chroma.scale([color0, color1, color2]).mode('lch').colors(scale.range[1], 'rgb')
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
    grid () {
      this.updateCanvas()
    }
  },
  methods: {
    updateCanvas () {
      const { colors, grid } = this
      if (this.workerInstance != null) this.workerInstance.terminate()
      this.workerInstance = worker()
      this.workerInstance.renderMap({ grid, colors }).then(cData => {
        this.imgData = cData
      })
    },
    setHighlight (country) {
      this.country = country
    },
    onMouseMove (event) {
      if (this.mouseDown) this.mouseMoved = true
    },
    onMouseDown (event) {
      this.mouseMoved = false
      this.mouseDown = true
    },
    onMouseUp (event) {
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

    text {
      fill: $color-white;
      font-family: $font-mono;
    }

    .ticks {
      fill: $color-white;
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
