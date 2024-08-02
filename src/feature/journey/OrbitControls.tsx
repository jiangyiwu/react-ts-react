import * as THREE from 'three'
import { useEffect } from 'react'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import stats from '../../utils/stat'

const canvas = document.querySelector('#mainCanvas') as HTMLCanvasElement

export const OrbitCtrl = () => {
  // Scene
  const scene = new THREE.Scene()

  // Object
  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0x607d8b })
  )

  scene.add(cube)

  // Camera
  const aspectRatio = canvas.clientWidth / canvas.clientHeight
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
  renderer.setSize(canvas.clientWidth, canvas.clientHeight)

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

  useEffect(() => tick())

  return (<></>)
}
