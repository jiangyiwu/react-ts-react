import * as THREE from 'three'
import { Scene, Camera, Renderer } from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { useControls } from './useControls'
import { RectAreaLightHelper } from 'three/examples/jsm/Addons.js'


export interface Props {
  scene: Scene
  camera: Camera
  renderer: Renderer
}

export const useLoadDoughnut = ({
  scene,
  camera,
  renderer
}: Props) => {

  const setLight = () => {
    const directionalLight = new THREE.DirectionalLight(0xffffff, 20)
    directionalLight.position.set(0, 0, 10)
    // scene.add(directionalLight)

    const pointLight = new THREE.PointLight(0xffffff, 500)
    pointLight.position.set(0, 5, 10)
    scene.add(pointLight)


    const width = 1
    const height = 1
    const intensity = 10
    const rectLight = new THREE.RectAreaLight(0xffffff, intensity,  width, height)
    rectLight.position.set(0, 1, -2)
    rectLight.lookAt(0, 0, 0)
    scene.add(rectLight)

    const rectLightHelper = new RectAreaLightHelper(rectLight)
    scene.add(rectLightHelper)
  }

  const gltfLoader = new GLTFLoader()

  let mixer:any
  const clock = new THREE.Clock()

  gltfLoader.load('./甜甜圈3.glb', (gltf) => {
    console.info(gltf, '===gltf==')
    const model = gltf.scene
    model.position.set(0, 0, 0)
    model.scale.set(3, 3, 3)

    scene.add(model)
    mixer = new THREE.AnimationMixer(model)
    gltf.animations.forEach(v => mixer.clipAction(v).play())

    setLight()

    animate()
  }, undefined, () => {
  })

  const { controls } = useControls({ camera, renderer })

  const animate = () => {
    renderer.render(scene, camera)
    controls.update()

    const delta = clock.getDelta()
    mixer.update(delta)

    requestAnimationFrame(animate)
  }
}
