import * as THREE from 'three'
import { useEffect } from 'react'
import gsap from 'gsap'
import stats from '../../utils/stat'

const canvas = document.querySelector('#mainCanvas') as HTMLCanvasElement

export const Animation = () => {
  // Scene
  const scene = new THREE.Scene()

  // Object
  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0x607d8b })
  )

  scene.add(cube)

  // Camera
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  camera.position.set(0, 1, 3)
  camera.lookAt(cube.position)

  // Renderer
  const renderer = new THREE.WebGLRenderer({ canvas,  antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)

  gsap.fromTo(
    cube.position,
    {
      x: -1.5,
    },
    {
      x: 1.5,
      duration: 1,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut'
    }
  )

  // Animations
  const tick = () => {
    stats.begin()

    // Render
    renderer.render(scene, camera)
    stats.end()
    requestAnimationFrame(tick)
  }

  useEffect(() => tick())

  return (<></>)
}
