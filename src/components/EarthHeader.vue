<template>
  <header class="EarthHeader">
    <SensesMenu darkmode transparent id="senses-earth" :logo="{sx:2, sy:0, mx:1, my:0, lx:0, ly:0}"/>
    <div class="wide">
      <h2 class="tiny">
        <div class="option-line">
          Land area exposed to
          <SensesSelect v-model="indicator" :options="indicatorOptions" class="invert option"/>
        </div>
        <div class="option-line">
          at
          <SensesRadio v-model="temperature" :options="temperatureOptions" class="invert option"/>
          °C global warming
        </div>
        <div class="option-line">
          in climate model
          <SensesSelect v-model="climateModel" :options="climateModels" class="invert option"/>
        </div>
        <div class="option-line">
          & impact model
          <SensesSelect v-if="impactModels.length > 1" v-model="impactModel" :options="impactModels" class="invert option"/>
          <span v-else class="highlight no-hover option" >{{ impactModels[0] }}</span>
        </div>
        <!-- <div class="option-line narrow">
          <span class="tiny">
            Advanced Options (coming soon)
          </span>
        </div> -->
        <div class="option-line narrow more mono" @click="showOptions = true">
          <span class="tiny">
            Learn more
          </span>
        </div>
      </h2>
    </div>
  </header>
</template>

<script>
import SensesMenu from 'library/src/components/SensesMenu.vue'
import SensesSelect from 'library/src/components/SensesSelect.vue'
import SensesRadio from 'library/src/components/SensesRadio.vue'
import computeFromStore from '../assets/js/computeFromStore.js'
import { mapGetters } from 'vuex'
import { format } from 'd3-format'
export default {
  name: 'EarthHeader',
  components: {
    SensesMenu,
    SensesSelect,
    SensesRadio
  },
  data () {
    return {
    }
  },
  computed: {
    ...computeFromStore(['mode', 'indicator', 'indicators', 'climateModel', 'climateModels', 'temperatures', 'impactModel', 'temperature', 'showOptions', 'compareValue', 'compareOption']),
    ...mapGetters(['globalWarmingLevels', 'impactModels']),
    temperatureOptions () {
      const { temperatures } = this
      return temperatures.map(value => ({
        value,
        label: `${+value === 0 ? '±' : '+'}${+value}`
        // label: `${+value === 0 ? '±' : '+'}${value}°C`
      }))
    },
    indicatorOptions () {
      return this.indicators.map(i => {
        return {
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

  h2 {
    padding: 0 $spacing / 2;
    font-weight: $font-weight-regular;
    margin-right: $spacing;
    color: $color-white;
    display: flex;
    flex-direction: column;

    .option-line {
      display: flex;
      align-items: center;
      margin-bottom: 4px;
      white-space: nowrap;
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
