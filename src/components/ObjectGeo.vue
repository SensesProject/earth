<script>
import { Group, Raycaster, SphereBufferGeometry, Mesh, Vector3 } from 'three'
import drawThreeGeo from '../assets/js/threeGeo.js'
import world from '../assets/data/world.json'
import pointInPolygon from '@turf/boolean-point-in-polygon'
import centroidFromPolygon from '@turf/centroid'
export default {
  name: 'object-geo',
  inject: ['getContainer', '$camera', '$mouse', '$renderer'],
  props: {
    size: {
      default: 200,
      type: Number
    },
    interactive: {
      default: false,
      type: Boolean
    },
    imgData: {
      default: null,
      type: Object
    },
    borderColor: {
      type: String,
      default: '#292D50'
    },
    highlightColor: {
      type: String,
      default: '#5263ff'
    }
  },
  data () {
    return {
      container: new Group(),
      countries: new Group(),
      raycaster: new Raycaster(),
      mesh: null,
      country: null,
      startSize: null
    }
  },
  computed: {
    camera () {
      return this.$camera()
    },
    mouse () {
      return this.$mouse()
    },
    renderer () {
      return this.$renderer()
    }
  },
  mounted () {
    this.startSize = this.size
    this.init()
  },
  render (h) {
    return null
  },
  methods: {
    init () {
      const { size, container, borderColor, highlight, countries } = this
      drawThreeGeo.drawThreeGeo(world, size + 0.5, 'sphere', {
        color: borderColor
      }, container)

      requestAnimationFrame(highlight)

      const geometry = new SphereBufferGeometry(size, 64, 64)
      const mesh = new Mesh(geometry)
      mesh.material.transparent = true
      mesh.material.opacity = 0
      this.mesh = mesh

      container.setRotationFromAxisAngle({ x: 1, y: 0, z: 0 }, -Math.PI / 2)
      container.add(countries)

      this.getContainer(c => {
        c.add(container)
        c.add(mesh)
      })
    },
    highlight () {
      const { mouse, camera, raycaster, mesh, highlight, interactive } = this
      if (!interactive) return
      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects([mesh])
      if (intersects.length > 0) {
        const point = [intersects[0].uv.x * 360 - 180, intersects[0].uv.y * 180 - 90]
        const c = world.features.find(f => pointInPolygon(point, f.geometry))
        if (c != null) {
          this.country = c.properties.ADM0_A3
        } else {
          this.country = null
        }
      } else {
        this.country = null
      }
      requestAnimationFrame(highlight)
    },
    highlightCountry () {
      const { country, startSize, countries, toScreenPosition, highlightColor } = this
      while (countries.children.length > 0) countries.remove(countries.children[0])
      if (country == null) {
        this.$emit('highlight')
        return
      }
      const feature = world.features.find(f => f.properties.ADM0_A3 === country)
      drawThreeGeo.drawThreeGeo(feature, startSize + 0.5, 'sphere', {
        color: highlightColor,
        linewidth: 1
      }, countries)
      const centroid = centroidFromPolygon(feature)
      if (country === 'USA') {
        centroid.geometry.coordinates[0] = -100
        centroid.geometry.coordinates[1] = 40
      }
      if (country === 'FRA') {
        centroid.geometry.coordinates[0] = 2
        centroid.geometry.coordinates[1] = 47
      }
      const screenPosition = toScreenPosition(centroid.geometry.coordinates)
      this.$emit('highlight', { ...screenPosition, code: feature.properties.ADM0_A3, name: feature.properties.ADMIN })
    },
    toScreenPosition (centroid) {
      const { renderer, camera, startSize } = this

      const phi = (90 - centroid[1]) * (Math.PI / 180)
      const theta = (180 + centroid[0]) * (Math.PI / 180)

      const x = -((startSize / 2) * Math.sin(phi) * Math.cos(theta))
      const z = ((startSize / 2) * Math.sin(phi) * Math.sin(theta))
      const y = ((startSize / 2) * Math.cos(phi))

      var vector = new Vector3(x, y, z)
      var width = renderer.context.canvas.width
      var height = renderer.context.canvas.height

      vector.project(camera)

      vector.x = (vector.x * (width / 2)) + (width / 4)
      vector.y = -(vector.y * (height / 2)) + (height / 4)

      return {
        x: vector.x,
        y: vector.y
      }
    }
  },
  watch: {
    country () {
      this.highlightCountry()
    },
    interactive (interactive) {
      if (interactive) requestAnimationFrame(this.highlight)
    }
  }
}
</script>
