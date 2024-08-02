import * as THREE from 'three'
import { useEffect } from 'react'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import stats from '../../utils/stat'
import { dbClkfullScreen, listenResize } from '../../utils/event'

const canvas = document.querySelector('#mainCanvas') as HTMLCanvasElement

export const Geometry = () => {
  // Scene
  const scene = new THREE.Scene()

  // Object
  const geometry = new THREE.BufferGeometry()
  // create random vertices
  const getRandomTriangleVertices = (n = 1) => {
    const totalNumber = n * 3 * 3
    return Array.from({ length: totalNumber }, () => Math.random() - 0.5)
  }
  const vertices = new Float32Array([...getRandomTriangleVertices()])
  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
  const material = new THREE.MeshBasicMaterial({ color: 0x607d8b, wireframe: true })
  const triangle = new THREE.Mesh(geometry, material)
  scene.add(triangle)

  // Camera
  const aspectRatio = window.innerWidth / window.innerHeight
  const camera = new THREE.PerspectiveCamera(
    75,
    aspectRatio,
    1,
    100
  )
  camera.position.set(0, 0, 3)
  // camera.lookAt(geometry.position)

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

  dbClkfullScreen(canvas)
  listenResize({
    width: window.innerWidth,
    height: window.innerHeight
  }, camera, renderer)

  useEffect(() => tick())

  return (<></>)
}
