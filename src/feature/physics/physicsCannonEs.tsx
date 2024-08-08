import * as THREE from 'three'
import * as dat from 'lil-gui'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import { listenResize } from '../../utils/event'
import stats from '../../utils/stat'
import { useEffect } from 'react'
import * as CANNON from 'cannon-es'
import CannonDebugger from 'cannon-es-debugger'

export const PhysicsCannonEs = () => {
  const canvas = document.querySelector('#mainCanvas') as HTMLCanvasElement

  const scene = new THREE.Scene()

  // GUI
  const gui = new dat.GUI()
  const guiObj = {
    CannonDebugger: false,
    createSphere() {},
    createBox() {},
    reset() {},
  }

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

  /**
   * renderer
   */
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true

  listenResize(sizes, camera, renderer)

  const hitSound = new Audio('./sounds/hit.mp3')
  const playHitSound = (collision: { contact: CANNON.ContactEquation }) => {
    const impactStrength = collision.contact.getImpactVelocityAlongNormal()
    if (impactStrength > 1.5) {
      hitSound.volume = Math.random()
      hitSound.currentTime = 0
      hitSound.play()
    }
  }

  /**
   * Physics
   */
  const world = new CANNON.World()
  world.gravity.set(0, -9.82, 0)
  /**
   * 检测物体之间碰撞，每次每个物体互相检查是一个非常消耗性能的场景。这就需要宽相（Broadphase）了，它通过负责的算法在检测碰撞之前，将物体分类，如果2个物体相距太远，根本不会发生碰撞，它们可能就不在同一个分类里，计算机也不需要进行碰撞计算检测。

    NaiveBroadphase Cannon 默认的算法。检测物体碰撞时，一个基础的方式是检测每个物体是否与其他每个物体发生了碰撞
    GridBroadphase 网格检测。轴对齐的均匀网格 Broadphase。将空间划分为网格，网格内进行检测。
    SAPBroadphase(Sweep-and-Prune) 扫描-剪枝算法，性能最好。

   */
  world.broadphase = new CANNON.SAPBroadphase(world)
  /**
   * 当物体的速度非常非常满的时候，肉眼已经无法察觉其在运动，那么就可以让这个物体 sleep，不参与碰撞检测，直到它被外力击中或其他物体碰撞到它。
   */
  // world.allowSleep = true

  const defaultMaterial = new CANNON.Material('default')
  const defaultContractMaterial = new CANNON.ContactMaterial(defaultMaterial, defaultMaterial, {
    friction: 0.1, // 摩擦力
    restitution: 0.7, // 弹力 1表示回弹到原位置（没有阻力）
  })
  world.addContactMaterial(defaultContractMaterial)


  const floorShape = new CANNON.Plane()
  const floorBody = new CANNON.Body({
    mass: 0,
    shape: floorShape,
    material: defaultMaterial
  })
  floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
  world.addBody(floorBody)

  // cannonDebugger
  const cannonMeshes: THREE.Mesh[] = []
  // eslint-disable-next-line new-cap
  const cannonDebugger = CannonDebugger(scene, world, {
    onInit(body, mesh) {
      mesh.visible = false
      cannonMeshes.push(mesh)
    }
  })
  gui.add(guiObj, 'CannonDebugger').name('CannonDebugger mesh visible').onChange((value: boolean) => {
    if (value) {
      cannonMeshes.forEach(item => {
        item.visible = true
      })
    } else {
      cannonMeshes.forEach(item => {
        item.visible = false
      })
    }
  })

  // Sphere
  const objectsToUpdate: Array<{
    mesh: THREE.Mesh
    body: CANNON.Body
  }> = []
  const sphereGeometry = new THREE.SphereGeometry(1, 32, 32)
  const createSphere = (radius: number, position: THREE.Vector3) => {
    const mesh = new THREE.Mesh(sphereGeometry, material)
    mesh.castShadow = true
    mesh.scale.set(radius, radius, radius)
    mesh.position.copy(position)
    scene.add(mesh)

    const shape = new CANNON.Sphere(radius)
    const body = new CANNON.Body({
      mass: 1,
      shape,
      material: defaultMaterial
    })
    // @ts-ignore
    body.position.copy(position)
    world.addBody(body)
    body.addEventListener('collide', playHitSound)

    objectsToUpdate.push({
      mesh,
      body
    })
  }
  guiObj.createSphere = () => {
    createSphere(
      Math.random(),
      new THREE.Vector3((Math.random() - 0.5) * 8, 5, (Math.random() - 0.5) * 8)
    )
  }

  // Box
  const boxGeometry = new THREE.BoxGeometry()
  const createBox = (width: number, height: number, depth: number, position: THREE.Vector3) => {
    // Three.js mesh
    const mesh = new THREE.Mesh(boxGeometry, material)
    mesh.castShadow = true
    mesh.scale.set(width, height, depth)
    mesh.position.copy(position)
    scene.add(mesh)

    // Cannon body
    const shape = new CANNON.Box(new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5))
    const body = new CANNON.Body({
      mass: 1,
      shape,
      material: defaultMaterial
    })
    // @ts-ignore
    body.position.copy(position)
    world.addBody(body)
    body.addEventListener('collide', playHitSound)
    objectsToUpdate.push({
      mesh,
      body
    })
  }
  guiObj.createBox = () => {
    createBox(
      Math.random(),
      Math.random(),
      Math.random(),
      new THREE.Vector3((Math.random() - 0.5) * 8, 5, (Math.random() - 0.5) * 8)
    )
  }

  guiObj.reset = () => {
    objectsToUpdate.forEach((object) => {
      object.body.removeEventListener('collide', playHitSound)
      world.removeBody(object.body)
      scene.remove(object.mesh)
    })
    objectsToUpdate.splice(0, objectsToUpdate.length)
  }

  const clock = new THREE.Clock()
  let oldElapsedTime = 0

  const tick = () => {
    stats.begin()

    controls.update()

    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - oldElapsedTime
    oldElapsedTime = deltaTime

    world.step(1 / 60, deltaTime, 3)
    cannonDebugger.update() // Update the CannonDebugger meshes

    objectsToUpdate.forEach((object) => {
      object.mesh.position.copy(object.body.position)
      object.mesh.quaternion.copy(object.body.quaternion)
    })

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
  gui.add(controls, 'autoRotate')
  gui.add(controls, 'autoRotateSpeed', 0.1, 10, 0.01)
  gui.add(material, 'wireframe')

  gui.add(guiObj, 'createSphere')
  gui.add(guiObj, 'createBox')
  gui.add(guiObj, 'reset')


  return (
    <></>
  )
}
