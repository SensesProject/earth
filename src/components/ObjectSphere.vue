<script>
import { Group, SphereBufferGeometry, MeshBasicMaterial, Mesh, DataTexture, RGBFormat } from 'three'
export default {
  name: 'object-sphere',
  inject: ['getContainer'],
  props: {
    size: {
      default: 200,
      type: Number
    },
    imgData: {
      default: null,
      type: Object
    },
    baseColor: {
      type: String,
      default: '#0A0924'
    }
  },
  data () {
    return {
      container: new Group(),
      map: new MeshBasicMaterial(),
      mesh: null
    }
  },
  computed: {
  },
  mounted () {
    this.init()
    this.updateTexture()
  },
  render (h) {
    return null
  },
  methods: {
    init () {
      const { size, getTexture } = this
      const geometry = new SphereBufferGeometry(size, 64, 64)
      const material = new MeshBasicMaterial({ map: getTexture() })
      this.mesh = new Mesh(geometry, material)
      this.container.add(this.mesh)

      this.getContainer(c => {
        c.add(this.container)
      })
    },
    updateTexture () {
      const { getTexture, mesh } = this
      mesh.material.map = getTexture()
      mesh.material.map.needsUpdate = true
      this.$parent.$emit('update')
    },
    getTexture () {
      const { imgData, baseColor } = this
      if (imgData == null) {
        const color = new Uint8Array(3)
        const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(baseColor)

        color[0] = parseInt(match[1], 16)
        color[1] = parseInt(match[2], 16)
        color[2] = parseInt(match[3], 16)
        return new DataTexture(color, 1, 1, RGBFormat)
      }
      return new DataTexture(imgData.data, imgData.width, imgData.height, RGBFormat)
    }
  },
  watch: {
    imgData: {
      handler (img) {
        this.updateTexture()
      }
    }
  }
}
</script>
