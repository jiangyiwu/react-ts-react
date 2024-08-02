import * as THREE from 'three'
import { Scene } from 'three'

export const useDirectionalLight = (scene: Scene, color = '0xF59A1E') => {
  // 平行光（太阳光）
  const directionalLight = new THREE.DirectionalLight(color, 40)
  directionalLight.position.set(10, 20, 10)
  scene.add(directionalLight)

  // 点光
  const pointLight = new THREE.PointLight(0xffffff, 100)
  pointLight.position.set(0, 10, 0)
  scene.add(pointLight)

  // 面光
  const rectLight = new THREE.RectAreaLight(0xffffff, 1, 10, 10)
  rectLight.position.set(5, 5, 5)
  rectLight.lookAt(0, 0, 0)
  scene.add(rectLight)
}
