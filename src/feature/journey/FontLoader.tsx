import { useEffect } from 'react'
import * as THREE from 'three'
import { OrbitControls, TextGeometry } from 'three/examples/jsm/Addons.js'
import { FontLoader } from 'three/examples/jsm/Addons.js'
import * as dat from 'dat.gui'
import stats from '../../utils/stat'
import { listenResize, setFullScreen } from '../../utils/event'

const defaultSceneColor = 0x110c20
const defaultTextInfo = 'Hello world !'
const debugObj = {
  sceneColor: defaultSceneColor,
  text: defaultTextInfo,
  fullScreen: false,
  removeMesh() {},
  addMesh() {},
  showTextBounding: false
}

const canvas = document.querySelector('#mainCanvas') as HTMLCanvasElement
export const FontLoaderView = () => {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(defaultSceneColor)

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  )
  camera.position.set(1, 2, 20)


  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  const fontLoader = new FontLoader()
  // load font
  fontLoader.load('./textures/fonts/Fira Code Medium_Regular.json', (font) => {
    const textureLoader = new THREE.TextureLoader()
    const matcapTexture = textureLoader.load('./textures/matcaps/9.png')

    const material = new THREE.MeshMatcapMaterial({
      matcap: matcapTexture,
    })

    let text: THREE.Mesh<TextGeometry, THREE.MeshMatcapMaterial>

    const createText = (textInfo = 'hello world!') => {
      const textGeometry = new TextGeometry(textInfo, {
        font,
        size: 0.5,
        height: 0.2,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5
      })
      textGeometry.center()

      text = new THREE.Mesh(textGeometry, material)

      scene.add(text)
    }
    createText()

    const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)
    const boxGeometry = new THREE.BoxGeometry(0.6, 0.6, 0.6)
    const meshArr: THREE.Mesh<THREE.BoxGeometry | THREE.TorusGeometry, THREE.MeshMatcapMaterial>[] = []
    const createMesh = (n = 10) => {
      let mesh
      Array.from({ length: n }).forEach(() => {
        if (Math.floor(Math.random() * 10) % 2 === 0) {
          mesh = new THREE.Mesh(donutGeometry, material)
        } else {
          mesh = new THREE.Mesh(boxGeometry, material)
        }
        mesh.position.set(
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
        )
        mesh.setRotationFromEuler(
          new THREE.Euler(
            Math.PI * Math.random(),
            Math.PI * Math.random(),
            Math.PI * Math.random()
          ))

        const randomScale = Math.random() * 0.5 + 0.5
        mesh.scale.set(randomScale, randomScale, randomScale)
        meshArr.push(mesh)
      })
      scene.add(...meshArr)
    }
    createMesh(1)

    debugObj.addMesh = (n = 1) => {
      createMesh(n)
    }
    debugObj.removeMesh = () => {
      scene.remove(meshArr[meshArr.length - 1])
      meshArr.splice(-1)
    }

    gui.add(debugObj, 'addMesh')
    gui.add(debugObj, 'removeMesh')
    gui.addColor(debugObj, 'sceneColor').onChange((e: number) => {
      scene.background = new THREE.Color(e)
    })
    gui.add(debugObj, 'fullScreen').onChange(() => {
      setFullScreen(document.body)
    })
    gui.add(debugObj, 'text').onChange((e: string) => {
      scene.remove(text)
      createText(e)
    })
  })

  const controls = new OrbitControls(camera, canvas)
  controls.enableDamping = true
  controls.autoRotate = true
  controls.autoRotateSpeed = 0.4

  const gui = new dat.GUI({
    width: 400
  })

  gui.add(controls, 'autoRotate')
  gui.add(controls, 'autoRotateSpeed').min(0.1).max(20).step(0.01)

  listenResize({
    width: window.innerWidth,
    height: window.innerHeight
  }, camera, renderer)

  const tick = () => {
    stats.begin()

    controls.update()
    // Render
    renderer.render(scene, camera)
    stats.end()
    requestAnimationFrame(tick)
  }

  useEffect(() => tick())
  return (<></>)
}
