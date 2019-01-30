export default function (props) {
  const obj = {}
  props.forEach(prop => {
    obj[prop] = {
      get () {
        return this.$store.state[prop]
      },
      set (value) {
        this.$store.dispatch('update', { value, prop })
      }
    }
  })
  return obj
}
