<template>
  <div class="InputSlider" :class="{active}" :style="{ width: `${width}px` }">
    <div class="top">
      <div slot="label" class="label">Period</div>
      <div class="reset" v-show="enabled && enablable">reset</div>
    </div>
    <div class="ticks">
      <div ref="ticks" v-for="(t, i) in ticks" :key="`tick-${i}`" class="tick" :style="{...t.style, opacity: showTicks[i] ? 1 : 0}">{{ t.label }}</div>
      <div ref="thumbTick" class="tick thumb-tick" :class="[color]" :style="thumbTickStyle">{{ thumbTickLabel }}</div>
    </div>
    <div
      class="input"
      ref="input"
      @mousedown="setRange($event, true)"
      @touchstart="setRange($event, true)">
      <div class="track" :style="track"/>
      <div class="thumb" :class="color" :style="thumb"/>
    </div>
  </div>
</template>

<script>
import { scaleLinear } from 'd3-scale'
export default {
  name: 'InputSlider',
  props: {
    color: {
      type: String,
      default: 'yellow'
    },
    colorScheme: {
      type: Array,
      default: null
    },
    enablable: {
      type: Boolean,
      default: false
    },
    overextend: {
      type: Boolean,
      default: false
    },
    options: {
      type: Object,
      default () {
        return {
          domain: [0, 100],
          slider: 5,
          step: 1,
          ticks: 2,
          unit: ''
        }
      }
    },
    reverse: {
      type: Boolean,
      default: false
    },
    width: {
      type: Number,
      default: 320
    },
    value: {
      default: null
    }
  },
  data () {
    return {
      enabled: false,
      active: false,
      thumbTickStyle: {},
      thumbTickWidth: 0,
      showTicks: []
    }
  },
  computed: {
    inputOptions () {
      const { options, domain } = this
      return {
        min: domain[0],
        max: domain[1],
        step: options.step
      }
    },
    domain () {
      const { options } = this
      return [options.domain[0], options.domain[1] - options.slider]
    },
    scale () {
      return scaleLinear()
        .domain(this.domain)
        .range([0, this.width])
    },
    scaleFull () {
      return scaleLinear()
        .domain(this.options.domain)
        .range([0, this.width])
    },
    scaleAlt () {
      return scaleLinear()
        .domain(this.domain)
        .range([0, this.width - this.sliderWidth])
    },
    scalePerc () {
      return scaleLinear()
        .domain(this.domain)
        .range([0, -100])
    },
    ticks () {
      this.scalePerc.clamp(true)
      this.scale.clamp(true)
      this.scaleFull.clamp(true)
      const t = [this.options.domain[0], ...this.scaleFull.ticks(this.options.ticks), this.options.domain[1]].filter((t, i, ticks) => {
        return ticks.indexOf(t) === i
      }).map((t, i, ticks) => {
        const left = this.scaleFull(t)
        return {
          label: t,
          left,
          style: {
            left: `${left}px`,
            transform: `translate(${i === 0 ? 0 : i === ticks.length - 1 ? -100 : -50}%)`
          }
        }
      })
      return t
    },
    thumbTickLabel () {
      this.updateTicks() // side-effects!
      return `${this.value[0]} – ${+this.value[1]}`
    },
    tickBounds () {
      const { $refs, ticks } = this
      return $refs.ticks.map((tick, i) => {
        const width = tick.getBoundingClientRect().width
        const min = ticks[i].left - width * (i === 0 ? 0 : i === ticks.length - 1 ? 1 : 0.5)
        const max = min + width
        return { min, max }
      })
    },
    sliderWidth () {
      return this.width * this.options.slider / (this.options.domain[1] - this.options.domain[0])
    },
    track () {
      const { scaleAlt, value, sliderWidth, colorScheme } = this
      const x = scaleAlt(value[0])
      const c1 = colorScheme ? colorScheme[0] : 'rgba(255,255,255,0.3)'
      const c2 = colorScheme ? colorScheme[colorScheme.length - 1] : 'rgba(255,255,255,0.3)'
      return {
        background: `linear-gradient(to right, ${c1} ${x - 2}px, transparent ${x - 2}px, transparent ${x + sliderWidth + 2}px, ${c2} ${x + sliderWidth + 2}px)`
      }
    },
    thumb () {
      const { scaleAlt, value, sliderWidth, colorScheme } = this
      const x = scaleAlt(value[0])
      let background = null
      if (colorScheme != null) {
        background = `linear-gradient(to right, ${colorScheme[0]}, ${colorScheme[1]}, ${colorScheme[2]})`
      }
      return {
        background,
        width: `${sliderWidth}px`,
        left: `${x}px`
      }
    }
  },
  methods: {
    setRange (e, active) {
      if (active !== undefined) this.active = active
      if (!this.active) return
      let clientX = e.clientX
      if (clientX === undefined && e.touches && e.touches.length === 1) {
        clientX = e.touches[0].clientX
      }
      const { $refs, scaleFull, options, domain, overextend } = this
      const layerX = clientX - $refs.input.getBoundingClientRect().left
      const value = Math.floor(scaleFull.invert(layerX) / options.step) * options.step
      const min = overextend ? domain[0] - options.slider : domain[0]
      const max = overextend ? domain[1] + options.slider : domain[1]
      const clamped = Math.max(Math.min(value, max), min)
      // this.value =
      this.$emit('input', [clamped, clamped + options.slider])
      // console.log(Math.max(Math.min(value, max), min))
    },
    updateTicks () {
      this.$nextTick(() => {
        const { $refs, value, options, scaleFull, width, tickBounds } = this
        const w = $refs.thumbTick.getBoundingClientRect().width
        let x = scaleFull(value[0] + options.slider / 2) - w / 2
        if (x < 0) x = 0
        if (x > width - w) x = width - w
        this.thumbTickStyle = {
          left: `${x}px`
        }
        this.thumbTickWidth = w

        this.showTicks = tickBounds.map(({ min, max }, i, rects) => {
          // console.log(rect.width)
          const thumbMin = x
          const thumbMax = x + w
          const buffer = 5
          return thumbMax + buffer < min || thumbMin - buffer > max
        })
      })
    }
  }
}
</script>

<style scoped lang="scss">
@import "../assets/style/variables";
.InputSlider {
  user-select: none;

  .label {
    text-transform: uppercase;
  }

  .ticks {
    position: relative;
    pointer-events: none;

    .tick {
      position: absolute;
      white-space: nowrap;
      transition: opacity .2s;
    }
  }

  .input {
    height: 24px;
    position: relative;

    > div {
      position: absolute;
      pointer-events: none;

      &.track {
        height: 2px;
        bottom: 2px;
        width: 100%;
        background: transparentize($color-white, 0.7)
      }

      &.thumb {
        height: 2px;
        bottom: 2px;
        transition: transform .2s;

        &.yellow {
          background-color: $color-yellow;
        }
        &.red {
          background-color: $color-red;
        }
        &.violet {
          background-color: $color-violet;
        }
        &.blue {
          background-color: $color-blue;
        }
        &.green {
          background-color: $color-green;
        }
      }
    }
  }

  &:hover, &.active {
    .input {
      .thumb {
        transform: scaleY(2);
      }
    }
  }
}
</style>
