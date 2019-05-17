<template>
  <div class="option-select">
    <span class="label">{{ label }}&nbsp;</span>
    <div class="select">
      <select :value="value" @change="$emit('input', $event.target.value)">
        <option
          v-for="o in options"
          :disabled="o.disabled"
          :key="o.value || o"
          :value="o.value || o">{{ o.label || o.value || o }}</option>
      </select>
      <div class="selected">{{ valueLabel }}&nbsp;</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OptionSelect',
  props: {
    label: {
      type: String,
      default: ''
    },
    value: {},
    options: {
      type: Array,
      default () { return [] }
    }
  },
  data () {
    return {
    }
  },
  computed: {
    valueLabel () {
      const { options, value } = this
      if (value == null) return null
      const v = options.find(o => o.value === value || o === value)
      return v ? v.label || v.value || v : null
    }
  }
}
</script>

<style scoped lang="scss">
@import "../assets/style/variables";
.option-select {
  display: flex;
  flex-direction: column;
  .label {
    font-family: $font-mono;
    font-size: 0.7em;
    line-height: 1.2;
  }
  .select {
    text-transform: capitalize;
    position: relative;
    border-bottom: 1px solid $color-white;

    select {
      position: absolute;
      width: 100%;
      height: 100%;
      opacity: 0;
      appearance: none;
      -webkit-appearance: none;
      font-size: 1em;
      // font-family: $font-sans;
    }
  }
}

</style>
