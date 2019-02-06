<template>
  <div class="InputSlider" :style="{ width: `${width}px` }">
    <div class="top">
      <div slot="label" class="label">Period</div>
      <div :class="[color]" class="reset" v-show="enabled && enablable">reset</div>
    </div>
    <div class="ticks">
      <div v-for="(t, i) in ticks" :key="`tick-${i}`" :class="t.class" class="tick" :style="t.style">{{ t.label }}</div>
    </div>
    <!-- <div class="input-bg">
      <div class="track"/>
      <div class="thumb"/>
    </div> -->
    <div class="input">
      <input :class="color" type="range" v-model="value" v-bind="inputOptions" :style="slider">
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
    }
  },
  data () {
    return {
      enabled: false,
      value: 10
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
      const t = [this.value, ...this.options.domain].map((t, i, ticks) => {
        return {
          label: i === 0 ? `${t} to ${+t + this.options.slider}` : t,
          style: {
            left: `${this.scaleFull(t)}px`,
            transform: `translate(-50%)`
          },
          class: i === 0 ? [this.color] : null
        }
      })
      return t
    },
    sliderWidth () {
      return this.width * this.options.slider / (this.options.domain[1] - this.options.domain[0])
    },
    slider () {
      const { scaleAlt, value, sliderWidth } = this
      const x = scaleAlt(value)
      const c1 = '#0DA4D5'
      const c2 = '#00CC84'
      const cMid = '#FFF'
      return {
        '--track-bg': `linear-gradient(to right, ${c1} ${x - 2}px, transparent ${x - 2}px, transparent ${x + sliderWidth + 2}px, ${c2} ${x + sliderWidth + 2}px)`,
        '--thumb-bg': `linear-gradient(to right, ${c1}, ${cMid}, ${c2})`,
        '--thumb-width': `${sliderWidth}px`
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import "../assets/style/variables";
@mixin track () {
  &::-webkit-slider-runnable-track {
    @content;
  }
  &::-moz-range-track {
    @content;
  }
  &::-ms-track {
    @content;
  }
  &::-ms-fill-lower {
    @content;
  }
  &::-ms-fill-upper {
    @content;
  }
}
@mixin thumb () {
  &::-moz-range-thumb {
    @content;
  }
  &::-webkit-slider-thumb {
    @content;
  }
  &::-ms-thumb {
    @content;
  }
}
.InputSlider {
  .label {
    text-transform: uppercase;
  }

  .ticks {
    position: relative;
    pointer-events: none;

    .tick {
      position: absolute;
      white-space: nowrap;
    }
  }

  .input-bg {
    height: 24px;
    position: absolute;
    pointer-events: none;

    > div {
      position: absolute;
    }
  }

  input[type=range] {
    height: 24px;
    -webkit-appearance: none;
    width: 100%;
    background: none;

    &:focus {
      outline: none;
    }

    @include track () {
      height: 2px;
      // animate: 0.2s;
      border-radius: 0;
      transform: translateY(11px);
      background: var(--track-bg, rgba(255, 255, 255, 0.4));
    }
    &::-ms-track {
      color: transparent;
    }
    @include thumb () {
      height: 2px;
      width: var(--thumb-width, 20px);
      border-radius: 0;
      // background: $color-white;
      -webkit-appearance: none;
      border: none;
      transition: height .2s, transform .2s;
      // transform: translateY(11px);
      background: var(--thumb-bg, rgb(255, 255, 255));
    }
    &::-ms-tooltip { display: none; }

    &:hover, &:focus {
      @include thumb () {
        transform: translateY(0px) scaleY(2.5);
      }
    }
    // &.yellow {
    //   @include thumb () {
    //     background: $color-yellow;
    //   }
    // }
    // &.red {
    //   @include thumb () {
    //     background: $color-red;
    //   }
    // }
    // &.green {
    //   @include thumb () {
    //     background: $color-green;
    //   }
    // }
    // &.blue {
    //   @include thumb () {
    //     background: $color-blue;
    //   }
    // }
    // &.violet {
    //   @include thumb () {
    //     background: $color-violet;
    //   }
    // }
  }
}
</style>
