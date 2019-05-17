<template>
  <div class="earth-options" :class="{comparing}">
    <div class="option-group option-group-explore">
      <div class="option option-title">
        <span class="title">Options</span>
        <span class="compare label" @click="toggleCompare()">{{comparing ? `EXPLORE ←` : `COMPARE →`}}</span>
      </div>
      <OptionSelect class="option" label="Indicator" v-model="indicator" :options="options.indicator"/>
      <OptionRadio class="option" label="Global Warming Level" v-model="temperature" :options="globalWarmingLevels"/>
      <OptionSelect class="option" label="Climate Model" v-model="climateModel" :options="climateModels"/>
      <OptionSelect class="option" label="Impact Model" v-model="impactModel" :options="impactModels"/>
      <OptionButton class="option" label="OK" @input="showOptions = false"/>
    </div>
    <div class="option-group option-group-compare">
      <div class="option option-title">
        <span class="label">Pick one!</span>
        <span class="title">&nbsp;</span>
      </div>
      <OptionSelect class="option" label="Indicator" :value="compareValue" @input="setComparison($event, 'indicator')" :options="options.indicator"/>
      <OptionRadio class="option" label="Global Warming Level" :value="compareValue" @input="setComparison($event, 'global-warming-level')" :options="globalWarmingLevels"/>
      <OptionSelect class="option" label="Climate Model" :value="compareValue" @input="setComparison($event, 'climate-model')" :options="climateModels"/>
      <OptionSelect class="option" label="Impact Model" :value="compareValue" @input="setComparison($event, 'impact-model')" :options="impactModels"/>
    </div>
  </div>
</template>

<script>
import OptionSelect from './OptionSelect.vue'
import OptionRadio from './OptionRadio.vue'
import OptionButton from './OptionButton.vue'
// import chroma from 'chroma-js'
import computeFromStore from '../assets/js/computeFromStore.js'
import { mapGetters } from 'vuex'
export default {
  name: 'EarthOptions',
  components: {
    OptionSelect,
    OptionRadio,
    OptionButton
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
      'showOptions',
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
      transform: translate(50%);
      z-index: 2;
    }

    &.option-group-compare {
      background: lighten($color-violet, 38);
      transform: translate(-50%);
    }
  }

  &.comparing {
    .option-group-explore {
      transform: translate(0);
      border-radius: 4px 0px 0px 4px;
    }

    .option-group-compare {
      transform: translate(0);
      border-radius: 0px 4px 4px 0px;
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
