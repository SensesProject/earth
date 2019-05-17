<template>
  <header class="EarthHeader">
    <SensesLogo class="senses" color="white" :sx="2" :sy="0" :mx="1" :my="0" :lx="0" :ly="0"/>
    <h2>
      Frequency of
      <OptionSelectInline v-model="indicator" :options="indicators" class="option" :class="{ green: compareOption === 'indicator', white: compareOption === null}" />
        <!-- {{ formatIndicator(indicator) }}</span> -->
      <span v-if="compareOption === 'indicator'">
        &
        <OptionSelectInline v-model="compareValue" :options="indicators" class="option violet"/>
      </span>
      at a
      <OptionSelectInline v-model="temperature" :options="globalWarmingLevels" class="option" :class="{ green: compareOption === 'global-warming-level'}"/>
      <span v-if="compareOption === 'global-warming-level'">
        &
        <OptionSelectInline v-model="compareValue" :options="globalWarmingLevels" class="option violet"/>
      </span>
      global warming level<br>
      in climate model
      <span class="option" :class="{ green: compareOption === 'climate-model'}">
        {{ climateModel }}
      </span>
      <span v-if="compareOption === 'climate-model'">
        &
        <span class="option violet">{{ compareValue }}</span>
      </span>
      and impact model
      <span class="option" :class="{ green: compareOption === 'impact-model'}">
        {{ impactModel }}
      </span>
      <span v-if="compareOption === 'impact-model'">
        &
        <span class="option violet">{{ compareValue }}</span>
      </span><br>
      <div class="button" role="button" @click="showOptions = true"/>
    </h2>
  </header>
</template>

<script>
import SensesLogo from 'library/src/components/SensesLogo.vue'
import OptionSelectInline from './OptionSelectInline.vue'
import computeFromStore from '../assets/js/computeFromStore.js'
import { mapGetters } from 'vuex'
import { format } from 'd3-format'
export default {
  name: 'EarthHeader',
  components: {
    SensesLogo,
    OptionSelectInline
  },
  data () {
    return {
    }
  },
  computed: {
    ...computeFromStore(['mode', 'indicator', 'indicators', 'climateModel', 'impactModel', 'temperature', 'showOptions', 'compareValue', 'compareOption']),
    ...mapGetters(['globalWarmingLevels'])
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
    pointer-events: all;
  }

  h2 {
    padding-top: $spacing * 0.25;
    font-weight: $font-weight-regular;
    margin-right: $spacing;

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
