import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import { listenResize } from '../../../utils/event'
import stats from '../../../utils/stat'
import dat from 'dat.gui'

export const useGalaxy = () => {
  const canvas = document.querySelector('#mainCanvas') as HTMLCanvasElement
  const scene = new THREE.Scene()

  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
  }

  const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
  camera.position.set(4, 5, 10)

  const controls = new OrbitControls(camera, canvas)
  controls.enableDamping = true
  controls.zoomSpeed = 0.3
  controls.autoRotate = true
  controls.autoRotateSpeed = 0.3

  /**
   * Galaxy
   */
  const parameters = {
    count: 10000,
    size: 0.02,
    radius: 5, // 半径
    branches: 3, // 分支条数
    spin: 1, // 偏转角度
    randomness: 0.2, // 随机扩散
    randomnessPower: 3, // 幂指数
    insideColor: 0xff6030, // 渐变色
    outsideColor: 0x1b3984, // 渐变色
  }

  let geometry: THREE.BufferGeometry
  let material: THREE.PointsMaterial
  let points: THREE.Points<THREE.BufferGeometry, THREE.PointsMaterial>

  const generatorGalaxy = () => {
    if (points) {
      geometry.dispose()
      material.dispose()
      scene.remove(points)
    }

    geometry = new THREE.BufferGeometry()
    const position = new Float32Array(parameters.count * 3)
    const colors = new Float32Array(parameters.count * 3)

    const colorInside = new THREE.Color(parameters.insideColor)
    const colorOutSide = new THREE.Color(parameters.outsideColor)

    for (let i = 0; i < parameters.count; i++) {
      const i3 = i * 3
      const radius = Math.random() * parameters.radius
      const branchesAngle = ((i % parameters.branches) / parameters.branches) * Math.PI * 2
      const spinAngle = radius * parameters.spin

      const randomX = Math.random() ** parameters.randomnessPower *
      (Math.random() < 0.5 ? 1 : -1) *
      parameters.randomness *
      radius
      const randomY = Math.random() ** parameters.randomnessPower *
      (Math.random() < 0.5 ? 1 : -1) *
      parameters.randomness *
      radius
      const randomZ = Math.random() ** parameters.randomnessPower *
      (Math.random() < 0.5 ? 1 : -1) *
      parameters.randomness *
      radius

      position[i3] = Math.cos(branchesAngle + spinAngle) * radius + randomX
      position[i3 + 1] = randomY
      position[i3 + 2] = Math.sin(branchesAngle + spinAngle) * radius + randomZ

      const mixedColor = colorInside.clone()
      mixedColor.lerp(colorOutSide, radius / parameters.radius)

      colors[i3] = mixedColor.r
      colors[i3 + 1] = mixedColor.g
      colors[i3 + 2] = mixedColor.b
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(position, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    // Material
    material = new THREE.PointsMaterial({
      size: parameters.size,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true, // 开启自定义定点颜色
    })

    points = new THREE.Points(geometry, material)

    scene.add(points)
  }
  generatorGalaxy()

  const renderer = new THREE.WebGLRenderer({ canvas })
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  listenResize(sizes, camera, renderer)

  const tick = () => {
    stats.begin()

    controls.update()
    renderer.render(scene, camera)

    stats.end()

    requestAnimationFrame(tick)
  }

  tick()
  /**
   * Debug
   */
  const gui = new dat.GUI()

  gui.add(controls, 'autoRotate')
  gui.add(controls, 'autoRotateSpeed', 0.1, 10, 0.01)

  gui.add(parameters, 'count', 100, 100000, 100).onFinishChange(generatorGalaxy)
  gui.add(parameters, 'size', 0.001, 0.1, 0.001).onFinishChange(generatorGalaxy)
  gui.add(parameters, 'radius', 0.01, 20, 0.01).onFinishChange(generatorGalaxy)
  gui.add(parameters, 'branches', 2, 20, 1).onFinishChange(generatorGalaxy)
  gui.add(parameters, 'spin', -5, 5, 0.001).onFinishChange(generatorGalaxy)
  gui.add(parameters, 'randomness', 0, 2, 0.001).onFinishChange(generatorGalaxy)
  gui.add(parameters, 'randomnessPower', 1, 10, 0.001).onFinishChange(generatorGalaxy)
  gui.addColor(parameters, 'insideColor').onFinishChange(generatorGalaxy)
  gui.addColor(parameters, 'outsideColor').onFinishChange(generatorGalaxy)
  gui.close()
}

