<template>
  <div class="OptionSelect">
    {{ label }}
    <!-- <svg :class="[color]" width="6px" height="7px" viewBox="0 0 6 7">
      <polygon points="0 4.5 3 7 6 4.5"/>
      <polygon points="0 2.5 3 0 6 2.5"/>
    </svg> -->
    <select :class="[color]" v-model="value">
      <option
        v-for="o in options"
        :key="o.value"
        :value="o.value">{{ o.label.toUpperCase() }}&nbsp;</option>
    </select>
  </div>
</template>

<script>
export default {
  name: 'OptionSelect',
  props: {
    label: {
      type: String,
      default: 'label'
    },
    color: {
      type: String,
      default: 'blue'
    },
    valueKey: {
      type: String,
      default: 'key'
    },
    options: {
      type: Array,
      default: null
    }
  },
  data () {
    return {
    }
  },
  computed: {
    value: {
      get () {
        return this.$store.state[this.valueKey]
      },
      set (value) {
        this.$store.dispatch('update', { value, prop: this.valueKey })
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import "../assets/style/variables";

.OptionSelect {
  text-transform: uppercase;
  display: inline-block;

  select {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    font-size: 1rem;
    border: none;
    background: none;
    margin: 0;
    padding: 0;
    width: auto;
    outline: none;
    font-family: 'Plex Sans', sans-serif;
    font-feature-settings: "kern";
    font-weight: 300;
    line-height: 1;
  }
}
</style>
