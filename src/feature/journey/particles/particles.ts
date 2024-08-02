import * as THREE from 'three'
import * as dat from 'lil-gui'
import stats from '../../../utils/stat'
import { listenResize } from '../../../utils/event'
import { OrbitControls } from 'three/examples/jsm/Addons.js'


export const useParticles = () => {
  const canvas = document.querySelector('#mainCanvas') as HTMLCanvasElement
  const scene = new THREE.Scene()

  const sphereGeometry = new THREE.SphereGeometry(1, 32, 32)

  const pointMaterial = new THREE.PointsMaterial({
    size: 0.02,
    sizeAttenuation: true
  })

  const particles = new THREE.Points(sphereGeometry, pointMaterial)
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

  listenResize({width: window.innerWidth, height: window.innerHeight}, camera, renderer)

  const tick = () => {
    stats.begin()
    controls.update()
    pointMaterial.needsUpdate = true
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
  gui.add(pointMaterial, 'size', 0.01, 0.1, 0.001)
  gui.add(pointMaterial, 'sizeAttenuation')
}
