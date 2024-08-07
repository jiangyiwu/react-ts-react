import * as THREE from 'three'
import * as dat from 'lil-gui'
import gsap from 'gsap'
import { listenResize } from '../../../utils/event'
import stats from '../../../utils/stat'

const parameters = {
  materialColor: '#FFF59D',
}

export const ScrollAnimation = () => {
  const canvas = document.querySelector('#mainCanvas') as HTMLCanvasElement

  const scene = new THREE.Scene()

  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
  }

  const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
  camera.position.set(0, 0, 6)
  const cameraGroup = new THREE.Group()
  cameraGroup.add(camera)
  scene.add(cameraGroup)

  const textureLoader = new THREE.TextureLoader()
  const gradientTexture = textureLoader.load('https://gw.alicdn.com/imgextra/i1/O1CN01Kv3xWT1kImpSDZI8n_!!6000000004661-0-tps-5-1.jpg')
  gradientTexture.magFilter = THREE.NearestFilter

  const material = new THREE.MeshToonMaterial({
    color: parameters.materialColor,
    gradientMap: gradientTexture
  })
  const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), material)
  const mesh2 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), material)
  const mesh3 = new THREE.Mesh(new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16), material)

  scene.add(mesh1, mesh2, mesh3)

  const objectsDistance = 8
  mesh1.position.y = -objectsDistance * 0
  mesh2.position.y = -objectsDistance * 1
  mesh3.position.y = -objectsDistance * 2

  const sectionMeshes: THREE.Mesh<THREE.BufferGeometry, THREE.MeshToonMaterial>[] = [
    mesh1,
    mesh2,
    mesh3,
  ]

  sectionMeshes.forEach((item, index) => {
    item.position.setX(index % 2 === 0 ? 2 : -2)
    item.position.setY(-objectsDistance * index)
  })


  const directionLight = new THREE.DirectionalLight(0xffffff, 1)
  directionLight.position.set(1, 1, 0)
  const ambientLight = new THREE.AmbientLight(new THREE.Color(0xffffff), 0.28)
  scene.add(ambientLight, directionLight)

  // const directionLightHelper = new THREE.DirectionalLightHelper(directionLight, 2)
  // scene.add(directionLightHelper)

  /**
   * Particles
   */
  const particlesCount = 200
  const positions = new Float32Array(particlesCount * 3)
  for (let i = 0; i < particlesCount; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * 10
    positions[i * 3 + 1] = objectsDistance * 0.5 - Math.random() * objectsDistance * sectionMeshes.length
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10
  }
  const particlesGeometry = new THREE.BufferGeometry()
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  // material
  const particlesMaterial = new THREE.PointsMaterial({
    color: parameters.materialColor,
    sizeAttenuation: true,
    size: 0.03
  })
  const particles = new THREE.Points(particlesGeometry, particlesMaterial)
  scene.add(particles)

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true
  })
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  let { scrollY } = window
  let currentSection = 0
  window.addEventListener('scroll', () => {
    scrollY = window.scrollY
    const newSection = Math.round(scrollY / sizes.height)
    if (newSection !== currentSection) {
      currentSection = newSection
      gsap.to(sectionMeshes[currentSection].rotation, {
        duration: 1.5,
        ease: 'power2.inOut',
        x: '+=6',
        y: '+=3'
      })
    }
  })

  const mouse: {
    x: number | null
    y: number | null
  } = { x: null, y: null }

  window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / sizes.width) * 2 - 1
    mouse.y = -(event.clientY / sizes.height) * 2 + 1
  })

  listenResize(sizes, camera, renderer)

  const clock = new THREE.Clock()
  let previewTime = 0

  const tick = () => {
    stats.begin()

    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previewTime
    previewTime = elapsedTime


    sectionMeshes.forEach((mesh) => {
      // mesh.rotation.set(elapsedTime * 0.1, elapsedTime * 0.12, 0)
      mesh.rotation.set(deltaTime * 0.1 + mesh.rotation.x, deltaTime * 0.1 + mesh.rotation.y, 0)
    })

    if (mouse.x && mouse.y) {
      const parallaxX = mouse.x * 0.5
      const parallaxY = mouse.y * 0.5
      cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime
      cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime
    }

    camera.position.setY((-scrollY / sizes.height) * objectsDistance)

    renderer.render(scene, camera)
    stats.end()

    requestAnimationFrame(tick)
  }

  tick()

  const gui = new dat.GUI()
  gui.addColor(parameters, 'materialColor').onChange(() => {
    material.color.set(parameters.materialColor)
  })

  return (
    <>
    </>
  )
}

