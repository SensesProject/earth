<template>
  <header class="EarthHeader">
    <SensesMenu darkmode transparent id="senses-earth" :logo="{sx:2, sy:0, mx:1, my:0, lx:0, ly:0}"/>
    <div class="options">
      <div class="option-line">
        <EarthRadio v-model="indicator" :options="indicatorOptions" class="invert option" :isHorizontal="false"/>
      </div>
      <div class="option-line">
        <input class="option" orient="vertical" v-model="warmingLevelProxy" type="range" min="0" :max="this.warmingLevels.length - 1"/>
        {{warmingLevel}}
      </div>
      <!-- <div class="option-line">
        in climate model
        <SensesSelect v-model="climateModel" :options="climateModels" class="invert option"/>
      </div>
      <div class="option-line">
        & impact model
        <SensesSelect v-if="impactModels.length > 1" v-model="impactModel" :options="impactModels" class="invert option"/>
        <span v-else class="highlight no-hover option" >{{ impactModels[0] }}</span>
      </div> -->
      <!-- <div class="option-line narrow">
        <span class="tiny">
          Advanced Options (coming soon)
        </span>
      </div> -->
      <!-- <div class="option-line narrow more mono" @click="showAbout = true">
        <span class="tiny">
          Learn more
        </span>
      </div> -->
    </div>
  </header>
</template>

<script>
import SensesMenu from 'library/src/components/SensesMenu.vue'
// import SensesSelect from 'library/src/components/SensesSelect.vue'
import EarthRadio from '@/components/EarthRadio.vue'
import computeFromStore from '../assets/js/computeFromStore.js'
import { mapGetters } from 'vuex'
import { format } from 'd3-format'
export default {
  name: 'EarthHeader',
  components: {
    SensesMenu,
    // SensesSelect,
    EarthRadio
  },
  data () {
    return {
    }
  },
  computed: {
    ...computeFromStore(['mode', 'indicator', 'indicators', 'climateModel', 'climateModels', 'warmingLevels', 'impactModel', 'warmingLevel', 'showAbout', 'compareValue', 'compareOption']),
    ...mapGetters(['impactModels']),
    warmingLevelProxy: {
      get () {
        return this.warmingLevels.indexOf(this.warmingLevel)
      },
      set (value) {
        this.warmingLevel = this.warmingLevels[value]
      }
    },
    warmingLevelOptions () {
      const { warmingLevels } = this
      return warmingLevels.map(value => ({
        value,
        label: `${+value === 0 ? '±' : '+'}${+value}`
        // label: `${+value === 0 ? '±' : '+'}${value}°C`
      }))
    },
    indicatorOptions () {
      return this.indicators.map(i => {
        return {
          glyph: `glyph-${i}`,
          label: i.replace(/-/g, ' '),
          value: i
        }
      })
    }
  },
  methods: {
    formatGlobalWarmingLevel (value) {
      return format('.1f')(value)
    },
    formatIndicator (value) {
      if (value == null) return
      return value.replace(/-/g, ' ')
    }
  }
}
</script>

<style scoped lang="scss">
@import "library/src/style/global.scss";

.EarthHeader {
  position: absolute;
  width: 100vw;
  top: 0;
  left: 0;
  pointer-events: none;

  display: flex;
  justify-content: space-between;
  align-items: top;
  flex-direction: column;
  // padding: $spacing / 2 $spacing $spacing;
  // background-image: linear-gradient(0deg, transparentize($color-background, 1) 0%, transparentize($color-background, 0.25) 100%);

  .senses-menu {
    pointer-events: all;
  }

  .options {
    position: absolute;
    height: 100vh;
    width: 100%;
    padding: 0 $spacing / 4;
    font-weight: $font-weight-regular;
    margin-right: $spacing;
    color: $color-white;
    display: flex;
    // flex-direction: column;
    justify-content: space-between;
    align-items: center;

    .option-line {
      display: flex;
      align-items: center;
      margin-bottom: 4px;
      white-space: nowrap;
      flex-direction: column;

      input[type=range][orient=vertical]
      {
          writing-mode: bt-lr; /* IE */
          -webkit-appearance: slider-vertical; /* WebKit */
          width: 8px;
          height: 175px;
          padding: 0 5px;
      }
    }

    .more {
      pointer-events: all;
      text-decoration: underline;
      cursor: pointer;
      margin-top: $spacing / 8;
      // transition: color $transition;
      &:hover {
        color: getColor(neon, 80)
      }
    }

    .option {
      pointer-events: all;
      cursor: default;
      margin: 0 $spacing * 0.25;
      // font-weight: $font-weight-bold;
      &.white {
        color: $color-white;
        // background: linear-gradient(0deg,transparent,transparent 2px,$color-white 2px,$color-white 3.5px,transparent 0);
      }
      // &.violet {
      //   color: $color-scale-violet;
      //   // background: linear-gradient(0deg,transparent,transparent 2px,$color-scale-violet 2px,$color-scale-violet 3.5px,transparent 0);
      // }
      // &.green {
      //   color: $color-scale-green;
      //   // background: linear-gradient(0deg,transparent,transparent 2px,$color-scale-green 2px,$color-scale-green 3.5px,transparent 0);
      // }
      // text-transform: uppercase;
      &.highlight.no-hover {
        background: $color-neon;
        color: $color-white;
        padding-top: 1px;
        padding-bottom: 1px;
      }
    }

    .button {
      $size: 24px;
      margin-top: calc(#{$spacing} - #{$size});
      border-radius: 2px;
      background: $color-green;
      height: $size;
      width: $size;
      background: $color-green url(../assets/img/options.svg) center center no-repeat;
      cursor: pointer;
      pointer-events: all;
    }
  }
}
</style>
<style lang="scss">
@import "library/src/style/global.scss";
.senses-select .trigger button.highlight {
  background: $color-neon;
  color: $color-white;

  svg g path {
    stroke: $color-white;
  }

  &:hover {
    background: getColor(neon, 40);
    svg g path {
      stroke: $color-white;
    }
  }
}
div.senses-tooltip-select {
  box-shadow: none;

  .tooltip-inner {
    background: getColor(neon, 20);
    color: $color-white;
    min-width: 80px;

    .option {
      &:hover {
        background: getColor(neon, 40);
        color: $color-white;
      }
      &.active:hover {
        background: getColor(neon, 50);
        color: $color-white;
      }
    }
  }

  .tooltip-arrow {
    border-color: getColor(neon, 20);
  }
}
.senses-radio .radio label {
  margin-bottom: 0 !important;
  color: getColor(neon, 60) !important;
  &:hover {
    color: getColor(neon, 80) !important;
  }
  input + span {
    padding: 2px 0.125rem !important;
    line-height: inherit !important;
  }
}
</style>
