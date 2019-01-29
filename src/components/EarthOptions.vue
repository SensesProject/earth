<template>
  <div class="EarthOptions">
    <input v-model="year" type="range" min="2005" max="2095" step="5">
    <select v-model="scenario">
      <option value="rcp26">rcp26</option>
      <option value="rcp60">rcp60</option>
    </select>

  </div>
</template>

<script>
import computeFromStore from '../assets/js/computeFromStore.js'
export default {
  name: 'EarthOptions',
  data () {
    return {
    }
  },
  computed: {
    // ...mapFields([
    //   'year',
    //   'scenario',
    //   'variable'
    // ])
    // year: {
    //   get () {
    //     return this.$store.state.year
    //   },
    //   set (value) {
    //     this.$store.dispatch('updateYear', value)
    //   }
    // },
    // scenario: {
    //   get () {
    //     return this.$store.state.scenario
    //   },
    //   set (value) {
    //     this.$store.dispatch('updateScenario', value)
    //   }
    // }
    ...computeFromStore(['year', 'scenario'])
  }
}
</script>

<style scoped lang="scss">
.EarthOptions {
  position: absolute;
  height: 128px;
  background: rgba(7,26,41,0.9);
  width: 100%;
  bottom: 0;
  left: 0;
}
</style>
