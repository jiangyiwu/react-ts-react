import { useCreateScene } from './hooks/scene/useCreateScene'
import { useLoadRobot } from './hooks/geometry/useLoadRobot'
import { useBufferGeometry } from './hooks/geometry/useBufferGeometry'
import { useAxisHelper } from './hooks/helperTools/useAxisHelper'
import { useRenderer } from './hooks/useRenderer'
import { useLoadDoughnut } from './hooks/geometry/useLoadDoughnut'


export const Main = () => {
  const { scene, camera, renderer } = useCreateScene()
  useLoadRobot({ scene, camera, renderer })
  // useBufferGeometry({ scene, camera, renderer })
  // useRenderer({ scene, camera, renderer })
  // useLoadDoughnut({ scene, camera, renderer })
  useAxisHelper(scene)
  const animate = () => {
    renderer.render(scene, camera)

    requestAnimationFrame(animate)
  }
  animate()
  return (<></>)
}
