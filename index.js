import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import Stats from "stats.js";
import dino from "./assets/gltf/dino.glb";
class Jumper {
  constructor() {
    this.init = this.init.bind(this);
    this.animate = this.animate.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);

    this.init();
    this.defaultLigts();
    this.load();
  }

  defaultLigts() {
    const light = new THREE.DirectionalLight(0xffffff, 0.75);
    light.intensity = 1; // 光の強さ
    light.position.set(1.5, 3, 2.5);
    this.scene.add(light);
    const hemiLight = new THREE.HemisphereLight(0x888888, 0x000000, 1);
    this.scene.add(hemiLight);
    //座標軸を表示 x=red y=green z=blue
    var axis = new THREE.AxesHelper(1000);
    this.scene.add(axis);
  }

  load() {
    //glTFの読み込み
    const loader = new GLTFLoader();
    console.log("start");
    console.log(loader);
    console.log(dino);
    loader.load(dino, (data) => {
      this.object = data.scene;
      // //拡大
      // let scale = 5;
      // this.object.scale.set(scale, scale, scale);
      this.scene.add(this.object);
    });
  }

  init() {
    this.aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(50, this.aspect, 1, 1000);
    this.camera.position.z = 20;

    this.controls = new OrbitControls(this.camera);

    // this.geometry = new THREE.BoxBufferGeometry(200, 200, 200);
    // this.material = new THREE.MeshNormalMaterial();
    // this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("#191919");
    // this.scene.add(this.mesh);

    this.renderer = new THREE.WebGLRenderer({
      powerPreference: "high-performance",
      antialias: true,
    });

    document.body.appendChild(this.renderer.domElement);
    window.addEventListener("resize", this.onWindowResize);

    this.stats = new Stats();
    document.body.appendChild(this.stats.dom);

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.render(this.scene, this.camera);
    this.renderer.setAnimationLoop(this.animate);
  }

  animate() {
    this.stats.begin();

    // this.mesh.rotation.x += 0.005;
    // this.mesh.rotation.y += 0.001;

    this.controls.update();
    this.renderer.render(this.scene, this.camera);

    this.stats.end();
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}

new Jumper();
