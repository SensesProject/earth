<template>
  <div class="app">
    <ResizeObserver @notify="setClientSize"/>
    <VisEarth/>
    <EarthHeader/>

    <transition name="fade">
      <div class="overlay" is-overlay v-if="showOptions" @click="hideOptions($event)">
        <EarthOptions/>
      </div>
    </transition>
  </div>
</template>

<script>
import 'vue-resize/dist/vue-resize.css'
import VisEarth from './components/VisEarth.vue'
import EarthOptions from './components/EarthOptions.vue'
import EarthHeader from './components/EarthHeader.vue'
import { ResizeObserver } from 'vue-resize'
import computeFromStore from './assets/js/computeFromStore.js'

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
    ...computeFromStore(['showOptions'])
  },
  methods: {
    setClientSize () {
      this.$store.dispatch('updateSize')
    },
    hideOptions (e) {
      if (e.target.getAttribute('is-overlay') != null) this.showOptions = false
    }
  },
  mounted () {
    this.$store.dispatch('setDefaults')
  }
}
</script>

<style lang="scss">
@import "/assets/style/base";
</style>
<style lang="scss" scoped>
@import "/assets/style/variables";
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
