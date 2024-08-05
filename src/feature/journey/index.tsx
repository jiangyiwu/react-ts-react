import { useParticles } from './particles/particles'
import { useParticlesAnimation } from './particles/particlesAnimation'
import { useGalaxy } from './particles/galaxy'
import { useRaycaster } from './raycaster/raycaster'
import { useMouseRaycaster } from './raycaster/mouseRaycaster'

export const Journey = () => {
  // useParticles()
  // useParticlesAnimation()
  // useGalaxy()
  useMouseRaycaster()
  return (<></>)
}
