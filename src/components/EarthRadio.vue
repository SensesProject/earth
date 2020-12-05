<template>
  <div class="senses-radio">
    <span v-if="label" class="tiny">{{ label }}&nbsp;</span>
    <div class="radio" :class="{ isEqualWidth, isHorizontal }">
      <label
        v-for="(o, i) in options"
        :key="i"
        class="highlight"
        :class="[{active: (o.value != null ? o.value : o) === value}, o.color]">
        <input
          type="radio"
          :name="_uid"
          :checked="(o.value != null ? o.value : o) === value"
          :value="o.value != null ? o.value : o"
          @change="$emit('input', o.value != null ? o.value : o)">
          <SensesTooltip :textClass="[]" :tooltipClass="['tiny', 'earth-tooltip']"
            placement="right" :tooltip="o.label || (o.value != null ? o.value : o)" trigger="manual"
            :tooltipOptions="{autoHide: false, open: (o.value != null ? o.value : o) === value || (o.value != null ? o.value : o) === hoverVal}">
            <span @mouseover="hoverVal = o.value != null ? o.value : o"
          @mouseout="hoverVal = null"
          @mouseleave="hoverVal = null">
              <span class="glyph" :class="o.glyph"/>
            <!-- {{ o.label || (o.value != null ? o.value : o) }} -->
            </span>
          </SensesTooltip>
      </label>
    </div>
  </div>
</template>

<script>
import SensesTooltip from 'library/src/components/SensesTooltip.vue'

export default {
  name: 'SensesRadio',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    SensesTooltip
  },
  props: {
    label: {
      type: [String, Number],
      default: '',
      docs: 'Text to show above input'
    },
    value: {
      docs: 'To be used with v-model'
    },
    options: {
      type: Array,
      default () {
        return [{
          value: 1,
          label: 'Option 1'
        }, {
          value: 'Option 2'
        }, {
          value: 3,
          label: 'Option 3',
          color: 'green'
        },
        'Long Option 4']
      },
      docs: 'Array of available options. Options can be either strings or objects, with properties value (required), label (optional), and color (optional)'
    },
    isEqualWidth: {
      type: Boolean,
      default: true,
      docs: 'Defines if items have the same width'
    },
    isHorizontal: {
      type: Boolean,
      default: true,
      docs: 'Defines if orientation is horizontal or vertical'
    }
  },
  data () {
    return {
      hoverVal: null
    }
  },
  computed: {
  }
}
</script>

<style scoped lang="scss">
@import "library/src/style/global.scss";
$btn-size: 28px;
.senses-radio {
  display: inline-block;
  border-radius: $spacing / 2;
  padding-bottom: 2px;
  background: getColor(neon, 20);
  .radio {
    display: grid;
    grid-column-gap: 1px;
    position: relative;
    width: 100%;

    &.isEqualWidth {
      grid-auto-columns: 1fr;
    }

    label {
      width: $btn-size;
      height: $btn-size;
      overflow: hidden;
      border-radius: $btn-size;
    }

    .glyph {
      font-size: 1.8em;
    }

    [class^=glyph-]:before, [class*=" glyph-"]:before {
      margin: 0;
    }

    label {
      color: getColor(neon, 40);
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      justify-content: center;

      &.highlight {
        padding: 0;
        margin: 2px;
      }

      input {
        opacity: 0;
        appearance: none;
        -webkit-appearance: none;
        width: 0;
        height: 0;

        &:checked+div {
          color: $color-white;
          cursor: default;
        }

        +span {
          width: 100%;
          display: inline-block;
          line-height: 1 !important;
          padding: 0 !important;
          text-align: center;
          cursor: pointer;
        }
      }
    }
  }
}

</style>
<style lang="scss">
@import "library/src/style/global.scss";
.tooltip.senses-tooltip.earth-tooltip {
  z-index: 10;
  .tooltip-inner {
    padding: 0 $spacing / 8;
    min-height: $spacing;
    min-width: 0;
    background: none;
    text-transform: capitalize;
    // border-radius: $spacing / 4;
  }
  .tooltip-arrow {
    display: none;
  }
}
</style>
