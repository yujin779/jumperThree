import {
  Scene,
  Color,
  Mesh,
  MeshNormalMaterial,
  BoxBufferGeometry,
  PerspectiveCamera,
  WebGLRenderer
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'stats.js'

class Example {
  constructor() {
    this.init = this.init.bind(this)
    this.animate = this.animate.bind(this)
    this.onWindowResize = this.onWindowResize.bind(this)

    this.init()
  }

  init() {
    this.aspect = window.innerWidth / window.innerHeight
    this.camera = new PerspectiveCamera(50, this.aspect, 1, 1000)
    this.camera.position.z = 700

    this.controls = new OrbitControls(this.camera)

    this.geometry = new BoxBufferGeometry(200, 200, 200)
    this.material = new MeshNormalMaterial()
    this.mesh = new Mesh(this.geometry, this.material)

    this.scene = new Scene()
    this.scene.background = new Color('#191919')
    this.scene.add(this.mesh)

    this.renderer = new WebGLRenderer({
      powerPreference: 'high-performance',
      antialias: true
    })

    document.body.appendChild(this.renderer.domElement)
    window.addEventListener('resize', this.onWindowResize)

    this.stats = new Stats()
    document.body.appendChild(this.stats.dom)

    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.render(this.scene, this.camera)
    this.renderer.setAnimationLoop(this.animate)
  }

  animate() {
    this.stats.begin()

    this.mesh.rotation.x += 0.005
    this.mesh.rotation.y += 0.001

    this.controls.update()
    this.renderer.render(this.scene, this.camera)

    this.stats.end()
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()

    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }
}

new Example()
