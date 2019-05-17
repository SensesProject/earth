<template>
  <header class="EarthHeader">
    <SensesLogo class="senses" color="white" :sx="2" :sy="0" :mx="1" :my="0" :lx="0" :ly="0"/>
    <h2>
      Frequency of
      <span class="option" :class="{ violet: compareOption === null || compareOption === 'indicator'}">
        {{ formatIndicator(indicator) }}</span>
      <span v-if="compareOption === 'indicator'">
        &
        <span class="option green">{{ formatIndicator(compareValue) }}</span>
      </span>
      at a
      <span class="option" :class="{ violet: compareOption === 'global-warming-level'}">
        {{ formatGlobalWarmingLevel(temperature) }}&#8239;°C
      </span>
      <span v-if="compareOption === 'global-warming-level'">
        &
        <span class="option green">{{ formatGlobalWarmingLevel(compareValue) }}&#8239;°C</span>
      </span>
      global warming level<br>
      in climate model
      <span class="option" :class="{ violet: compareOption === 'climate-model'}">
        {{ climateModel }}
      </span>
      <span v-if="compareOption === 'climate-model'">
        &
        <span class="option green">{{ compareValue }}</span>
      </span>
      and impact model
      <span class="option" :class="{ violet: compareOption === 'impact-model'}">
        {{ impactModel }}
      </span>
      <span v-if="compareOption === 'impact-model'">
        &
        <span class="option green">{{ compareValue }}</span>
      </span><br>
      <div class="button" role="button" @click="showOptions = true"/>
    </h2>
  </header>
</template>

<script>
import SensesLogo from 'library/src/components/SensesLogo.vue'
import computeFromStore from '../assets/js/computeFromStore.js'
import { format } from 'd3-format'
export default {
  name: 'EarthHeader',
  components: {
    SensesLogo
  },
  data () {
    return {
    }
  },
  computed: {
    ...computeFromStore(['mode', 'indicator', 'climateModel', 'impactModel', 'temperature', 'showOptions', 'compareValue', 'compareOption'])
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
  flex-direction: row-reverse;
  padding: $spacing / 2 $spacing $spacing;
  background-image: linear-gradient(0deg, transparentize($color-background, 1) 0%, transparentize($color-background, 0.25) 100%);

  .senses-logo {
    height: $spacing * 1.5;
  }

  h2 {
    padding-top: $spacing * 0.25;
    font-weight: $font-weight-regular;
    margin-right: $spacing;

    .option {
      pointer-events: all;
      cursor: default;
      font-weight: $font-weight-bold;
      &.violet {
        color: $color-white;
        background: linear-gradient(0deg,transparent,transparent 2px,$color-scale-violet 2px,$color-scale-violet 5px,transparent 0);
      }
      &.green {
        color: $color-white;
        background: linear-gradient(0deg,transparent,transparent 2px,$color-scale-green 2px,$color-scale-green 3.5px,transparent 0);
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
