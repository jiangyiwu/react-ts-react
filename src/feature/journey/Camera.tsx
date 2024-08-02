import * as THREE from 'three'
import { useEffect } from 'react'
import stats from '../../utils/stat'
import { captureMouse } from '../../utils/mouseEvent'

const canvas = document.querySelector('#mainCanvas') as HTMLCanvasElement

export const Camera = () => {
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
  const camera = new THREE.OrthographicCamera(-1 * aspectRatio, 1 * aspectRatio, 1, -1, 1, 100)
  camera.position.set(0, 0, 3)
  camera.lookAt(cube.position)

  // Renderer
  const renderer = new THREE.WebGLRenderer({ canvas,  antialias: true })
  renderer.setSize(canvas.clientWidth, canvas.clientHeight)

  // mouse position
  const mouse = captureMouse(canvas)

  // clock
  const clock = new THREE.Clock()

  // Animations
  const tick = () => {
    stats.begin()

    // const delta = clock.getDelta()
    // cube.rotation.y += 1 * delta

    camera.position.x = (mouse.x / canvas.clientWidth - 0.5) * 4
    camera.position.y = (mouse.y / canvas.clientHeight - 0.5) * 4
    camera.lookAt(cube.position)
    // Render
    renderer.render(scene, camera)
    stats.end()
    requestAnimationFrame(tick)
  }

  useEffect(() => tick())

  return (<></>)
}
