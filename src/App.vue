<template>
  <div class="app">
    <ResizeObserver @notify="setClientSize"/>
    <VisEarth/>
    <EarthHeader/>

    <transition name="fade">
      <div class="overlay" is-overlay v-if="showOptions || showCountryDetails" @click="hideOverlay($event)">
        <EarthOptions v-if="showOptions"/>
        <CountryDetails v-if="showCountryDetails"/>
      </div>
    </transition>
  </div>
</template>

<script>
import 'vue-resize/dist/vue-resize.css'
import VisEarth from './components/VisEarth.vue'
import EarthOptions from './components/EarthOptions.vue'
import CountryDetails from './components/CountryDetails.vue'
import EarthHeader from './components/EarthHeader.vue'
import { ResizeObserver } from 'vue-resize'
import computeFromStore from './assets/js/computeFromStore.js'

export default {
  name: 'app',
  components: {
    VisEarth,
    EarthOptions,
    CountryDetails,
    EarthHeader,
    ResizeObserver
  },
  data () {
    return {
    }
  },
  computed: {
    ...computeFromStore(['showOptions', 'showCountryDetails'])
  },
  methods: {
    setClientSize () {
      this.$store.dispatch('updateSize')
    },
    hideOverlay (e) {
      if (e.target.getAttribute('is-overlay') != null) {
        this.showOptions = false
        this.showCountryDetails = false
      }
    }
  },
  mounted () {
    this.$store.dispatch('setDefaults')
  }
}
</script>

<style lang="scss">
@import "@/assets/style/base.scss";
</style>
<style lang="scss" scoped>
@import "@/assets/style/variables.scss";
.overlay {
  position: fixed;
  height: 100vh;
  width: 100vw;
  background: transparentize($color-black, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;

  &.fade-enter-active, &.fade-leave-active {
  transition: opacity .4s;
  }
  &.fade-enter {
    opacity: 0;
    .earth-options {
      transform: translateY(-$spacing);
    }
  }
  &.fade-leave-to {
    opacity: 0;
    .earth-options {
      transform: translateY($spacing);
    }
  }
}
</style>
