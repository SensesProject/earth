<template>
  <a class="option-link" :href="href" :target="target">
    {{ label }}
  </a>
</template>

<script>
export default {
  name: 'OptionLink',
  props: {
    label: {
      type: String,
      default: ''
    },
    href: {
      type: String,
      default: ''
    },
    target: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
    }
  }
}
</script>

<style scoped lang="scss">
@import "../assets/style/variables";
.option-link {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  background: $color-white;
  border-radius: 2px;
  padding: $spacing / 4;
  cursor: pointer;
  transition: background .2s;

  &:hover {
    background: lighten($color-violet, 47);
  }
  &:active {
    background: lighten($color-violet, 42);
  }
}
</style>
