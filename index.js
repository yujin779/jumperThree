import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "stats.js";
import { Player } from "./src/player";
import { Floor } from "./src/floor";
import { CannonPhysics } from "./src/cannonPhysics";

class Jumper {
  constructor() {
    this.init = this.init.bind(this);
    this.animate = this.animate.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);

    this.init();
    this.defaultLigts();
    this.cannonPhysics = new CannonPhysics();
    this.player = new Player(this.scene, this.cannonPhysics);
    this.floor = new Floor(
      this.scene,
      this.cannonPhysics,
      [10, 0.5, 10],
      [0, 10, 0]
    );
    this.floor2 = new Floor(
      this.scene,
      this.cannonPhysics,
      [150, 0.5, 30],
      [0, 0, 0]
    );
    // クリックしたらダイナソーをジャンプ
    this.canvas.addEventListener("click", this.player.click);
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

  init() {
    this.aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(50, this.aspect, 1, 1000);
    this.camera.position.z = 40;

    this.controls = new OrbitControls(this.camera);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("#191919");
    this.canvas = document.querySelector("#app");
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
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

    this.cannonPhysics.world.step(1 / 60);
    this.player.tick();
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
