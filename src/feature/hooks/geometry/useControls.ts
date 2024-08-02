import { OrbitControls } from 'three/examples/jsm/Addons.js'
import { Camera, Renderer } from 'three'

type Props = {
  camera: Camera
  renderer: Renderer
}

export const useControls = ({ camera, renderer }: Props) => {
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.target.set(0, 0.5, 0)
  controls.update()
  // 添加阻尼效果（惯性）
  controls.enableDamping = true

  return {
    controls
  }
}
