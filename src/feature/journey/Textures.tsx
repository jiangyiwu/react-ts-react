import * as THREE from 'three'
import { useEffect } from 'react'
import stats from '../../utils/stat'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import { dbClkfullScreen, listenResize } from '../../utils/event'

const canvas = document.querySelector('#mainCanvas') as HTMLCanvasElement

export const Textures = () => {
  // Scene
  const scene = new THREE.Scene()

  // Object
  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({
      // color: 0x607d8b,
      map: new THREE.TextureLoader().load('./textures/door/color.jpg')
    })
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

  // Renderer
  const renderer = new THREE.WebGLRenderer({ canvas,  antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)

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

  dbClkfullScreen(canvas)
  listenResize({
    width: window.innerWidth,
    height: window.innerHeight
  }, camera, renderer)

  useEffect(() => tick())

  return (<></>)
}
