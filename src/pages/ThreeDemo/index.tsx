import React, {useEffect} from 'react';
import css from './index.module.css'
import ContainerFlex from '../../components/containers/container-flex';
import {Button, Card} from 'antd';
import {isSupportWebgl} from '@/utils/env-check';
import {
  AxesHelper,
  BoxGeometry, BufferGeometry, Camera, Line, LineBasicMaterial,
  Material,
  Mesh,
  MeshBasicMaterial, MeshLambertMaterial, MeshPhongMaterial, Object3D,
  PerspectiveCamera, PointLight, Renderer,
  Scene, Vector3,
  WebGLRenderer
} from 'three';
import {MaterialParameters} from 'three/src/materials/Material';
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry';
import TWEEN from '@tweenjs/tween.js';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

function Index() {
  // const isWebGl = isSupportWebgl()
  function firstThree(){
    let animationList:Array<(()=>void) | undefined> = []
    //初始化场景，添加正方体到盒子中间
    let  scene:Scene
    // 创建相机
    const width = 800
    const height = 500
    let camera:Camera
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
      camera = new PerspectiveCamera(30, width/height, 1, 3000)
      camera.position.set(400, 400, 400)
      camera.lookAt(0, 0, 0)

      const axesHelper = new AxesHelper(150)
      scene.add(axesHelper)
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
        renderer
      }
    }
    function setCamera(cameraInfo:Camera){
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
  let cameraInfo:Camera
  let sceneInfo:Scene
  let rendererInfo:Renderer
  useEffect(()=>{
    const {camera, scene, renderer} = init()
    cameraInfo = camera
    sceneInfo = scene
    rendererInfo = renderer
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
      mesh.rotation.x += 0.01
      mesh.rotation.y += 0.01
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
    const pointLight = new PointLight('#fff', 1.0)
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
  return (
    <ContainerFlex>
      <div id={'three'} />
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
      </div>
    </ContainerFlex>
  );
}

export default Index;
