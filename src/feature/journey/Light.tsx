import * as THREE from 'three'
import { listenResize } from '../../utils/event'
import { useEffect } from 'react'
import { OrbitControls, RectAreaLightHelper } from 'three/examples/jsm/Addons.js'
import * as dat from 'dat.gui'
import stats from '../../utils/stat'

export const LightView = () => {
  const scene = new THREE.Scene()
  const canvas = document.querySelector('#mainCanvas') as HTMLCanvasElement

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    100
  )
  camera.position.set(0, 2, 30)

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
  })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  listenResize({
    width: window.innerWidth,
    height: window.innerHeight
  }, camera, renderer)

  const orbitControls = new OrbitControls(camera, canvas)
  orbitControls.enableDamping = true

  const material = new THREE.MeshStandardMaterial({
    metalness: 0,
    roughness: 0.4
  })

  const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material)
  sphere.position.set(-1.5, 0, 0)

  const cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), material)

  const torus = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.3, 32, 64), material)
  torus.position.set(1.5, 0, 0)

  const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material)
  plane.rotation.set(-Math.PI / 2, 0, 0)
  plane.position.set(0, -0.65, 0)

  scene.add(sphere, cube, torus, plane)

  // ambientLight
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)

  // directionalLight
  const directionalLight = new THREE.DirectionalLight(0xffffaa, 0.5)
  directionalLight.position.set(1, 0.25, 0)

  const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 1)
  scene.add(directionalLight, directionalLightHelper)

  // hemisphereLight
  const hemisphereLight = new THREE.HemisphereLight(0xb71c1c, 0x004d40, 0.6)

  const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 5)
  scene.add(hemisphereLight, hemisphereLightHelper)

  // pointLight
  const pointLight = new THREE.PointLight(0xff9000, 0.5)
  pointLight.position.set(1, 1, 1)

  const pointLightHelper = new THREE.PointLightHelper(pointLight, 1)
  scene.add(pointLight, pointLightHelper)

  // rectAreaLight
  const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 10, 1, 1)
  rectAreaLight.position.set(-1.5, 0, 1.5)
  rectAreaLight.lookAt(0, 0, 0)

  const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight)
  scene.add(rectAreaLight, rectAreaLightHelper)

  // spotLigth
  const spotLight = new THREE.SpotLight(0x78ff00, 0.5, 10, Math.PI * 0.1, 0.25, 1)
  spotLight.position.set(0, 2, 3)
  const spotLightHelper = new THREE.SpotLightHelper(spotLight)
  scene.add(spotLight, spotLightHelper)

  // clock
  const clock = new THREE.Clock()

  const tick = () => {
    stats.begin()

    const elapsedTime = clock.getElapsedTime()

    // Update Objects
    sphere.rotation.y = 0.1 * elapsedTime
    cube.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    cube.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime

    orbitControls.update()
    renderer.render(scene, camera)

    stats.end()
    requestAnimationFrame(tick)
  }
  useEffect(() => tick())

  // debug
  const gui = new dat.GUI({
    width: 400
  })

  const meshFolder = gui.addFolder('Mesh')
  meshFolder.add(material, 'roughness').min(0).max(1).step(0.01)
  meshFolder.add(material, 'metalness').min(0).max(1).step(0.01)
  meshFolder.add(material, 'wireframe')

  const ambientLightFolder = gui.addFolder('AmbientLight')
  ambientLightFolder.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
  ambientLightFolder.add(ambientLight, 'visible').listen()

  const directionalLightFolder = gui.addFolder('directionalLight')
  directionalLightFolder.add(directionalLight, 'intensity').min(0).max(1).step(0.001).name('directionIntensity')
  directionalLightFolder.add(directionalLight, 'visible').onChange((visible) => {
    directionalLightHelper.visible = visible
  }).listen()
  directionalLightFolder.add(directionalLightHelper, 'visible').name('helper visible').listen()

  const hemisphereLightFolder = gui.addFolder('hemisphereLightFolder')
  hemisphereLightFolder.add(hemisphereLight, 'visible').onChange(visible => hemisphereLightHelper.visible = visible).listen()
  hemisphereLightFolder.add(hemisphereLight, 'intensity').min(0).max(1).step(0.01)
  hemisphereLightFolder.add(hemisphereLightHelper, 'visible').name('helper visible').listen()

  const pointLightFolder = gui.addFolder('pointerLightFolder')
  pointLightFolder.add(pointLight, 'visible').onChange(visible => pointLightHelper.visible = visible).listen()
  pointLightFolder.add(pointLight, 'intensity').min(0).max(1).step(0.01)
  pointLightFolder.add(pointLightHelper, 'visible').name('helper visible').listen()
  pointLightFolder.add(pointLight, 'distance', 0, 10, 0.00001)
  pointLightFolder.add(pointLight, 'decay', 0, 10, 0.00001)

  const rectAreaLightFolder = gui.addFolder('rectAreaLightFolder')
  rectAreaLightFolder.add(rectAreaLight, 'visible').onChange(visible => rectAreaLightHelper.visible = visible).listen()
  rectAreaLightFolder.add(rectAreaLightHelper, 'visible').name('helper visible').listen()
  rectAreaLightFolder.add(rectAreaLight, 'intensity', 0, 80, 0.0001)
  rectAreaLightFolder.add(rectAreaLight, 'width', 0, 3, 0.0001)
  rectAreaLightFolder.add(rectAreaLight, 'height', 0, 3, 0.0001)

  const spotLightFolder = gui.addFolder('spotLightFolder')
  spotLightFolder.add(spotLight, 'visible').onChange(visible => spotLightHelper.visible = visible).listen()
  spotLightFolder.add(spotLightHelper, 'visible').name('helper visible').listen()
  spotLightFolder.add(spotLight, 'intensity', 0, 5, 0.001)
  spotLightFolder.add(spotLight, 'distance', 0, 20, 0.001)
  spotLightFolder.add(spotLight, 'angle', 0, Math.PI / 2, 0.001)
  spotLightFolder.add(spotLight, 'penumbra', 0, 1, 0.001)
  spotLightFolder.add(spotLight, 'decay', 0, 10, 0.001)

  const guiObj = {
    turnOffAllLight() {
      ambientLight.visible = false
      directionalLight.visible = false
      directionalLightHelper.visible = false
      hemisphereLight.visible = false
      hemisphereLightHelper.visible = false
      pointLight.visible = false
      pointLightHelper.visible = false
      rectAreaLight.visible = false
      rectAreaLightHelper.visible = false
      spotLight.visible = false
      spotLightHelper.visible = false
    },
    turnOnAllLight() {
      ambientLight.visible = true
      directionalLight.visible = true
      directionalLightHelper.visible = true
      hemisphereLight.visible = true
      hemisphereLightHelper.visible = true
      pointLight.visible = true
      pointLightHelper.visible = true
      rectAreaLight.visible = true
      rectAreaLightHelper.visible = true
      spotLight.visible = true
      spotLightHelper.visible = true
    }
  }

  gui.add(guiObj, 'turnOffAllLight')
  gui.add(guiObj, 'turnOnAllLight')

  return (<></>)
}
