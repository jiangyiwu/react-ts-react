import * as THREE from 'three'
import * as dat from 'lil-gui'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import { listenResize } from '../../utils/event'
import stats from '../../utils/stat'
import { useEffect } from 'react'
import * as CANNON from 'cannon-es'

export const Physics = () => {
  const canvas = document.querySelector('#mainCanvas') as HTMLCanvasElement

  const scene = new THREE.Scene()

  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
  }

  const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
  camera.position.set(4, 4, 20)

  const controls = new OrbitControls(camera, canvas)
  controls.enableDamping = true
  controls.zoomSpeed = 0.03

  /**
   * Objects
   */
  const material = new THREE.MeshStandardMaterial()

  // sphere
  const sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 16), material)
  sphere.position.setY(1)
  sphere.castShadow = true
  scene.add(sphere)

  // plane
  const plane = new THREE.Mesh(new THREE.PlaneGeometry(15, 15), material)
  plane.rotateX(-Math.PI / 2)
  plane.receiveShadow = true
  scene.add(plane)

  /**
   * Light
   */
  const directionLight = new THREE.DirectionalLight()
  directionLight.castShadow = true
  directionLight.position.set(5, 5, 6)
  const ambientLight = new THREE.AmbientLight(new THREE.Color(0xffffff), 0.3)
  scene.add(directionLight, ambientLight)

  const directionLightHelper = new THREE.DirectionalLightHelper(directionLight, 2)
  directionLightHelper.visible = true
  scene.add(directionLightHelper)

  /**
   * renderer
   */
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true

  listenResize(sizes, camera, renderer)

  /**
   * Physics
   */
  const world = new CANNON.World()
  world.gravity.set(0, -9.82, 0)

  const defaultMaterial = new CANNON.Material('default')
  const defaultContractMaterial = new CANNON.ContactMaterial(defaultMaterial, defaultMaterial, {
    friction: 0.1, // 摩擦力
    restitution: 0.7, // 弹力 1表示回弹到原位置（没有阻力）
  })
  world.addContactMaterial(defaultContractMaterial)

  const sphereShape = new CANNON.Sphere(1)
  const sphereBody = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 3, 0),
    shape: sphereShape,
    material: defaultMaterial
  })
  world.addBody(sphereBody)

  const floorShape = new CANNON.Plane()
  const floorBody = new CANNON.Body({
    mass: 0,
    shape: floorShape,
    material: defaultMaterial
  })
  floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
  world.addBody(floorBody)

  const clock = new THREE.Clock()
  let oldElapsedTime = 0

  const tick = () => {
    stats.begin()

    controls.update()

    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - oldElapsedTime
    oldElapsedTime = deltaTime

    world.step(1 / 60, deltaTime, 3)
    sphere.position.copy(sphereBody.position)

    renderer.render(scene, camera)
    stats.end()

    requestAnimationFrame(tick)
  }

  useEffect(() => {
    tick()

    return () => {
      tick()
    }
  })



  /**
 * Debug
 */
  const gui = new dat.GUI()
  gui.add(controls, 'autoRotate')
  gui.add(controls, 'autoRotateSpeed', 0.1, 10, 0.01)
  gui.add(material, 'wireframe')
  gui.add(directionLightHelper, 'visible').name('directionLightHelper visible')
  const guiObj = {
    drop() {
      sphereBody.position = new CANNON.Vec3(0, 4, 0)
    },
  }
  gui.add(guiObj, 'drop')


  return (
    <></>
  )
}
