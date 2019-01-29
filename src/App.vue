<template>
  <div class="app">
    <VisEarth :grid="grid"/>
    <EarthOptions/>
  </div>
</template>

<script>
import VisEarth from './components/VisEarth.vue'
import EarthOptions from './components/EarthOptions.vue'

import tasRCP26 from './assets/data/diff_annual_mean_tas_all-models-rcp26.nc.json'
import tasRCP60 from './assets/data/tas-rcp60-2025.json'
import wsi from './assets/data/wsi.json'

export default {
  name: 'app',
  components: {
    VisEarth,
    EarthOptions,
  },
  data () {
    return {
      gridData: 'tasRCP60'
    }
  },
  computed: {
    grid () {
      if (this.gridData === 'wsi') return wsi
      if (this.gridData === 'tasRCP26') return tasRCP26
      if (this.gridData === 'tasRCP60') return tasRCP60
      return null
    }
  }
}
</script>

<style lang="scss">
@import "/assets/style/base";
*, *:before, *:after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
</style>
