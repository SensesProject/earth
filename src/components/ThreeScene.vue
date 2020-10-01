<template>
  <div class="three-scene" ref="three" @mousemove="onMouseMove">
    <slot/>
  </div>
</template>

<script>
import OrbitControls from 'three-orbitcontrols'
import { Scene, WebGLRenderer, OrthographicCamera, Color, Group, DirectionalLight, Vector3 } from 'three'
export default {
  name: 'three-scene',
  props: {
    width: {
      default: 768,
      type: Number
    },
    height: {
      default: 768,
      type: Number
    },
    step: {
      default: 0,
      type: Number
    },
    x: {
      default: 0,
      type: Number
    },
    y: {
      default: 0,
      type: Number
    },
    z: {
      default: 0,
      type: Number
    },
    preventInteraction: {
      type: Boolean,
      default: false
    },
    background: {
      type: String,
      default: '#020212'
    },
    zoom: {
      type: Number,
      default: null
    },
    size: {
      type: Number,
      default: 1000
    },
    yaw: {
      type: Number,
      default: 1
    },
    pitch: {
      type: Number,
      default: -0.25
    }
  },
  data () {
    return {
      scene: null,
      renderer: null,
      camera: null,
      container: null,
      controls: null,
      mouse: { x: 5000, y: 5000 },
      redraw: false
    }
  },
  provide () {
    return {
      getContainer: this.getContainer,
      $mouse: () => this.mouse,
      $camera: () => this.camera,
      $renderer: () => this.renderer
    }
  },
  mounted () {
    this.$on('update', () => { this.redraw = true })
    const { size, width, height, preventInteraction, background, zoom } = this
    const aspect = width / height
    this.camera = new OrthographicCamera(size * aspect / -2, size * aspect / 2, size / 2, size / -2, 1, size * 2)
    this.scene = new Scene()
    this.renderer = new WebGLRenderer({ antialias: true })
    this.container = new Group()

    const { renderer, scene, $refs, animate, container, positionCamera } = this
    positionCamera()
    renderer.setSize(width, height)
    renderer.setPixelRatio(window.devicePixelRatio)
    const dirLight = new DirectionalLight(0xffffff, 1)
    dirLight.position.set(1, 5, 4)
    scene.add(dirLight)
    scene.add(container)

    scene.background = new Color(background)
    $refs.three.appendChild(renderer.domElement)
    if (!preventInteraction) {
      this.controls = new OrbitControls(this.camera, renderer.domElement)
      this.controls.minZoom = 1
      this.controls.maxZoom = 10
      this.controls.enablePan = false
    }

    if (zoom != null) {
      this.camera.zoom = zoom
    }

    animate()
  },
  methods: {
    positionCamera () {
      const { yaw, pitch, size, camera, zoom } = this
      if (camera == null) return
      if (zoom != null) camera.zoom = zoom
      camera.position.z = Math.sin(yaw * Math.PI * 2) * Math.cos(pitch * -1 * Math.PI / 2) * size
      camera.position.y = Math.sin(pitch * -1 * Math.PI / 2) * size
      camera.position.x = Math.cos(yaw * Math.PI * 2) * Math.cos(pitch * -1 * Math.PI / 2) * size
      camera.lookAt(new Vector3(0, 0, 0))
      // requestAnimationFrame(this.animate)
    },
    animate (t = 0) {
      const { animate, scene, camera, renderer, controls, preventInteraction } = this
      requestAnimationFrame(animate)
      // camera.updateMatrixWorld()
      if (!preventInteraction || this.redraw) {
        camera.updateProjectionMatrix()
        if (!preventInteraction) {
          controls.rotateSpeed = 1 / this.camera.zoom
        } else {
          this.positionCamera()
        }
        renderer.render(scene, camera)
        this.redraw = false
      }
    },
    resize () {
      const { width, height, camera, renderer, size } = this

      if (width > height) {
        const aspect = width / height
        camera.left = -size * aspect / 2
        camera.right = size * aspect / 2
        camera.top = size / 2
        camera.bottom = -size / 2
      } else {
        const aspect = height / width
        camera.left = -size / 2
        camera.right = size / 2
        camera.top = size * aspect / 2
        camera.bottom = -size * aspect / 2
      }

      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    },
    onMouseMove (event) {
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
    },
    getProp (prop) {
      return (found) => {
        const check = () => {
          if (this[prop]) {
            found(this[prop])
          } else {
            setTimeout(check, 50)
          }
        }
        check()
      }
    },
    getScene (found) {
      const check = () => {
        if (this.scene) {
          found(this.scene)
        } else {
          setTimeout(check, 50)
        }
      }
      check()
    },
    getContainer (found) {
      const check = () => {
        if (this.container) {
          found(this.container)
        } else {
          setTimeout(check, 50)
        }
      }
      check()
    }
  },
  watch: {
    width () {
      this.resize()
      this.redraw = true
    },
    height () {
      this.resize()
      this.redraw = true
    },
    yaw () {
      this.redraw = true
    },
    pitch () {
      this.redraw = true
    },
    zoom () {
      this.redraw = true
    }
  }
}
</script>

<style scoped lang="scss">
@import "library/src/style/global.scss";
.three-scene {
  width: 100vw;
  height: 100%;
}
</style>
<style lang="scss">
.three-scene {
  canvas {
    display: block
  }
}
</style>
