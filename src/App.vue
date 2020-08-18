<template>
  <div class="app">
    <VisEarth :grid="grid" :scale="scale" @details="showDetails($event)"/>
    <EarthHeader/>
    <transition name="fade">
      <div class="overlay" is-overlay v-if="showAbout || showCountryDetails" @click="hideOverlay($event)">
        <div class="close button"  is-overlay @click="hideOverlay(true)">
          <SensesFalafel color="white" symbol="close"/>
        </div>
        <OverlayAbout v-if="showAbout"/>
        <CountryDetails v-if="showCountryDetails"/>
      </div>
    </transition>
  </div>
</template>

<script>
import 'vue-resize/dist/vue-resize.css'
import SensesFalafel from 'library/src/components/SensesFalafel.vue'
import VisEarth from './components/VisEarth.vue'
import OverlayAbout from './components/OverlayAbout.vue'
import CountryDetails from './components/CountryDetails.vue'
import EarthHeader from './components/EarthHeader.vue'
import { mapGetters, mapState } from 'vuex'
import computeFromStore from './assets/js/computeFromStore.js'

export default {
  name: 'app',
  components: {
    VisEarth,
    OverlayAbout,
    CountryDetails,
    EarthHeader,
    SensesFalafel
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapState(['grid']),
    ...mapGetters(['scale']),
    ...computeFromStore(['showAbout', 'showCountryDetails'])
  },
  methods: {
    hideOverlay (e) {
      if (e === true || e.target.getAttribute('is-overlay') != null) {
        this.showAbout = false
        this.showCountryDetails = null
      }
    },
    showDetails (country) {
      this.showCountryDetails = country
    }
  },
  mounted () {
    this.$store.dispatch('init')
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
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 200;

  background: transparentize(getColor(neon, 0), 0.02);
  @supports (
    (-webkit-backdrop-filter: saturate(180%) blur(20px)) or
      (backdrop-filter: saturate(180%) blur(20px))
  ) {
    background: transparent;
    -webkit-backdrop-filter: saturate(180%) blur(10px);
    backdrop-filter: saturate(180%) blur(10px);
  }

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
  .close {
    height: 40px;
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 12px;
    right: $spacing / 2;
  }
}
</style>
