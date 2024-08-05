import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import stats from '../../../utils/stat'
import { listenResize } from '../../../utils/event'

export const useRaycaster = () => {
  const canvas = document.querySelector('#mainCanvas') as HTMLCanvasElement
  const scene = new THREE.Scene()

  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
  }

  const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
  camera.position.set(0, 1, 30)

  const renderer = new THREE.WebGLRenderer({ canvas })
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  const controls = new OrbitControls(camera, canvas)
  controls.enableDamping = true

  listenResize(sizes, camera, renderer)

  const object1 = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0xb71c1c })
  )
  object1.position.setX(-4)
  const object2 = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0xb71c1c })
  )
  const object3 = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0xb71c1c })
  )
  object3.position.setX(4)

  /**
   * Raycaster
   */
  const raycaster = new THREE.Raycaster()
  const rayOrgin = new THREE.Vector3(-6, 0, 0)
  const rayDirections = new THREE.Vector3(10, 0, 0)
  rayDirections.normalize()
  raycaster.set(rayOrgin, rayDirections)

  // arrow helper
  const arrowHelper = new THREE.ArrowHelper(
    raycaster.ray.direction,
    raycaster.ray.origin,
    15,
    0xff0000,
    1,
    0.5,
  )
  scene.add(arrowHelper)


  scene.add(object1, object2, object3)

  const clock = new THREE.Clock()

  const tick = () => {
    stats.begin()

    const elapsedTime = clock.getElapsedTime()
    object1.position.setY(Math.sin(elapsedTime * 2) * 2)
    object2.position.setY(Math.sin(elapsedTime * 1.5) * 2)
    object3.position.setY(Math.sin(elapsedTime * 3) * 2)

    const objectsToTest = [object1, object2, object3]
    const intersects = raycaster.intersectObjects(objectsToTest)

    objectsToTest.forEach((item) => {
      item.material.color.set(0xff0000) // 恢复颜色
    })

    intersects.forEach((item) => {
      // @ts-ignore
      item.object.material.color.set(0xf9a825) // 将与射线相交的物体颜色改变
    })

    controls.update()
    renderer.render(scene, camera)

    stats.end()
    requestAnimationFrame(tick)
  }

  tick()
}
