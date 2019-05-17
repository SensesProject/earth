<template>
  <div class="VisEarth">
    <div ref="VisEarth"/>
    <!-- <canvas ref="canvas"/> -->
    <svg class="key" :width="keyWidth" :height="64">
      <g transform="translate(0 18)">
        <g v-if="compareValue == null">
          <rect v-for="(c1, x) in colors" :key="`c${x}`" width="15" height="24" :x="keyWidth - (x + 1) * 15" :y="0" :fill="`rgb(${c1[x][0]},${c1[x][1]},${c1[x][2]})`"/>
        </g>
        <g v-else>
          <rect v-for="(c1, x) in colors" :key="`cg${x}`" width="15" height="8" :x="keyWidth - (x + 1) * 15" :y="16" :fill="`rgb(${colors[0][x][0]},${colors[0][x][1]},${colors[0][x][2]})`"/>
          <rect v-for="(c1, x) in colors" :key="`cw${x}`" width="15" height="8" :x="keyWidth - (x + 1) * 15" :y="8" :fill="`rgb(${c1[x][0]},${c1[x][1]},${c1[x][2]})`"/>
          <rect v-for="(c1, x) in colors" :key="`cv${x}`" width="15" height="8" :x="keyWidth - (x + 1) * 15" :y="0" :fill="`rgb(${c1[0][0]},${c1[0][1]},${c1[0][2]})`"/>
        </g>
      </g>
      <text y="10">Frequency</text>
      <g class="ticks">
        <rect y="18" width="1" height="32"/>
        <text y="64">Annual</text>
        <rect y="18" :x="keyWidth * 0.5" width="1" height="32"/>
        <text y="64" :x="keyWidth * 0.5" text-anchor="middle">Biennial</text>
        <rect y="18" :x="keyWidth * 0.75" width="1" height="32"/>
        <text y="64" :x="keyWidth * 0.75" text-anchor="middle">Quadrennial</text>
        <rect y="18" :x="keyWidth - 1" width="1" height="32"/>
        <text y="64" :x="keyWidth - 1" text-anchor="middle">Never</text>
      </g>
    </svg>
  </div>
</template>

<script>
import * as THREE from 'three'
import OrbitControls from 'three-orbitcontrols'
import drawThreeGeo from '../assets/js/threeGeo.js'
import chroma from 'chroma-js'

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
    keyWidth () {
      return 15 * this.colors.length
    },
    size () {
      const { width, height } = this
      return Math.min(width, height)
    },
    grid () {
      return this.$store.state.map
    },
    gridComparison () {
      return this.$store.state.mapComparison
    },
    compareValue   () {
      return this.$store.state.compareValue
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
    },
    range1 () {
      return this.$store.state.range1
    },
    domain1 () {
      return this.$store.state.domain1
    },
    temperature () {
      return this.$store.state.temperature
    },
    colors () {
      const color0 = '#070019'
      const color1 = '#B035C9'
      const color2 = '#54E8A9'
      const color3 = '#FEF4DD'

      const cs1 = chroma.scale([color0, color1]).mode('lab').colors(26)
      const cs2 = chroma.scale([color2, color3]).mode('lab').colors(26)

      return cs1.map((c1, i) => {
        return chroma.scale([c1, cs2[i]]).mode('lab').colors(28, 'rgb')
        // return cs2.map((c2, i) => {
        //   return chroma.average([c1, c2], 'lch')
        // })
      })
    }
  },
  watch: {
    grid () {
      this.updateCanvas()
    },
    gridComparison () {
      this.updateCanvas()
    },
    domain1 () {
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

    scene.background = new THREE.Color(0x000)
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
      color: 0x3A3A4A
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
      const { temperature, range1, domain1, colors, compareValue, grid, gridComparison } = this
      this.ctx.fillStyle = '#070019'
      this.ctx.fillRect(0, 0, 720, 360)
      // if (this.grids[temperature] !== undefined) {
      //   this.updateTexture(this.grids[temperature])
      //   return
      // }
      const canvasData = this.ctx.getImageData(0, 0, 720, 360)

      // if (this.workerInstance != null) this.workerInstance.terminate()
      this.workerInstance = worker()
      this.workerInstance.renderMap({ canvasData, grid, gridComparison, comparing: compareValue != null, temperature, range1, domain1, colors }).then(cData => {
        this.$store.dispatch('addGrid', { temperature, grid: cData })
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
@import "../assets/style/variables";
.VisEarth {
  position: absolute;
  // cursor: all-scroll;

  .key {
    position: absolute;
    // z-index: 100;
    bottom: $spacing;
    left: $spacing;
    pointer-events: none;
    overflow: visible;
    // background: $color-blue;

    text {
      fill: $color-white;
      font-family: $font-mono;
      font-size: 0.7em;
    }

    .ticks {
      fill: $color-white;
    }
  }
}
</style>
<style lang="scss">
.VisEarth {
    canvas {
    display: block;
  }

  // .label {
  //   position: absolute;
  //   z-index: 100;
  //   background: black;
  //   color: white;
  //   transform: translate(-50%, -50%);
  //   padding: 4px 8px;
  //   font-family: "IBM Plex Sans"
  // }
}
</style>
