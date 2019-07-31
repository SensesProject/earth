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
// import drawThreeGeo from '../assets/js/threeGeo.js'
import chroma from 'chroma-js'
import { geoPolyhedralWaterman } from 'd3-geo-projection'

// import world from '../assets/data/world.json'
import worker from 'workerize-loader!../assets/js/mapRenderer'

export default {
  name: 'VisEarth',
  data () {
    return {
      scene: new THREE.Scene(),
      camera: null,
      renderer: new THREE.WebGLRenderer({ antialias: true }),
      map: new THREE.MeshBasicMaterial({
        // color: 0xff0000,
        side: THREE.DoubleSide
      }),
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
      const color0 = '#000'
      const color1 = '#B035C9'
      const color2 = '#54E8A9'
      const color3 = '#FFF'

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
    var loader = new THREE.TextureLoader()
    var texture = loader.load('earth.jpg')
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    // texture.repeat.set(0.008, 0.008)

    const { renderer, $refs, scene, width, height, size, animate, map, frustumSize, createCanvas } = this

    const aspect = width / height
    this.camera = new THREE.OrthographicCamera(frustumSize * aspect / -2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / -2, 1, frustumSize * 2)
    this.camera.position.z = size

    scene.background = new THREE.Color(0x000)
    renderer.setSize(width, height)
    $refs.VisEarth.appendChild(renderer.domElement)

    scene.add(new THREE.AmbientLight(0xffffff))

    // var sqLength = 80
    // var shape = new THREE.Shape()
    // shape.moveTo(0, 0)
    // shape.lineTo(0, sqLength)
    // shape.lineTo(sqLength, sqLength)
    // shape.lineTo(sqLength, 0)
    // shape.lineTo(0, 0)

    // this.watermanMesh()

    // var geometry = new THREE.SphereBufferGeometry(size / 4, 64, 64)
    // var geometry = new THREE.ShapeBufferGeometry(this.watermanMesh())

    // const map1 = [
    //   new THREE.Vector2(0, 0), // [x,y] bottom left point
    //   new THREE.Vector2(0.1, 0), // [x,y] bottom right point
    //   new THREE.Vector2(0.1, 0.1), // [x,y] top right point
    //   new THREE.Vector2(0, 0.1) // [x,y] top left point
    // ]

    // const resolution = 45
    // const indices = []
    // for (var i = 0; i < 360 / resolution; i++) {
    //   for (var j = 0; j < 180 / resolution; j++) {
    //     var a = i * (360 / resolution + 1) + (j + 1)
    //     var b = i * (360 / resolution + 1) + j
    //     var c = (i + 1) * (360 / resolution + 1) + j
    //     var d = (i + 1) * (360 / resolution + 1) + (j + 1)
    //     // generate two faces (triangles) per iteration
    //     indices.push(a, b, d) // face one
    //     indices.push(b, c, d) // face two
    //   }
    // }

    const { geometry, faceVertexUvs } = this.watermanGeom()
    // const { vertices, indices, normals } = this.waterman()
    // geometry.setIndex(indices)
    // geometry.addAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
    // geometry.addAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
    geometry.computeFaceNormals()



    // geometry.faceVertexUvs = []
    geometry.faceVertexUvs[0] = faceVertexUvs
    // geometry.faceVertexUvs[0][0] = [map1[3], map1[0], map1[4]]
    // geometry.faceVertexUvs[0][1] = [map1[3], map1[4], map1[2]]
    // geometry.faceVertexUvs[0][2] = [map1[3], map1[0], map1[4]]
    // geometry.faceVertexUvs[0][3] = [map1[3], map1[4], map1[2]]
    // geometry.faceVertexUvs[0][4] = [map1[3], map1[0], map1[4]]
    // geometry.faceVertexUvs[0][5] = [map1[3], map1[4], map1[2]]

    const material1 = new THREE.MeshBasicMaterial({ map: texture })
    var material = new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, map: texture })
    // var material = new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, color: 0xffffff })

    var mesh = new THREE.Mesh(geometry, map)
    scene.add(mesh)

    const geometry1 = new THREE.PlaneGeometry(180, 180, 2, 2)

    // geometry1.faceVertexUvs[0] = []
    // geometry1.faceVertexUvs[0][0] = [map1[3], map1[0], map1[4]] // [top left], [bottom left], [top right]
    // geometry1.faceVertexUvs[0][1] = [map1[3], map1[4], map1[2]] // [top left],

    // const mesh1 = new THREE.Mesh(geometry1, material)
    // mesh1.position.z = 2
    // scene.add(mesh1)
    var controls = new OrbitControls(this.camera, renderer.domElement)
    controls.minZoom = 1
    controls.maxZoom = 10
    // controls.enablePan = false
    createCanvas()

    const globe = new THREE.Group()
    // drawThreeGeo.drawThreeGeo(world, size / 4 + 0.5, 'sphere', {
    //   color: 0x3A3A4A
    // }, globe)
    // globe.setRotationFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2)

    scene.add(globe)

    animate()

    this.$store.dispatch('updateMap')
  },
  methods: {
    watermanGeom () {
      const resolution = 5
      const projection = geoPolyhedralWaterman() // .rotate([20, 0])
        .translate([0, 0])

      const faceVertexUvs = []
      var geometry = new THREE.Geometry()
      let i = 0
      let x1 = 0
      for (let x = 0; x < 360; x += resolution) {
        let y1 = 0
        for (let y = -90; y < 90; y += resolution) {
          const p0 = projection([x + 0.001, y + 0.001])
          const p1 = projection([x + resolution - 0.001, y + 0.001])
          const p3 = projection([x + 0.001, y + resolution - 0.001])
          const p2 = projection([x + resolution - 0.001, y + resolution - 0.001])

          geometry.vertices.push(
            new THREE.Vector3(p0[0], -p0[1], 0),
            new THREE.Vector3(p2[0], -p2[1], 0),
            new THREE.Vector3(p1[0], -p1[1], 0),

            new THREE.Vector3(p0[0], -p0[1], 0),
            new THREE.Vector3(p3[0], -p3[1], 0),
            new THREE.Vector3(p2[0], -p2[1], 0)
          )

          geometry.faces.push(
            new THREE.Face3(i + 0, i + 1, i + 2),
            new THREE.Face3(i + 3, i + 4, i + 5)
          )

          const fx = resolution / 360
          const fy = resolution / 180
          const map = [
            new THREE.Vector2((0.5 - 20 / 360) + fx * x1, fy * y1),
            new THREE.Vector2((0.5 - 20 / 360) + fx * (x1 + 1), fy * y1),
            new THREE.Vector2((0.5 - 20 / 360) + fx * (x1 + 1), fy * (y1 + 1)),
            new THREE.Vector2((0.5 - 20 / 360) + fx * x1, fy * (y1 + 1))
          ]

          faceVertexUvs.push([map[0], map[2], map[1]])
          faceVertexUvs.push([map[0], map[3], map[2]])

          i += 6
          y1++
        }
        x1++
      }

      geometry.computeVertexNormals()
      // geometry.normalize()

      return { geometry, faceVertexUvs }
    },
    waterman () {
      // const { width, height } = this
      const resolution = 45
      const projection = geoPolyhedralWaterman() // .rotate([20, 0])
      // // .fitExtent([[0, 0], [width, height]], ({ type: 'Sphere' }))
        .translate([0, 0])
      // // .rotate([20, 0])
      // // .precision(0.01)
      // var shape = new THREE.Shape()
      // // console.log(projection([-180,-90]))
      const vertices = []
      const normals = []
      const indices = []

      var pA = new THREE.Vector3()
      var pB = new THREE.Vector3()
      var pC = new THREE.Vector3()
      var pD = new THREE.Vector3()
      var cb = new THREE.Vector3()
      var ab = new THREE.Vector3()
      var cd = new THREE.Vector3()
      var ad = new THREE.Vector3()

      let i = 0
      for (let x = 0; x < 360; x += resolution) {
        for (let y = -90; y < 90; y += resolution) {
          const p0 = projection([x + 0.001, y + 0.001])
          const p1 = projection([x + resolution - 0.001, y + 0.001])
          const p3 = projection([x + 0.001, y + resolution - 0.001])
          const p2 = projection([x + resolution - 0.001, y + resolution - 0.001])

          vertices.push(p0[0])
          vertices.push(p0[1])
          vertices.push(0)

          vertices.push(p2[0])
          vertices.push(p2[1])
          vertices.push(0)

          vertices.push(p1[0])
          vertices.push(p1[1])
          vertices.push(0)

          vertices.push(p0[0])
          vertices.push(p0[1])
          vertices.push(0)

          vertices.push(p3[0])
          vertices.push(p3[1])
          vertices.push(0)

          vertices.push(p2[0])
          vertices.push(p2[1])
          vertices.push(0)

          indices.push(i, i + 1, i + 2, i + 3, i + 4, i + 5)
          i += 6

          pA.set(p0[0], p0[1], 0)
          pB.set(p1[0], p1[1], 0)
          pC.set(p2[0], p2[1], 0)
          pD.set(p3[0], p3[1], 0)
          cb.subVectors(pC, pB)
          ab.subVectors(pA, pB)
          cd.subVectors(pC, pD)
          ad.subVectors(pA, pD)
          cb.cross(ab)
          cb.normalize()
          cd.cross(ad)
          cd.normalize()
          normals.push(cb.x, cb.y, cb.z)
          normals.push(cb.x, cb.y, cb.z)
          normals.push(cb.x, cb.y, cb.z)
          normals.push(cd.x, cd.y, cd.z)
          normals.push(cd.x, cd.y, cd.z)
          normals.push(cd.x, cd.y, cd.z)
        }
      }

      return {
        vertices,
        normals,
        indices
      }
    },
    vertices () {
      var vertices = new Float32Array([
        0, 0, 0,
        100, 100, 0,
        0, 100, 0,

        0, 0, 0,
        100, 0, 0,
        100, 100, 0,

        200, 0, 0,
        300, 100, 0,
        200, 100, 0,

        200, 0, 0,
        300, 0, 0,
        300, 100, 0,

        0, 200, 0,
        100, 300, 0,
        0, 300, 0,

        0, 200, 0,
        100, 200, 0,
        100, 300, 0,

        200, 200, 0,
        300, 300, 0,
        200, 300, 0,

        200, 200, 0,
        300, 200, 0,
        300, 300, 0
      ])

      return vertices
    },
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
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping

      texture.magFilter = THREE.NearestFilter
      texture.minFilter = THREE.NearestFilter
      this.map.map = texture
    },
    updateCanvas () {
      const { temperature, range1, domain1, colors, compareValue, grid, gridComparison } = this
      this.ctx.fillStyle = '#000'
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
