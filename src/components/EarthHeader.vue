<template>
  <header class="EarthHeader">
  </header>
</template>

<script>
import computeFromStore from '../assets/js/computeFromStore.js'
export default {
  name: 'EarthHeader',
  data () {
    return {
    }
  },
  computed: {
    ...computeFromStore(['year', 'scenario'])
  }
}
</script>

<style scoped lang="scss">
.EarthHeader {
  position: absolute;
  height: 64px;
  background: rgba(7,26,41,0.9);
  width: 100%;
  bottom: 0;
  left: 0;
}
</style>
