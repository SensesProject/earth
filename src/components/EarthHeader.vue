<template>
  <header class="EarthHeader">
    <a class="senses" href="/">
      <svg width="32" height="32" viewBox="0 0 32 32">
        <circle cx="12" cy="12" r="11.5"/>
        <circle cx="24" cy="28" r="3.5"/>
        <circle cx="24" cy="11" r="7.5"/>
      </svg>
      <h1>SENSES Earth</h1>
    </a>
    <h2>{{ title }}</h2>
  </header>
</template>

<script>
import computeFromStore from '../assets/js/computeFromStore.js'
export default {
  name: 'EarthHeader',
  data () {
    return {
      title: 'Average near surface temperature 1900–1905 in scenario RCP 6.0'
    }
  },
  computed: {
    ...computeFromStore(['period1', 'scenario1'])
  }
}
</script>

<style scoped lang="scss">
@import "../assets/style/variables";

.EarthHeader {
  position: absolute;
  background: $color-overlay-background;
  width: 100vw;
  top: 0;
  left: 0;

  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $spacing / 2 $spacing;
  flex-direction: row-reverse;

  .senses {
    display: flex;
    justify-content: space-between;
    align-items: center;

    svg {
      circle {
        fill: none;
        stroke: $color-white;
      }
    }

    h1 {
      margin-left: $spacing / 4;
    }
  }
}
</style>
