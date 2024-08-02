import * as THREE from 'three'
import * as dat from 'lil-gui'
import stats from '../../../utils/stat'
import { listenResize } from '../../../utils/event'
import { OrbitControls } from 'three/examples/jsm/Addons.js'

export const useParticlesAnimation = () => {
  const canvas = document.querySelector('#mainCanvas') as HTMLCanvasElement
  const scene = new THREE.Scene()

  const textureLoader = new THREE.TextureLoader()
  const particlesTexture = textureLoader.load('https://gw.alicdn.com/imgextra/i3/O1CN01DO6Ed61QtcMKsVnK2_!!6000000002034-2-tps-56-56.png')

  /**
   * Particles
   */
  const particlesGeometry = new THREE.BufferGeometry()
  const count = 50000
  const positions = new Float32Array(count * 3) //  每个点由3个坐标组成
  const colors = new Float32Array(count * 3) // 每个颜色由三个rgb组成
  Array.from({ length: count * 3 }).forEach((_, i) => {
    positions[i] = (Math.random() - 0.5) * 10
    colors[i] = Math.random()
  })
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const pointMaterial = new THREE.PointsMaterial({
    size: 0.1,
    sizeAttenuation: true
  })

  pointMaterial.alphaMap = particlesTexture
  pointMaterial.transparent = true
  pointMaterial.depthWrite = false
  pointMaterial.blending = THREE.AdditiveBlending
  pointMaterial.vertexColors = true

  const particles = new THREE.Points(particlesGeometry, pointMaterial)
  scene.add(particles)

  /**
   * Lights
   */
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
  scene.add(ambientLight)

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  )
  camera.position.set(2, 1.8, 20)

  const controls = new OrbitControls(camera, canvas)
  controls.enableDamping = true
  controls.zoomSpeed = 0.3

  const renderer = new THREE.WebGLRenderer({ canvas })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  listenResize({ width: window.innerWidth, height: window.innerHeight }, camera, renderer)

  const clock = new THREE.Clock()
  const tick = () => {
    stats.begin()

    const elapsedTime = clock.getElapsedTime()
    for (let i = 0; i < count; i += 1) {
      const x = particlesGeometry.attributes.position.getX(i)
      particlesGeometry.attributes.position.setY(i, Math.sin(elapsedTime + x))
    }
    particlesGeometry.attributes.position.needsUpdate = true

    controls.update()

    renderer.render(scene, camera)

    stats.end()
    requestAnimationFrame(tick)
  }

  tick()

  /**
   * Debug
   */
  const gui = new dat.GUI()
  gui.add(controls, 'autoRotate')
  gui.add(controls, 'autoRotateSpeed', 0.1, 10, 0.01)

  gui.close()
}
