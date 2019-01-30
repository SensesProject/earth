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
import { scaleLinear } from 'd3-scale' // scaleSequential
// import { interpolateSpectral } from 'd3-scale-chromatic'

import world from '../assets/data/world.json'

export default {
  name: 'VisEarth',
  // props: {
  //   grid: {
  //     type: Object,
  //     default: null
  //   }
  // },
  data () {
    return {
      scene: new THREE.Scene(),
      camera: null,
      renderer: new THREE.WebGLRenderer({ antialias: true }),
      width: window.innerWidth,
      height: window.innerHeight,
      map: new THREE.MeshBasicMaterial()
    }
  },
  computed: {
    size () {
      const { width, height } = this
      return Math.min(width, height)
    },
    grid () {
      return this.$store.state.map
    }
  },
  watch: {
    grid () {
      this.updateCanvas()
    }
  },
  mounted () {
    const { renderer, $refs, scene, width, height, size, animate, createCanvas, map } = this

    this.camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 1, size * 4)
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
    // let quaternion = new THREE.Quaternion()
    // globe.quaternion = quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2)
    globe.setRotationFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2)

    scene.add(globe)

    // console.log(borders)

    animate()
  },
  methods: {
    animate (t = 0) {
      const { animate, scene, camera, renderer } = this

      // camera.position.x = 1000 * Math.sin(THREE.Math.degToRad(0.01 * t))
      // camera.position.y = 1000 * Math.sin(THREE.Math.degToRad(0.01 * t))
      // camera.position.z = 1000 * Math.cos(THREE.Math.degToRad(0.01 * t))
      // camera.lookAt(scene.position)
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
      // this.canvas = document.createElement('canvas')
      this.canvas = document.createElement('canvas') // this.$refs.canvas
      const resolution = 1
      this.canvas.setAttribute('width', 720 * resolution)
      this.canvas.setAttribute('height', 360 * resolution)
      this.ctx = this.canvas.getContext('2d')
      this.ctx.fillRect(0, 0, 360, 180)
      // this.updateCanvas()
      const texture = new THREE.CanvasTexture(this.canvas)

      texture.magFilter = THREE.NearestFilter
      texture.minFilter = THREE.NearestFilter
      // texture.repeat = new THREE.Vector2(0.703125, 1/)
      this.map.map = texture
    },
    updateCanvas () {
      // const domain = [40, -40]
      this.ctx.fillStyle = '#00CC84'
      this.ctx.fillRect(0, 0, 720, 360)
      const colorScale = scaleLinear()
        // .range(['#071A29', '#39C88A', '#071A29'])
        .range(['#00CC84', '#D2FEFF', '#4E40B2'])
        .domain([-40, 0, 40])
      colorScale.clamp(true)

      const canvasData = this.ctx.getImageData(0, 0, 720, 360)

      for (let y = 0; y < 360; y++) {
        for (let x = 0; x < 720; x++) {
          const value = this.grid[y][x]
          // if (value > 8) {
          this.ctx.fillStyle = colorScale(value)
          const rgb = colorScale(value).match(/\((.*)\)/)[1].split(', ')
          const index = (x + (359 - y) * 720) * 4
          for (let i = 0; i < 3; i++) {
            canvasData.data[index + i] = rgb[i]
          }
          // }
        }
      }
      this.ctx.putImageData(canvasData, 0, 0)
      // const texture = new THREE.CanvasTexture(this.canvas)
      //
      // texture.magFilter = THREE.NearestFilter
      // texture.minFilter = THREE.NearestFilter
      // // texture.repeat = new THREE.Vector2(0.703125, 1/)
      // this.map.map = texture
      this.map.map.needsUpdate = true
      // return canvas
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
