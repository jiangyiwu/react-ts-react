import * as THREE from 'three'
import { Scene } from 'three'

export const useAxisHelper = (scene: Scene) => {
  const axesHelper = new THREE.AxesHelper(3)

  scene.add(axesHelper)
}
