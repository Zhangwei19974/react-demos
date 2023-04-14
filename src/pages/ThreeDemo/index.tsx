import React, {useEffect} from 'react';
import css from './index.module.css'
import ContainerFlex from '../../components/containers/container-flex';
import {Button, Card} from 'antd';
import {isSupportWebgl} from '@/utils/env-check';
import {
  AmbientLight,
  AxesHelper,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  Camera, CatmullRomCurve3,
  DirectionalLight,
  DoubleSide,
  GridHelper,
  Group, LatheGeometry,
  Line,
  LineBasicMaterial, LineLoop,
  Material,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  MeshPhongMaterial,
  Object3D,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  Points,
  PointsMaterial,
  Renderer,
  RepeatWrapping,
  Scene, Shape,
  ShapeGeometry,
  TextureLoader, TubeGeometry, Vector2,
  Vector3,
  WebGLRenderer,

} from 'three';
import {MaterialParameters} from 'three/src/materials/Material';
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry';
import TWEEN from '@tweenjs/tween.js';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';
import {ParametricGeometries} from 'three/examples/jsm/geometries/ParametricGeometries';
import SphereGeometry = ParametricGeometries.SphereGeometry;
import {GUI} from 'dat.gui';
import yige from '@/assets/yige.png'

function Index() {
  // const isWebGl = isSupportWebgl()
  function firstThree(){
    let animationList:Array<(()=>void) | undefined> = []
    //初始化场景，添加正方体到盒子中间
    let  scene:Scene
    // 创建相机
    const width = 800
    const height = 500
    let camera:PerspectiveCamera
    // 创建渲染器
    let renderer:Renderer
    let callBackFun:(()=>void) | undefined
    let dom:HTMLElement
    let appendChild:HTMLElement
    const keepAliveObj:Object3D[] = []
    function remove(){
      dom.removeChild(appendChild)
    }
    function init(){
      scene = new Scene()
      camera = new PerspectiveCamera(30, width/height, 1, 2000)
      camera.position.set(400, 400, 400)
      camera.lookAt(0, 0, 0)

      const axesHelper = new AxesHelper(150)
      scene.add(axesHelper)

      const  gridHelper = new GridHelper(400, 25, 0x004444, 0x004444)
      scene.add(gridHelper)
      keepAliveObj.push(axesHelper)
      keepAliveObj.push(scene)
      renderer = new WebGLRenderer()
      renderer.setSize(width, height)
      renderer.render(scene, camera)
      dom  = document.getElementById('three')!
      console.log(dom)
      appendChild = dom.appendChild(renderer.domElement)
      function animate() {
        requestAnimationFrame(animate)
        // if(callBackFun){
        //   callBackFun()
        // }
        TWEEN.update()
        animationList.forEach(e=>e!())
        renderer.render(scene, camera)
      }
      animate()
      return{
        scene,
        camera,
        renderer,
        dom
      }
    }
    function setCamera(cameraInfo:PerspectiveCamera){
      camera = cameraInfo
    }
    function setScene(sceneInfo:Scene){
      scene = sceneInfo
    }
    function setRenderer(rendererInfo:Renderer){
      renderer = rendererInfo
    }
    function setAnimation(callFun?:()=>void){
      // callBackFun = callFun
      if(!callFun){
        animationList = []
        return
      }
      animationList.push(callFun)
    }
    return {
      init,
      remove,
      setAnimation,
      setCamera,
      setRenderer,
      setScene,
      keepAliveObj
    }
  }
  const {init, remove, setAnimation, keepAliveObj, setCamera, setRenderer, setScene } = firstThree()
  let cameraInfo:PerspectiveCamera
  let sceneInfo:Scene
  let rendererInfo:Renderer
  let domInfo:HTMLElement
  useEffect(()=>{
    const {camera, scene, renderer, dom} = init()
    cameraInfo = camera
    sceneInfo = scene
    rendererInfo = renderer
    domInfo = dom
    return()=>{
      remove()
    }
  }
  , [])

  const materialObj:any = {color: '#770000'}
  function clearScene(){
    console.log(sceneInfo)
    const removeList:Array<Object3D> = []
    sceneInfo.traverse((e)=>{
      if(keepAliveObj.includes(e)){
        return
      }
      removeList.push(e)
    })
    removeList.forEach(e=>{
      sceneInfo.remove(e)
    })
    cameraInfo.position.set(400, 400, 400)
    cameraInfo.lookAt(0, 0, 0)
    setAnimation()
  }

  function initBoxGeometry(){
    // clearScene()
    const box = new BoxGeometry(100, 100, 100)
    const  material = new MeshBasicMaterial({
      color: '#770000'
    })
    const mesh = new Mesh(box, material)
    mesh.position.set(0, 10, 0)
    sceneInfo.add(mesh)

    setAnimation(()=>{
      mesh.rotation.x += Math.PI/20
      mesh.rotation.y += Math.PI/20
    })
  }

  function initLine(){
    clearScene()
    const material = new LineBasicMaterial(materialObj)
    const points = []
    points.push(new Vector3(-100, 0, 0))
    points.push(new Vector3(0, 100, 0))
    points.push(new Vector3(100, 0, 0))

    const geometry = new BufferGeometry().setFromPoints(points)
    const line =new Line(geometry, material)
    sceneInfo.add(line)
  }

  function initText(){
    // 文字加载有点问题，后期完善
    clearScene()
    const textGeometry = new TextGeometry('hello three.js')
    const m = new MeshPhongMaterial(materialObj)
    const mesh = new Mesh(textGeometry, m)
    mesh.position.set(0, 0, 0)
    sceneInfo.add(mesh)
  }

  function changeCameraPosition(){
    console.log(cameraInfo.position)
    const tween = new TWEEN.Tween(cameraInfo.position)
    tween.to(new Vector3(getRendom(1000), getRendom(1000), getRendom(1000)), 1000)
    tween.onUpdate(()=>{
      cameraInfo.lookAt(0, 0, 0)
    })
    tween.start()
    // cameraInfo.position.set(getRendom(1000), getRendom(1000), getRendom(1000))
  }
  function getRendom(length:number){
    return  Math.floor(Math.random()*length)
  }
  // 创建有光源的场景
  function createLightObject(){
    const box = new BoxGeometry(100, 100, 100)
    const material1 = new MeshBasicMaterial({
      color: '#770000'
    })
    const material2 = new MeshLambertMaterial({
      color: '#770000'
    })
    const mesh1 = new Mesh(box, material1)
    mesh1.position.set(0, 0, 0)
    const mesh2 = new Mesh(box, material2)
    mesh2.position.set(200, 200, 200)
    const pointLight = new PointLight('#fff', 10)
    pointLight.position.set(400, 0, 0)
    sceneInfo.add(mesh1)
    sceneInfo.add(mesh2)
    sceneInfo.add(pointLight)
  }
  function createOrbitControls(){
    const control = new OrbitControls(cameraInfo, rendererInfo.domElement)
    control.addEventListener('change', function (){
      console.log('Asdasd')
      rendererInfo.render(sceneInfo, cameraInfo)
    })
  }
  function fullScreen(){
    rendererInfo.setSize(window.innerWidth, window.innerHeight)
    cameraInfo.aspect = window.innerWidth/ window.innerHeight
    cameraInfo.updateProjectionMatrix()
  }
  function installStats(){
    const stats = new Stats()
    console.log(stats)
    stats.dom.setAttribute('position', 'relative')
    domInfo.appendChild(stats.dom)
    setAnimation(()=>{
      stats.update()
    })
  }
  function cubeArray(){
    const geometry = new BoxGeometry(100, 100, 100)
    const material = new MeshLambertMaterial({
      transparent: true,
      opacity: 0.5,
      color: 0x00ffff,

    })
    const point = new PointLight('#ffffff', 10)
    point.position.set(800, 0, 800)
    sceneInfo.add(point)
    for (let i=0;i<10;i++){
      for (let j=0;j<10;j++){
        const mash = new Mesh(geometry, material)
        mash.position.set(200*i, 0, 200*j)
        setAnimation(()=>{
          mash.rotation.x += 0.1
          mash.rotation.y += 0.1
        })
        sceneInfo.add(mash)
      }
    }
  }

  function createPhongMaterial(){
    const point = new PointLight(0xfff, 10)
    point.position.set(400, 0, 400)
    sceneInfo.add(point)
    const geometry = new SphereGeometry(50, 1000, 100)
    const material = new MeshPhongMaterial({
      color: 0x00ffff
    })
    const mesh = new Mesh(geometry, material)
    sceneInfo.add(mesh)
  }
  function createGui(){
    const gui = new GUI()
    gui.domElement.style.right = '0px'
    gui.domElement.style.width = '300px'
    gui.domElement.style.position = 'absolute'
    gui.domElement.style.top = '0px'
    gui.domElement.style.right = '0px'
    const obj = {
      x: 30
    }
    gui.add(obj, 'x', 0, 100)
    console.log(gui)
    domInfo.appendChild(gui.domElement)
  }
  function createGeometryAndPoint(){
    const geometry = new BufferGeometry()
    const vertices = new Float32Array([
      0, 0, 0, //顶点1坐标
      50, 0, 0, //顶点2坐标
      0, 100, 0, //顶点3坐标
      0, 0, 10, //顶点4坐标
      0, 0, 100, //顶点5坐标
      50, 0, 10, //顶点6坐标
    ])
    const attrubue = new BufferAttribute(vertices, 3)
    geometry.setAttribute('position', attrubue)
    const material= new PointsMaterial({
      color: 0xffff00,
      size: 10.0 //点对象像素尺寸
    })
    const points = new Points(geometry, material)
    sceneInfo.add(points)
  }
  function createLineModel(){
    const geometry = new BufferGeometry()
    const vertices = new Float32Array([
      0, 0, 0, //顶点1坐标
      50, 0, 0, //顶点2坐标
      0, 100, 0, //顶点3坐标
      0, 0, 10, //顶点4坐标
      0, 0, 100, //顶点5坐标
      50, 0, 10, //顶点6坐标
    ])
    const attrubue = new BufferAttribute(vertices, 3)
    geometry.setAttribute('position', attrubue)
    const material = new LineBasicMaterial({
      color: 0xff0000
    })
    const line = new Line(geometry, material)
    sceneInfo.add(line)
  }
  function createSquare(){
    const geometry = new BufferGeometry()
    const vertices = new Float32Array([
      0, 0, 0, //顶点1坐标
      80, 0, 0, //顶点2坐标
      80, 80, 0, //顶点3坐标

      0, 0, 0, //顶点4坐标   和顶点1位置相同
      80, 80, 0, //顶点5坐标  和顶点3位置相同
      0, 80, 0, //顶点6坐标
    ])
    const attribute = new BufferAttribute(vertices, 3)
    geometry.setAttribute('position', attribute)
    const material = new MeshBasicMaterial({
      color: '#770000',
      side: DoubleSide
    })
    const mesh = new Mesh(geometry, material)
    sceneInfo.add(mesh)
  }
  function createSquareWithPointIndex(){
    const geometry = new BufferGeometry()
    const vertices = new Float32Array([
      0, 0, 0, //顶点1坐标
      80, 0, 0, //顶点2坐标
      80, 80, 0, //顶点3坐标
      0, 80, 0, //顶点4坐标
    ])

    const index = new Uint16Array([0, 1, 2, 0, 2, 3,])
    geometry.index = new BufferAttribute(index, 1)
    geometry.setAttribute('position', new BufferAttribute(vertices, 3) )
    const material = new MeshBasicMaterial({
      color: '#770000',
      side: DoubleSide
    })
    const mesh = new Mesh(geometry, material)
    sceneInfo.add(mesh)
  }
  function createGroup(){
    const geometry = new BoxGeometry(20, 20, 20)
    const  material = new MeshPhongMaterial({
      opacity: 0.5,
      color: 0xff0000,
      transparent: true
    })
    const group = new Group()
    const mesh = new Mesh(geometry, material)
    const mesh2 = mesh.clone()
    const point = new PointLight('#fff', 10)
    mesh2.position.x = 40
    group.add(mesh)
    group.add(mesh2)
    sceneInfo.add(point)
    sceneInfo.add(group)
    point.position.set(80, 80, 80)
    setAnimation(()=>{
      group.rotation.x += 0.03
      group.rotation.y += 0.03
      group.rotation.z += 0.03
    })
  }
  function createTexture(){
    const geometry = new SphereGeometry(50, 100, 100)
    const textureLoader = new TextureLoader()
    const texture = textureLoader.load(yige)
    const material = new MeshBasicMaterial({
      color: 0xffffff,
      map: texture
    })
    const mesh = new Mesh(geometry, material)
    const point = new PointLight('#fff', 10)
    point.position.set(80, 1, 3)
    console.log(mesh)
    sceneInfo.add(mesh)
    sceneInfo.add(point)

  }
  function createTextureWrap(){
    const geometry = new PlaneGeometry(200, 200)
    const textureLoader = new TextureLoader()
    const texture = textureLoader.load(yige)
    texture.wrapT = RepeatWrapping
    texture.wrapS = RepeatWrapping
    texture.repeat.set(2, 2)
    const material = new MeshBasicMaterial({
      color: 0xffffff,
      map: texture
    })
    const mesh = new Mesh(geometry, material)
    const point = new PointLight('#fff', 10)
    point.position.set(80, 1, 3)
    console.log(mesh)
    sceneInfo.add(mesh)
    sceneInfo.add(point)
    setAnimation(()=>{
      texture.offset.x += 0.01
    })
  }
  function create(){
    const light = new DirectionalLight(0xffffff, 2)
    sceneInfo.add(light)
  }
  function createArc(){
    const geometry = new BufferGeometry()
    const  R = 100
    const N = 50
    const sp = Math.PI*2/N
    const  arr  = []
    for (let i = 0; i<N; i++){
      const angle = sp * i
      const x = R * Math.cos(angle)
      const y = R * Math.sin(angle)
      arr.push(x, y, 0)
    }
    const  vertices = new Float32Array(arr)
    const attribue  = new BufferAttribute(vertices, 3)
    geometry.setAttribute('position', attribue)

    const material = new LineBasicMaterial({
      color: 0xff0000
    })
    const line= new  LineLoop(geometry, material)
    sceneInfo.add(line)

  }
  function createCatmullRomCurve3(){
    const arr = [
      new Vector3(-50, 20, 90),
      new Vector3(-10, 40, 40),
      new Vector3(0, 0, 0),
      new Vector3(60, -60, 0),
      new Vector3(70, 0, 80)
    ]
    const curve = new CatmullRomCurve3(arr)
    const points = curve.getPoints(100)
    const geometry = new BufferGeometry()
    geometry.setFromPoints(points)
    const material  = new LineBasicMaterial({
      color: 0xff0000
    })
    const  line= new Line(geometry, material)
    sceneInfo.add(line)
  }
  function createTube(){
    const  path = new CatmullRomCurve3([
      new Vector3(-50, 20, 90),
      new Vector3(-10, 40, 40),
      new Vector3(0, 0, 0),
      new Vector3(60, -60, 0),
      new Vector3(70, 0, 80)
    ])
    const geometry = new TubeGeometry(path, 40, 2, 25)
    const material = new MeshBasicMaterial({
      color: 0xff0000,
      side: DoubleSide, //双面显示看到管道内壁
    });
    const mesh = new Mesh(geometry, material)
    sceneInfo.add(mesh)
  }
  function createLathGeometry(){
    const  path = [
      new Vector2(-50, 20),
      new Vector2(-10, 40),
      new Vector2(0, 0),
      new Vector2(60, -60),
      new Vector2(70, 0)
    ]
    const geometry = new LatheGeometry(path)
    const material = new MeshBasicMaterial({
      color: 0xff0000,
      side: DoubleSide, //双面显示看到管道内壁
    });
    const mesh = new Mesh(geometry, material)
    sceneInfo.add(mesh)
  }
  function createPolygonContourArc(){
    const shape = new Shape()
    shape.lineTo(100+50, 0)
    shape.arc(-50, 0, 50, 0, Math.PI/2, false)
    shape.lineTo(0, 50)
    const geometry = new ShapeGeometry(shape)
    const material = new MeshBasicMaterial({
      color: 0xff0000,
      side: DoubleSide, //双面显示看到管道内壁
    });
    const mesh = new Mesh(geometry, material)
    sceneInfo.add(mesh)
  }
  function createTubeWatch(){
    const path = new CatmullRomCurve3([
      new Vector3(-50, 20, 90),
      new Vector3(-10, 40, 40),
      new Vector3(0, 0, 0),
      new Vector3(60, -60, 0),
      new Vector3(90, -40, 60),
      new Vector3(120, 30, 30),
    ])
    const geometry = new TubeGeometry(path, 100, 5, 30)
    const textureLoader = new TextureLoader()
    const texture = textureLoader.load(yige)
    texture.wrapS = RepeatWrapping

    const material = new MeshBasicMaterial({
      map: texture,
      side: DoubleSide, //双面显示看到管道内壁
    });
    const mesh = new Mesh(geometry, material)
    let i = 0
    const pointArr = path.getPoints(1000)
    const tween = new TWEEN.Tween(cameraInfo.position)
    tween.to(pointArr[i], 1000)
    tween.onUpdate(()=>{
      cameraInfo.lookAt(pointArr[1])
    })
    tween.start()
    tween.onComplete(()=>{
      setAnimation(()=>{
        if(i+1 <= pointArr.length){
          console.log('Asdasd')
          cameraInfo.position.copy(pointArr[i])
          cameraInfo.lookAt(pointArr[i+1])
          i+=1
        }
      })
    })
    sceneInfo.add(mesh)
  }
  return (
    <ContainerFlex>
      <div id={'three'} style={{position: 'relative'}} />
      {/*<Card style={{width: 300, height: 600}}>*/}
      {/*  asdasd*/}
      {/*</Card>*/}
      <div className={css.buttons}>
        <Button onClick={()=>clearScene()}>清空</Button>
        <Button onClick={()=>initBoxGeometry()}>创建正方体</Button>
        <Button onClick={()=>initLine()}>绘制线段</Button>
        <Button onClick={()=>initText()}>创建文字</Button>
        <Button onClick={()=>changeCameraPosition()}>切换camera位置</Button>
        <Button onClick={()=>createLightObject()}>创建有光源的场景</Button>
        <Button onClick={()=>createOrbitControls()}>创建相机组件</Button>
        <Button onClick={()=>fullScreen()}>全屏</Button>
        <Button onClick={()=>installStats()}>引入Stats</Button>
        <Button onClick={()=>cubeArray()}>阵列立方体和相机适配体验</Button>
        <Button onClick={()=>createPhongMaterial()}>创建高光材质</Button>
        <Button onClick={()=>createGui()}>创建GUI</Button>
        <Button onClick={()=>createGeometryAndPoint()} >创建点模型</Button>
        <Button onClick={()=>createLineModel()}>创建线模型</Button>
        <Button onClick={()=>createSquare()}>三角形拼接面</Button>
        <Button onClick={()=>createSquareWithPointIndex()}>使用顶点索引数据创建三角形拼接的正方体</Button>
        <Button onClick={()=>createGroup()}>分组</Button>
        <Button onClick={()=>createTexture()}>创建纹理贴图</Button>
        <Button onClick={()=>createTextureWrap()} >矩形阵列功能</Button>
        <Button onClick={()=>create()}>添加环境光</Button>
        <Button onClick={()=>createArc()}>绘制圆弧</Button>
        <Button onClick={()=>createCatmullRomCurve3()}>三维样条曲线</Button>
        <Button onClick={()=>createTube()}>曲线路径管道</Button>
        <Button onClick={()=>createLathGeometry()}>旋转成型</Button>
        <Button onClick={()=>createPolygonContourArc()}>多边形轮廓圆弧</Button>
        <Button onClick={()=>createTubeWatch()}>管道漫游</Button>
      </div>
    </ContainerFlex>
  );
}

export default Index;
