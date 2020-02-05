<template>
  <div class="earth-options" :class="{comparing}">
    <div class="option-group option-group-explore">
      <div class="option option-title">
        <span class="title">{{ showCountryDetails }}</span>
      </div>
      <OptionLink class="option" label="↗ Show ISIpedia Report"
        :href="`http://isipedia.pik-potsdam.de/report/future-projections.${showCountryDetails}.extreme-events.d786b`"
        target="_blank"/>
      <OptionButton class="option" label="Close" @input="showCountryDetails = false"/>
    </div>
  </div>
</template>

<script>
import OptionLink from './OptionLink.vue'
import OptionButton from './OptionButton.vue'
// import chroma from 'chroma-js'
import computeFromStore from '../assets/js/computeFromStore.js'
import { mapGetters } from 'vuex'
export default {
  name: 'EarthOptions',
  components: {
    OptionButton,
    OptionLink
  },
  data () {
    return {
      comparing: this.$store.state.compareValue != null,
      compare: null,
      mode: this.$store.state.mode,
      options: {
        mode: [{
          value: 'explore'
        }, {
          value: 'compare'
        }],
        variable: [{
          value: 'land-area-affected',
          label: 'land area affected'
        }],
        indicator: [{
          value: 'crop-failure',
          label: 'crop failure'
        }, {
          value: 'drought',
          label: 'drought'
        }, {
          value: 'heatwave',
          label: 'heatwave'
        }, {
          value: 'river-flood',
          label: 'river flood'
        }, {
          value: 'wildfire',
          label: 'wildfire'
        }],
        scenario: [{
          value: 'rcp26',
          label: 'RCP 2.6'
        }, {
          value: 'rcp60',
          label: 'RCP 6.0'
        }]
      },
      // periodRange: [2005, 2010],
      variableOptions: {
        domain: [0, 1],
        slider: 1,
        step: 1,
        ticks: 2
      }
    }
  },
  computed: {
    ...computeFromStore([
      'width',
      'period1',
      'domain1',
      'range1',
      'climateModels',
      'climateModel',
      'temperature',
      'temperatures',
      'indicator',
      'impactModel',
      'showCountryDetails',
      'compareOption',
      'compareValue'
    ]),
    ...mapGetters([
      'impactModels',
      'globalWarmingLevels'
    ]),
    axisWidth () {
      return this.width / 2 - 64
    },
    // colors () {
    //   const color0 = '#070019'
    //   const color1 = '#B035C9'
    //   const color2 = '#54E8A9'
    //   const color3 = '#FEF4DD'
    //
    //   const cs1 = chroma.scale([color0, color1]).mode('lab').colors(50)
    //   const cs2 = chroma.scale([color2, color3]).mode('lab').colors(50)
    //
    //   return cs1.map((c1, i) => {
    //     return chroma.scale([c1, cs2[i]]).mode('lab').colors(50)
    //     // return cs2.map((c2, i) => {
    //     //   return chroma.average([c1, c2], 'lch')
    //     // })
    //   })
    // },
    keyColors () {
      const { colors } = this
      return [
        colors[0],
        colors.map((c, i) => c[i]),
        colors.map(c => c[0])
      ]
    }
  },
  methods: {
    toggleCompare () {
      this.comparing = !this.comparing
      this.setComparison(null, null)
    },
    setComparison (value, option) {
      this.compareOption = option
      this.compareValue = value
    }
  }
}
</script>

<style scoped lang="scss">
@import "../assets/style/variables";

.earth-options {
  transition: transform .4s;
  color: $color-black;
  display: flex;

  .option-group {
    width: 320px;
    border-radius: 4px;
    transition: transform .4s, border-radius .4s;
    color: $color-black;
    padding: $spacing / 2 $spacing / 2;

    &.option-group-explore {
      background: $color-green;
      // transform: translate(0);
      z-index: 2;
    }
  }

  .option-title {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    .title {
      font-weight: $font-weight-bold;
    }
    .label {
      font-family: $font-mono;
      font-size: 0.7em;

      &.compare {
        cursor: pointer;

        &:hover {
          text-decoration: underline;
        }

        &.fade-enter-active, &.fade-leave-active {
          transition: opacity .2s;
        }
        &.fade-enter, &.fade-leave-to {
          opacity: 0;
        }
      }
    }
  }

  .option + .option {
    margin-top: $spacing / 2;
  }
}
</style>
