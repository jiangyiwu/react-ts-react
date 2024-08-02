import * as THREE from 'three'

export const useCreateScene = () => {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x000000)
  // scene.fog = new THREE.Fog(0xffffff, 0, 50)

  const renderer = new THREE.WebGLRenderer({
    antialias: true
  })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)

  document.body.appendChild(renderer.domElement)

  const camera = new THREE.PerspectiveCamera(
    120,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )

  camera.position.set(1, 1, 0)
  camera.lookAt(0, 0, 0)

  window.onresize = function() {

    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)

  }

  return {
    scene,
    camera,
    renderer
  }
}
