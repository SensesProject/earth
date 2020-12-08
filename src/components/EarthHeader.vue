<template>
  <header class="EarthHeader">
    <SensesMenu darkmode transparent id="senses-earth" :logo="{sx:2, sy:0, mx:1, my:0, lx:0, ly:0}"/>
    <div class="options">
      <div class="option-line">
        <EarthRadio v-model="indicator" :options="indicatorOptions" class="invert option" :isHorizontal="false"/>
      </div>
      <div class="option-line">
        <EarthRange class="option" v-model="warmingLevelProxy" :max="maxTemp"/>
      </div>
    </div>
    <div class="details tiny">
      <PortalTarget name="key"/>
      <div class="text">
        Land are exposed to <span class="neon">{{indicatorLabel}}</span> at <span class="neon" v-html="warmingLabel"/> in climate model
        <SensesSelect v-model="climateModel" :options="climateModels" class="invert option"/>
        <template v-if="indicator !== 'heatwave'">
          & impact model <SensesSelect v-if="impactModels.length > 1" v-model="impactModel" :options="impactModels" class="invert option"/>
          <span v-else class="neon" >{{ impactModels[0] }}</span>
        </template><br>
        <span v-if="warning" v-html="warning"></span>&nbsp;
        <span class="learn" @click="showAbout = true">
          Learn more
        </span>
      </div>
    </div>
  </header>
</template>

<script>
import { PortalTarget } from 'portal-vue'
import SensesMenu from 'library/src/components/SensesMenu.vue'
import SensesSelect from 'library/src/components/SensesSelect.vue'
import EarthRadio from '@/components/EarthRadio.vue'
import EarthRange from '@/components/EarthRange.vue'
import computeFromStore from '../assets/js/computeFromStore.js'
import { mapGetters } from 'vuex'
import { format } from 'd3-format'
export default {
  name: 'EarthHeader',
  components: {
    SensesMenu,
    SensesSelect,
    EarthRange,
    EarthRadio,
    PortalTarget
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
    indicatorOptions () {
      return this.indicators.map(i => {
        return {
          glyph: `glyph-${i}`,
          label: `${i.replace(/-/g, ' ')}s`,
          value: i
        }
      })
    },
    maxTemp () {
      if (this.climateModel === 'GFDL-ESM2M') return 4
      if (this.climateModel === 'MIROC5') return 5
      return 6
    },
    warning () {
      if (this.climateModel === 'median' && this.warmingLevel === '2.5') return 'Data at the selected warming level are only available for 3 of the 4 climate models.'
      if (this.climateModel === 'median' && this.warmingLevel === '3.0') return 'Data at the selected warming level are only available for 2 of the 4 climate models.'
      if (this.climateModel === 'GFDL-ESM2M') return 'Data for the selected climate model are only available up to +2.0&thinsp;°C.'
      if (this.climateModel === 'MIROC5') return 'Data for the selected climate model are only available up to +2.5&thinsp;°C.'
      return null
    },
    indicatorLabel () {
      return this.indicatorOptions.find(opt => opt.value === this.indicator).label
    },
    warmingLabel () {
      return `${this.warmingLevel === '0.0' ? '±' : '+'}${this.warmingLevel}&thinsp;°C`
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
  height: 100vh;
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
    padding: 0 calc(#{$spacing / 2} - 2px);
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
      // margin-bottom: 4px;
      white-space: nowrap;
      flex-direction: column;
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
      // margin: 0 $spacing * 0.25;
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

  ::v-deep {
    .details {
      position: absolute;
      padding: 0 calc(#{$spacing / 2} - 2px) $spacing * 0.75;
      bottom: 0;
      color: white;

      .vue-portal-target {
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
    }

    .text {
      margin-top: $spacing / 4;

      span.neon {
        font-weight: bold;
        color: lighten(getColor(neon, 50), 5);
      }

      span.learn {
        pointer-events: all;
        text-decoration: underline;

        &:hover {
          color: lighten(getColor(neon, 50), 5);
          cursor: pointer;
        }
      }

      .option {
        pointer-events: all;
        margin: 0 $spacing / 8;
      }
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
