import * as THREE from 'three'
import { useEffect } from 'react'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import stats from '../../utils/stat'

const canvas = document.querySelector('#mainCanvas') as HTMLCanvasElement

export const FullScreen = () => {
  // Scene
  const scene = new THREE.Scene()

  // Object
  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0x607d8b })
  )

  scene.add(cube)

  // Camera
  const aspectRatio = window.innerWidth / window.innerHeight
  const camera = new THREE.PerspectiveCamera(
    75,
    aspectRatio,
    1,
    100
  )
  camera.position.set(0, 0, 3)
  camera.lookAt(cube.position)

  // Renderer
  const renderer = new THREE.WebGLRenderer({ canvas,  antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  // 抗锯齿
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  // OrbitControls
  const orbitControls = new OrbitControls(camera, canvas)
  orbitControls.enableDamping = true

  // Animations
  const tick = () => {
    stats.begin()

    orbitControls.update()
    // Render
    renderer.render(scene, camera)
    stats.end()
    requestAnimationFrame(tick)
  }

  window.addEventListener('resize', () => {
    // update camera
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    // update renderer
    renderer.setSize(window.innerWidth, window.innerHeight)
    // 抗锯齿
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  })

  window.addEventListener('dblclick', () => {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      canvas.requestFullscreen()
    }
  })

  useEffect(() => tick())

  return (<></>)
}
