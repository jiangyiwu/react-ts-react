import * as THREE from 'three'
import { Scene, Camera, Renderer } from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { useControls } from './useControls'
import { useDirectionalLight } from '../light/useDirectionalLight'
import { useAmbientLight } from '../light/useAmbientLight'


export interface Props {
  scene: Scene
  camera: Camera
  renderer: Renderer
}

export const useLoadRobot = ({
  scene,
  camera,
  renderer
}: Props) => {

  const gltfLoader = new GLTFLoader()

  useDirectionalLight(scene)
  useAmbientLight(scene)

  let mixer:any
  const clock = new THREE.Clock()

  gltfLoader.load('./robot2.glb', (gltf) => {
    console.info(gltf, '===gltf==')
    const model = gltf.scene
    model.position.set(0, 0, 0)
    model.scale.set(0.1, 0.1, 0.1)

    scene.add(model)

    mixer = new THREE.AnimationMixer(model)
    gltf.animations.forEach(v => mixer.clipAction(v).play())

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
