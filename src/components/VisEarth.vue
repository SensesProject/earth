<template>
  <div class="VisEarth">
    <div ref="VisEarth"/>
    <!-- <canvas ref="canvas"/> -->
  </div>
</template>

<script>
import * as THREE from 'three'
import OrbitControls from 'three-orbitcontrols'
import drawThreeGeo from '../assets/js/threeGeo.js'

import world from '../assets/data/world.json'
import worker from 'workerize-loader!../assets/js/mapRenderer'

export default {
  name: 'VisEarth',
  data () {
    return {
      scene: new THREE.Scene(),
      camera: null,
      renderer: new THREE.WebGLRenderer({ antialias: true }),
      map: new THREE.MeshBasicMaterial(),
      frustumSize: 1000,
      workerInstance: null
    }
  },
  computed: {
    size () {
      const { width, height } = this
      return Math.min(width, height)
    },
    grid () {
      return this.$store.state.map
    },
    width () {
      return this.$store.state.width
    },
    height () {
      return this.$store.state.height
    },
    grids () {
      return this.$store.state.grids
    },
    period1 () {
      return this.$store.state.period1
    }
  },
  watch: {
    grid () {
      this.updateCanvas()
    },
    width () {
      this.resize()
    },
    height () {
      this.resize()
    }
  },
  mounted () {
    const { renderer, $refs, scene, width, height, size, animate, createCanvas, map, frustumSize } = this

    const aspect = width / height
    this.camera = new THREE.OrthographicCamera(frustumSize * aspect / -2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / -2, 1, frustumSize * 2)
    this.camera.position.z = size * 2

    scene.background = new THREE.Color(0x071A29)
    renderer.setSize(width, height)
    $refs.VisEarth.appendChild(renderer.domElement)

    scene.add(new THREE.AmbientLight(0xffffff))

    var geometry = new THREE.SphereBufferGeometry(size / 4, 64, 64)
    var mesh = new THREE.Mesh(geometry, map)
    scene.add(mesh)

    var controls = new OrbitControls(this.camera, renderer.domElement)
    controls.minZoom = 1
    controls.maxZoom = 10
    controls.enablePan = false
    createCanvas()

    const globe = new THREE.Group()
    drawThreeGeo.drawThreeGeo(world, size / 4 + 0.5, 'sphere', {
      color: 0x1B2658
    }, globe)
    globe.setRotationFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2)

    scene.add(globe)

    animate()

    this.$store.dispatch('updateMap')
  },
  methods: {
    animate (t = 0) {
      const { animate, scene, camera, renderer } = this
      camera.updateMatrixWorld()
      requestAnimationFrame(animate)
      renderer.render(scene, camera)
    },
    createVector (x, y, z) {
      const { camera, width, height } = this
      var p = new THREE.Vector3(x, y, z)
      var vector = p.project(camera)

      vector.x = (vector.x + 1) / 2 * width
      vector.y = -(vector.y - 1) / 2 * height

      return vector
    },
    createCanvas () {
      this.canvas = document.createElement('canvas') // this.$refs.canvas
      const resolution = 1
      this.canvas.setAttribute('width', 720 * resolution)
      this.canvas.setAttribute('height', 360 * resolution)
      this.ctx = this.canvas.getContext('2d')
      this.ctx.fillRect(0, 0, 360, 180)
      const texture = new THREE.CanvasTexture(this.canvas)

      texture.magFilter = THREE.NearestFilter
      texture.minFilter = THREE.NearestFilter
      this.map.map = texture
    },
    updateCanvas () {
      const { period1 } = this
      this.ctx.fillStyle = '#00CC84'
      this.ctx.fillRect(0, 0, 720, 360)
      if (this.grids[period1] !== undefined) {
        this.updateTexture(this.grids[period1])
        return
      }
      const canvasData = this.ctx.getImageData(0, 0, 720, 360)

      // if (this.workerInstance != null) this.workerInstance.terminate()
      this.workerInstance = worker()
      this.workerInstance.renderMap({ canvasData, grid: this.grid, period1 }).then(cData => {
        this.$store.dispatch('addGrid', { period: period1, grid: cData })
        this.updateTexture(cData)
      })
    },
    updateTexture (canvasData) {
      this.ctx.putImageData(canvasData, 0, 0)
      this.map.map.needsUpdate = true
    },
    resize () {
      const { width, height, camera, renderer, frustumSize } = this
      const aspect = window.innerWidth / window.innerHeight
      camera.left = -frustumSize * aspect / 2
      camera.right = frustumSize * aspect / 2
      camera.top = frustumSize / 2
      camera.bottom = -frustumSize / 2
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }
  }
}
</script>

<style scoped lang="scss">
.VisEarth {
  position: absolute;
}
</style>
<style lang="scss">
.VisEarth {
    canvas {
    display: block;
  }

  .label {
    position: absolute;
    z-index: 100;
    background: black;
    color: white;
    transform: translate(-50%, -50%);
    padding: 4px 8px;
    font-family: "IBM Plex Sans"
  }
}
</style>
