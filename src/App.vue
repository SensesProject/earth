<template>
  <div class="app">
    <VisEarth/>
    <EarthHeader/>
    <EarthOptions/>
  </div>
</template>

<script>
import VisEarth from './components/VisEarth.vue'
import EarthOptions from './components/EarthOptions.vue'
import EarthHeader from './components/EarthHeader.vue'

export default {
  name: 'app',
  components: {
    VisEarth,
    EarthOptions,
    EarthHeader
  },
  data () {
    return {
    }
  },
  computed: {
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
