export default function (vars) {
  const obj = {}
  vars.forEach(v => {
    obj[v] = {
      get () {
        return this.$store.state[v]
      },
      set (value) {
        this.$store.dispatch(`update${v.charAt(0).toUpperCase() + v.slice(1)}`, value)
      }
    }
  })
  return obj
}
