import * as THREE from 'three'
import * as dat from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import { useEffect } from 'react'
import stats from '../../utils/stat'
import { useAxisHelper } from '../hooks/helperTools/useAxisHelper'
import { listenResize } from '../../utils/event'

export const Shadow = () => {
  const scene = new THREE.Scene()
  const canvas = document.querySelector('#mainCanvas') as HTMLCanvasElement
  useAxisHelper(scene)

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  )
  camera.position.set(-5, 15, 0)

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true // 开启投影

  const orbitControls = new OrbitControls(camera, canvas)
  orbitControls.enableDamping = true
  orbitControls.autoRotate = true
  orbitControls.autoRotateSpeed = 0.8

  listenResize({
    width: window.innerWidth,
    height: window.innerHeight
  }, camera, renderer)

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
  directionalLight.shadow.camera.far = 5
  directionalLight.shadow.camera.top = 4
  directionalLight.shadow.camera.bottom = -4
  directionalLight.shadow.camera.left = -4
  directionalLight.shadow.camera.right = 4
  directionalLight.shadow.radius = 10
  scene.add(directionalLight)

  const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight)
  scene.add(directionalLightHelper)

  const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
  scene.add(directionalLightCameraHelper)

  const spotLight = new THREE.SpotLight(0x78ff00, 0.5, 3, Math.PI * 0.1, 0.25, 0.1)
  spotLight.distance = 5
  spotLight.position.set(0, 2, 2)
  spotLight.castShadow = true
  spotLight.shadow.mapSize.set(1024, 1024)
  spotLight.shadow.camera.fov = 30
  spotLight.shadow.camera.near = 1
  spotLight.shadow.camera.far = 6
  spotLight.shadow.radius = 10
  scene.add(spotLight)

  const spotLightHelper = new THREE.SpotLightHelper(spotLight)
  scene.add(spotLightHelper)

  const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera)
  scene.add(spotLightCameraHelper)

  const pointLight = new THREE.PointLight(0xff9000, 0.5, 10, 2)
  pointLight.position.set(1, -1, 0)
  pointLight.castShadow = true
  pointLight.shadow.radius = 10
  pointLight.shadow.mapSize.set(1024, 1024)
  pointLight.shadow.camera.near = 0.5
  pointLight.shadow.camera.far = 4
  scene.add(pointLight)

  const pointLightHelper = new THREE.PointLightHelper(pointLight)
  scene.add(pointLightHelper)

  const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera)
  scene.add(pointLightCameraHelper)

  const tick = () => {
    stats.begin()
    orbitControls.update()
    renderer.render(scene, camera)

    requestAnimationFrame(tick)

    stats.end()
  }

  const gui = new dat.GUI()

  const autoRotateFolder = gui.addFolder('autoRotate')
  autoRotateFolder.add(orbitControls, 'autoRotate')
  autoRotateFolder.add(orbitControls, 'autoRotateSpeed')

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
      directionalLightCameraHelper.visible = visible
    })
    .listen()
  directionalLightFolder.add(directionalLightHelper, 'visible').name('helper visible').listen()
  directionalLightFolder.add(directionalLightCameraHelper, 'visible').name('camera helper visible').listen()
  directionalLightFolder.add(directionalLight, 'intensity', 0, 1, 0.001)

  const spotLightFolder = gui.addFolder('spotLightFolder')
  spotLightFolder.add(spotLight, 'visible').onChange(visible => {
    spotLightHelper.visible = visible
    spotLightCameraHelper.visible = visible
  }).listen()
  spotLightFolder.add(spotLightHelper, 'visible').name('hepler visible').listen()
  spotLightFolder.add(spotLightCameraHelper, 'visible').name('camera helper visible').listen()
  spotLightFolder.add(spotLight, 'intensity').min(0).max(1).step(0.001)
  spotLightFolder.add(spotLight, 'distance', 0, 20, 0.001)
  spotLightFolder.add(spotLight, 'angle', 0, Math.PI / 2, 0.001)
  spotLightFolder.add(spotLight, 'penumbra', 0, 1, 0.001)
  spotLightFolder.add(spotLight, 'decay', 0, 10, 0.001)

  const pointLightFolder = gui.addFolder('pointLightFolder')
  pointLightFolder.add(pointLight, 'visible').onChange((visible: boolean) => {
    pointLightHelper.visible = visible
    pointLightCameraHelper.visible = visible
  }).listen()
  pointLightFolder.add(pointLightHelper, 'visible').name('helper visible').listen()
  pointLightFolder.add(pointLightCameraHelper, 'visible').name('camera helper visible').listen()
  pointLightFolder.add(pointLight, 'distance', 0, 100, 0.00001)
  pointLightFolder.add(pointLight, 'decay', 0, 10, 0.00001)

  const guiObj = {
    turnOffAllLights() {
      ambientLight.visible = false
      directionalLight.visible = false
      directionalLightHelper.visible = false
      directionalLightCameraHelper.visible = false
      pointLight.visible = false
      pointLightHelper.visible = false
      pointLightCameraHelper.visible = false
      spotLight.visible = false
      spotLightHelper.visible = false
      spotLightCameraHelper.visible = false
    },
    turnOnAllLights() {
      ambientLight.visible = true
      directionalLight.visible = true
      directionalLightHelper.visible = true
      directionalLightCameraHelper.visible = true
      pointLight.visible = true
      pointLightHelper.visible = true
      pointLightCameraHelper.visible = true
      spotLight.visible = true
      spotLightHelper.visible = true
      spotLightCameraHelper.visible = true
    },
    hideAllHelpers() {
      directionalLightHelper.visible = false
      directionalLightCameraHelper.visible = false
      pointLightHelper.visible = false
      pointLightCameraHelper.visible = false
      spotLightHelper.visible = false
      spotLightCameraHelper.visible = false
    },
    showAllHelpers() {
      directionalLightHelper.visible = true
      directionalLightCameraHelper.visible = true
      pointLightHelper.visible = true
      pointLightCameraHelper.visible = true
      spotLightHelper.visible = true
      spotLightCameraHelper.visible = true
    },
  }

  guiObj.hideAllHelpers()

  gui.add(guiObj, 'turnOffAllLights')
  gui.add(guiObj, 'turnOnAllLights')
  gui.add(guiObj, 'hideAllHelpers')
  gui.add(guiObj, 'showAllHelpers')

  gui.close()

  useEffect(() => tick())
  return (<></>)
}
