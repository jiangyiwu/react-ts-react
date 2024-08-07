import { MenuInfo } from '../utils/menu'
import { Main } from '../feature'
import { Animation } from '../feature/animation'
import { Camera } from '../feature/journey/Camera'
import { OrbitCtrl } from '../feature/journey/OrbitControls'
import { FullScreen } from '../feature/journey/FullScreen'
import { Geometry } from '../feature/journey/Geometry'
import { Textures } from '../feature/journey/Textures'
import { FontLoaderView } from '../feature/journey/FontLoader'
import { LightView } from '../feature/journey/Light'
import { Shadow } from '../feature/journey/Shadow'
import { Journey } from '../feature/journey'
import { ScrollAnimation } from '../feature/journey/scrollAnimation/ScrollAnimation'

export const menu:MenuInfo[] = [
  {
    path: '/',
    title: '首页',
    page: <Main />
  },
  {
    path: '/animation',
    title: '动画',
    page: <Animation />
  },
  {
    path: '/camera',
    title: 'camera',
    page: <Camera />
  },
  {
    path: '/orbitCtrl',
    title: 'orbitCtrl',
    page: <OrbitCtrl />
  },
  {
    path: '/fullScreen',
    title: 'fullScreen',
    page: <FullScreen />
  },
  {
    path: '/geometry',
    title: 'geometry',
    page: <Geometry />
  },
  {
    path: '/textures',
    title: 'textures',
    page: <Textures />
  },
  {
    path: '/fontLoader',
    title: 'fontLoader',
    page: <FontLoaderView />
  },
  {
    path: '/light',
    title: 'light',
    page: <LightView />
  },
  {
    path: '/shadow',
    title: 'shadow',
    page: <Shadow />
  },
  {
    path: '/journey',
    title: 'journey',
    page: <Journey />
  },
  {
    path: '/scrollAnimation',
    title: 'scrollAnimation',
    page: <ScrollAnimation />
  },
]
