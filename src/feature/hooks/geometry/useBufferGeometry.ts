import * as THREE from 'three'
import { Props } from './useLoadRobot'

export const useBufferGeometry = ({ scene }: Props) => {

  const geometry = new THREE.BufferGeometry()
  const vertices = new Float32Array([
    -1, -1, 2,
    1, -1, 2,
    1, 1, 2,

    1, 1, 2,
    -1, 1, 2,
    -1, -1, 2
  ])

  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))

  const material = new THREE.MeshBasicMaterial({ color: 0x333333, side: THREE.DoubleSide })

  const mesh = new THREE.Mesh(geometry, material)

  scene.add(mesh)
}
