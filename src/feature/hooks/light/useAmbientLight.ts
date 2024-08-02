import * as THREE from 'three'
import { Scene } from 'three'

export const useAmbientLight = (scene: Scene) => {
  const ambientLight = new THREE.AmbientLight(0xF59A1E)

  scene.add(ambientLight)
}
