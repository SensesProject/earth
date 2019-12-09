<template>
  <div class="VisEarth">
    <div ref="VisEarth" :class="{ pointer: highlightCountry != null }"
      @mousemove="onMouseMove"
      @mousedown="mouseMoved = false"
      @mouseup="onMouseUp"/>
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
    <div v-if="tooltip" class="tooltip" :style="{top: `${tooltip.y}px`, left: `${tooltip.x}px`}">
      {{ countryName }}
    </div>
  </div>
</template>

<script>
import * as THREE from 'three'
import OrbitControls from 'three-orbitcontrols'
import drawThreeGeo from '../assets/js/threeGeo.js'
import chroma from 'chroma-js'
import pointInPolygon from '@turf/boolean-point-in-polygon'
import centroidFromPolygon from '@turf/centroid'

import world from '../assets/data/world.json'
import worker from 'workerize-loader!../assets/js/mapRenderer'
import computeFromStore from '../assets/js/computeFromStore.js'

export default {
  name: 'VisEarth',
  data () {
    return {
      scene: new THREE.Scene(),
      raycaster: new THREE.Raycaster(),
      mouse: new THREE.Vector2(5000, 5000),
      camera: null,
      renderer: new THREE.WebGLRenderer({ antialias: true }),
      map: new THREE.MeshBasicMaterial(),
      frustumSize: 1000,
      workerInstance: null,
      earth: null,
      outline: new THREE.Group(),
      center: new THREE.Group(),
      highlightCountry: null,
      controls: null,
      tooltip: null,
      mouseMoved: true
    }
  },
  computed: {
    ...computeFromStore(['showCountryDetails']),
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
    },
    countryName () {
      const { highlightCountry } = this
      if (highlightCountry == null) return null
      return world.features.find(f => f.properties.ADM0_A3 === highlightCountry).properties.ADMIN
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
    },
    highlightCountry (country) {
      const { size, outline, center } = this
      while (outline.children.length > 0) outline.remove(outline.children[0])
      this.tooltip = null
      if (country == null) return
      const feature = world.features.find(f => f.properties.ADM0_A3 === country)
      drawThreeGeo.drawThreeGeo(feature, size / 4 + 0.5, 'sphere', {
        color: 0x9BE8C7,
        linewidth: 1
      }, outline)
      const centroid = centroidFromPolygon(feature)
      if (country === 'CHL') centroid.geometry.coordinates[0] = -73
      // console.log(centroid)

      // const center = new THREE.Group()
      while (center.children.length > 0) center.remove(center.children[0])
      // center.setRotationFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2)

      drawThreeGeo.drawThreeGeo(centroid, size / 4 + 0.5, 'sphere', {
        color: 0x9BE8C7,
        size: 10
      }, center)
      const vert = center.children[0].geometry.vertices[0]
      vert.applyAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2)
      // var vector = vert.project(camera)
      // // .applyAxisAngle

      // // vector.x = (vector.x + 1) / 2 * width
      // // vector.y = -(vector.y - 1) / 2 * height
      // this.tooltip = {
      //   x: (vector.x + 1) / 2 * width,
      //   y: -(vector.y - 1) / 2 * height
      // }
    }
  },
  mounted () {
    const { renderer, $refs, scene, width, height, size, animate, createCanvas, map, frustumSize, outline, center } = this

    const aspect = width / height
    this.camera = new THREE.OrthographicCamera(frustumSize * aspect / -2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / -2, 1, frustumSize * 2)
    this.camera.position.z = size * 2

    scene.background = new THREE.Color(0x000)
    renderer.setSize(width, height)
    $refs.VisEarth.appendChild(renderer.domElement)

    scene.add(new THREE.AmbientLight(0xffffff))

    const geometry = new THREE.SphereBufferGeometry(size / 4, 64, 64)
    this.earth = new THREE.Mesh(geometry, map)
    scene.add(this.earth)

    this.controls = new OrbitControls(this.camera, renderer.domElement)
    this.controls.minZoom = 1
    this.controls.maxZoom = 10
    this.controls.enablePan = false

    createCanvas()

    const globe = new THREE.Group()
    drawThreeGeo.drawThreeGeo(world, size / 4 + 0.5, 'sphere', {
      color: 0x3A3A4A
    }, globe)
    globe.setRotationFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2)
    scene.add(globe)

    outline.setRotationFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2)
    scene.add(outline)

    animate()

    this.$store.dispatch('updateMap')
    // window.removeEventListener('mousemove', this.onMouseMove)
    // window.addEventListener('mousemove', this.onMouseMove, false)
    // window.removeEventListener('click', this.onClick)
    // window.addEventListener('click', this.onClick, false)
  },
  methods: {
    animate (t = 0) {
      const { animate, scene, camera, renderer, raycaster, mouse, earth, highlight, center, width, height, highlightCountry } = this
      camera.updateMatrixWorld()

      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects([earth])
      if (intersects.length > 0) {
        highlight([intersects[0].uv.x * 360 - 180, intersects[0].uv.y * 180 - 90])
      } else {
        highlight()
      }
      renderer.render(scene, camera)
      requestAnimationFrame(animate)
      this.controls.rotateSpeed = 1 / this.camera.zoom
      if (center.children.length === 1 && highlightCountry) {
        const vert = center.children[0].geometry.vertices[0]
        // vert.applyAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2)
        var vector = new THREE.Vector3(vert.x, vert.y, vert.z).project(camera)
        // .applyAxisAngle

        // vector.x = (vector.x + 1) / 2 * width
        // vector.y = -(vector.y - 1) / 2 * height
        this.tooltip = {
          x: (vector.x + 1) / 2 * width,
          y: -(vector.y - 1) / 2 * height
        }
      }
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

      if (this.workerInstance != null) this.workerInstance.terminate()
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
    },
    onMouseMove (event) {
      this.mouseMoved = true
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
    },
    onMouseUp (event) {
      if (!this.mouseMoved) this.showCountryDetails = this.highlightCountry
    },
    highlight (point) {
      let country = null
      if (point != null) {
        const c = world.features.find(f => pointInPolygon(point, f.geometry))
        if (c != null) {
          country = c.properties.ADM0_A3
        }
      }
      this.highlightCountry = country
    }
  }
}
</script>

<style scoped lang="scss">
@import "../assets/style/variables";
.VisEarth {
  position: absolute;
  // cursor: all-scroll;

  .pointer {
    cursor: pointer;
  }

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
  .tooltip {
    position: absolute;
    background: $color-green;
    transform: translate(-50%, -100%);
    pointer-events: none;
    padding: $spacing / 8 $spacing / 4;
    font-size: 0.8em;
    border-radius: 2px;
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
