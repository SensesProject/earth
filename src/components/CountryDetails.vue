<template>
  <div class="country-details">
      <h3 class="title">
        {{ showCountryDetails.name }}
      </h3>
      <a class="button"
        :href="`http://isipedia.pik-potsdam.de/report/future-projections.${showCountryDetails.code}.extreme-events.d786b`"
        target="_blank">
        ↗ Open ISIpedia Country Report
      </a>
      <span class="button" @click="showCountryDetails = null">
        Close
      </span>
  </div>
</template>

<script>
import computeFromStore from '../assets/js/computeFromStore.js'
export default {
  name: 'country-details',
  computed: {
    ...computeFromStore([
      'showCountryDetails'
    ])
  }
}
</script>

<style scoped lang="scss">
@import "../assets/style/variables";

.country-details {
  background: $color-white;
  border-radius: $border-radius;
  color: $color-black;
  width: 320px;
  padding: $spacing / 2 $spacing / 2;

  .button {
    margin-top: $spacing / 2;
    text-align: center;
    padding: $spacing / 4 $spacing / 2;
    border: 1px solid $color-pale-gray;
    border-radius: $border-radius;
    pointer-events: all;
    display: block;
    background: $color-white;
    cursor: pointer;
    color: $color-black;

    &:hover {
      background-color: getColor(gray, 90)
    }
  }
}
</style>
