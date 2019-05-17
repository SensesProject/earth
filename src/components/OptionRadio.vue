<template>
  <div class="option-radio">
    <span class="label">{{ label }}&nbsp;</span>
    <div class="radio">
      <label v-for="o in options" :key="o.value || o">
        <input
          type="radio"
          :name="_uid"
          :checked="(o.value || o) === value"
          :value="o.value || o"
          @change="$emit('input', $event.target.value)">
          <span>{{ o.label || o.value || o }}</span>
      </label>
      <!-- <select :value="value" @change="$emit('input', $event.target.value)">
        <option
          v-for="o in options"
          :disabled="o.disabled"
          :key="o.value || o"
          :value="o.value || o">{{ o.label || o.value || o }}</option>
      </select>
      <div class="selected">{{ valueLabel }}</div> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'OptionRadio',
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
      const v = options.find(o => o.value === value || o === value)
      return v ? v.label || v.value || v : null
    }
  }
}
</script>

<style scoped lang="scss">
@import "../assets/style/variables";
.option-radio {
  display: flex;
  flex-direction: column;
  .label {
    font-family: $font-mono;
    font-size: 0.7em;
    line-height: 1.2;
  }
  .radio {
    text-transform: capitalize;
    position: relative;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    // border-bottom: 1px solid $color-white;

    label {
      margin: $spacing / 4 0 0;
      input {
        opacity: 0;
        appearance: none;
        -webkit-appearance: none;

        &:checked+span {
          background: $color-white;
          cursor: default;

          &:hover {
            background: $color-white;
          }
        }

        +span {
          border: 1px solid $color-white;
          border-radius:  2px;
          padding: $spacing / 16 $spacing * 0.25;
          text-align: center;
          cursor: pointer;

          &:hover {
            border-color: lighten($color-violet, 47);
            // background: darken($color-green, 4);
            background: transparentize($color-violet, 0.95);
          }
        }
      }
    }
    //   position: absolute;
    //   width: 100%;
    //   height: 100%;
    //   opacity: 0;
    //   appearance: none;
    //   -webkit-appearance: none;
    //   font-size: 1em;
    //   // font-family: $font-sans;
    // }
  }
}

</style>
