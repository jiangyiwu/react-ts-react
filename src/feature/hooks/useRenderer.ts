import { useEffect } from 'react'
import { useControls } from './geometry/useControls'
import { Props } from './geometry/useLoadRobot'


export const useRenderer = ({ scene, camera, renderer }: Props) => {
  const { controls } = useControls({ camera, renderer })

  const animate = () => {
    renderer.render(scene, camera)
    controls.update()

    requestAnimationFrame(animate)
  }

  useEffect(() => {
    animate()
  })
}
