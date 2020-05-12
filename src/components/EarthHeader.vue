<template>
  <header class="EarthHeader">
    <SensesMenu darkmode transparent id="senses-earth" :logo="{sx:2, sy:0, mx:1, my:0, lx:0, ly:0}"/>
    <h2>
      <OptionSelectInline v-model="indicator" :options="indicators" class="option"/>
      <OptionSelectInline v-model="climateModel" :options="climateModels" class="option"/>
      <OptionSelectInline v-model="impactModel" :options="impactModels" class="option"/>
      <OptionSelectInline v-model="temperature" :options="temperatures" class="option"/>
    </h2>
  </header>
</template>

<script>
import SensesMenu from 'library/src/components/SensesMenu.vue'
import OptionSelectInline from './OptionSelectInline.vue'
import computeFromStore from '../assets/js/computeFromStore.js'
import { mapGetters } from 'vuex'
import { format } from 'd3-format'
export default {
  name: 'EarthHeader',
  components: {
    SensesMenu,
    OptionSelectInline
  },
  data () {
    return {
    }
  },
  computed: {
    ...computeFromStore(['mode', 'indicator', 'indicators', 'climateModel', 'climateModels', 'temperatures', 'impactModel', 'temperature', 'showOptions', 'compareValue', 'compareOption']),
    ...mapGetters(['globalWarmingLevels', 'impactModels'])
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
@import "../assets/style/variables";

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
    padding: $spacing / 4 $spacing / 2 $spacing / 4;
    font-weight: $font-weight-regular;
    margin-right: $spacing;
    color: $color-white;

    .option {
      pointer-events: all;
      cursor: default;
      font-weight: $font-weight-bold;
      &.white {
        color: $color-white;
        // background: linear-gradient(0deg,transparent,transparent 2px,$color-white 2px,$color-white 3.5px,transparent 0);
      }
      &.violet {
        color: $color-scale-violet;
        // background: linear-gradient(0deg,transparent,transparent 2px,$color-scale-violet 2px,$color-scale-violet 3.5px,transparent 0);
      }
      &.green {
        color: $color-scale-green;
        // background: linear-gradient(0deg,transparent,transparent 2px,$color-scale-green 2px,$color-scale-green 3.5px,transparent 0);
      }
      // text-transform: uppercase;
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
