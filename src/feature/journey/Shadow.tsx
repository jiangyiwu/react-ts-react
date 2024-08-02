import * as THREE from 'three'
import * as dat from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import { useEffect } from 'react'
import stats from '../../utils/stat'

export const Shadow = () => {
  const scene = new THREE.Scene()
  const canvas = document.querySelector('#mainCanvas') as HTMLCanvasElement

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  )
  camera.position.set(1, 1, 10)

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true // 开启投影

  const orbitControls = new OrbitControls(camera, canvas)
  orbitControls.enableDamping = true

  const material = new THREE.MeshStandardMaterial({
    roughness: 0.4,
    metalness: 0
  })

  const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material)
  plane.rotation.set(-Math.PI / 2, 0, 0)
  plane.position.set(0, -0.65, 0)
  plane.receiveShadow = true // 接收投影

  const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material)
  scene.add(plane, sphere)
  sphere.castShadow = true // 几何体开启发射投影
  sphere.receiveShadow = true // 几何体接受投影

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xffffaa, 0.5)
  directionalLight.position.set(1, 0.25, 0)
  directionalLight.castShadow = true // 光照增加发射投影
  directionalLight.shadow.mapSize.set(1024, 1024)
  directionalLight.shadow.camera.near = 1
  scene.add(directionalLight)

  const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight)
  scene.add(directionalLightHelper)

  const tick = () => {
    stats.begin()
    orbitControls.update()
    renderer.render(scene, camera)

    requestAnimationFrame(tick)

    stats.end()
  }

  const gui = new dat.GUI()

  const meshFolder = gui.addFolder('Mesh')
  meshFolder.add(material, 'metalness', 0, 1, 0.0001)
  meshFolder.add(material, 'roughness', 0, 1, 0.0001)
  meshFolder.add(material, 'wireframe')

  const ambientLightFolder = gui.addFolder('AmbientLight')
  ambientLightFolder.add(ambientLight, 'visible').listen()
  ambientLightFolder.add(ambientLight, 'intensity', 0, 1, 0.001)

  const directionalLightFolder = gui.addFolder('DirectionalLight')
  directionalLightFolder
    .add(directionalLight, 'visible')
    .onChange((visible: boolean) => {
      directionalLightHelper.visible = visible
    })
    .listen()
  directionalLightFolder.add(directionalLightHelper, 'visible').name('helper visible').listen()
  directionalLightFolder.add(directionalLight, 'intensity', 0, 1, 0.001)


  const guiObj = {
    turnOffAllLights() {
      ambientLight.visible = false
      directionalLight.visible = false
      directionalLightHelper.visible = false
    },
    turnOnAllLights() {
      ambientLight.visible = true
      directionalLight.visible = true
      directionalLightHelper.visible = true
    },
  }
  gui.add(guiObj, 'turnOffAllLights')
  gui.add(guiObj, 'turnOnAllLights')

  useEffect(() => tick())
  return (<></>)
}
