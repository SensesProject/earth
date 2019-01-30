<template>
  <div class="app">
    <ResizeObserver @notify="setClientSize"/>
    <VisEarth/>
    <EarthHeader/>
    <EarthOptions/>
  </div>
</template>

<script>
import 'vue-resize/dist/vue-resize.css'
import VisEarth from './components/VisEarth.vue'
import EarthOptions from './components/EarthOptions.vue'
import EarthHeader from './components/EarthHeader.vue'
import { ResizeObserver } from 'vue-resize'

export default {
  name: 'app',
  components: {
    VisEarth,
    EarthOptions,
    EarthHeader,
    ResizeObserver
  },
  data () {
    return {
    }
  },
  computed: {
  },
  methods: {
    setClientSize () {
      this.$store.dispatch('updateSize')
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
