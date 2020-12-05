<template>
  <div class="earth-range">
    <div class="label">
      <svg width="182" height="30">
        <g transform="rotate(90) translate(-4, -2)">
          <g v-for="i in 7" :key="i" :transform="`translate(0 -${(i - 0.5) * (178 / 7)})`"
            :opacity="i - 1 > max ? 0.2 : i -1 === value ? 1 : 0.6">
            <line stroke="white" :x2="(i - 1) % 2 === 0 ? -6 : -3"/>
            <!-- <rect width="2" y="-12" height="24" fill="red"/> -->
            <text v-if="(i - 1) % 2 === 0" fill="white" text-anchor="end" y="4" x="-12">
              {{i - 1 === 0 ? '±' : '+'}}{{(i - 1) / 2}}&thinsp;°C
            </text>
          </g>
        </g>
      </svg>
    </div>
    <input type="range"
      :style="{width: `${2 + (max + 1) * (180/7)}px`}"
      @input="$emit('input', $event.target.value)"
      :value="value"
      :max="max"
      min="0"/>
  </div>
</template>

<script>
export default {
  name: 'SensesRadio',
  props: {
    value: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 7
    }
  },
  data () {
    return {
    }
  },
  watch: {
    max (max) {
      if (this.value > max) this.$emit('input', max)
    }
  }
}
</script>

<style scoped lang="scss">
@import "library/src/style/global.scss";
$btn-size: 28px;
.earth-range {
  transform: translate(77px, 3px) rotate(-90deg);
  position: relative;
  width: 182px;
  height: $spacing;

  .label {
    position: absolute;
    background: getColor(neon, 0);
    border-radius: $spacing / 2;
    top: 0;
    height: 100%;
    width: 100%;
    z-index: -1;

    svg {
      overflow: visible;
      pointer-events: none;
    }
  }

  input[type=range]{
    writing-mode: bt-lr; /* IE */
    -webkit-appearance: slider-vertical; /* WebKit */
    height: $spacing;
    margin: 0;
    background-color: getColor(neon, 20);
    border-radius: $spacing / 2;
    -webkit-appearance: none;
    padding: 0px 2px;
  }
  input[type=range]:focus {
    outline: none;
  }
  input[type=range]::-webkit-slider-runnable-track {
    background: getColor(neon, 20);
    border: 0;
    border-radius: 25px;
    width: 100%;
    height: $btn-size;
    cursor: pointer;
  }
  input[type=range]::-webkit-slider-thumb {
    margin-top: 0px;
    width: $btn-size;
    height: $btn-size;
    background: getColor(neon, 50);
    border: 0;
    border-radius: 14px;
    cursor: pointer;
    -webkit-appearance: none;
  }
  input[type=range]:focus::-webkit-slider-runnable-track {
    background: none;
  }
  input[type=range]::-moz-range-track {
    background: getColor(neon, 20);
    border: 0;
    border-radius: 25px;
    width: 100%;
    height: $btn-size;
    cursor: pointer;
  }
  input[type=range]::-moz-range-thumb {
    width: $btn-size;
    height: $btn-size;
    background: getColor(neon, 50);
    border: 0;
    border-radius: 14px;
    cursor: pointer;
  }
  input[type=range]::-ms-track {
    background: getColor(neon, 20);
    border-color: transparent;
    border-width: 0px 0;
    color: transparent;
    width: 100%;
    height: $btn-size;
    cursor: pointer;
  }
  input[type=range]::-ms-fill-lower {
    background: getColor(neon, 20);
    border: 0;
    border-radius: 50px;
  }
  input[type=range]::-ms-fill-upper {
    background: getColor(neon, 20);
    border: 0;
    border-radius: 50px;
  }
  input[type=range]::-ms-thumb {
    width: $btn-size;
    height: $btn-size;
    background: getColor(neon, 50);
    border: 0;
    border-radius: 14px;
    cursor: pointer;
    margin-top: 0px;
    /*Needed to keep the Edge thumb centred*/
  }
  input[type=range]:focus::-ms-fill-lower {
    background: getColor(neon, 20);
  }
  input[type=range]:focus::-ms-fill-upper {
    background: getColor(neon, 20);
  }
  @supports (-ms-ime-align:auto) {
    input[type=range] {
      margin: 0;
    }
  }

}

</style>
