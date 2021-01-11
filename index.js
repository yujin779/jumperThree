import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "stats.js";
import { Player } from "./src/player";
import { Enemies } from "./src/enemies";
import { Floor } from "./src/floor";
import { CannonPhysics } from "./src/cannonPhysics";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Opening } from "./src/opening";

import dino from "./assets/gltf/dino.glb";

export const SCENE = {
  Opening: 0,
  Playing: 1,
  GameOver: 2,
};

class Jumper {
  constructor() {
    this.init = this.init.bind(this);
    this.animate = this.animate.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);
    this.gameScene = SCENE.Opening;
    console.log("scene", this.scene);
    console.log("s", SCENE.Opening);

    this.init();
    // 灯りを設置
    this.defaultLigts();
    //物理計算
    this.cannonPhysics = new CannonPhysics();
    //床のオブジェクト
    // this.floor = new Floor(
    //   this.scene,
    //   this.cannonPhysics,
    //   [10, 0.5, 10],
    //   [0, 10, 0]
    // );
    this.floor = new Floor(
      this.scene,
      this.cannonPhysics,
      [150, 0.5, 30],
      [0, 0, 0]
    );
    //glTFの読み込み
    this.loader = new GLTFLoader();
    this.setPlayerObjects();
    this.enemies = new Enemies(this.scene, this.cannonPhysics);

    //Opening
    this.opening = new Opening(this.scene, this.camera);
    this.click = () => {
      switch (this.gameScene) {
        case SCENE.Opening:
          console.log("opningClick");
          this.opening.toTheNextScene = true;
          this.opening.background.material.opacity = 0;
          break;
        case SCENE.Playing:
          console.log("playingClick");
          if (this.player.landing) {
            // console.log("islanding");
            this.player.phyBox.applyImpulse(
              new CANNON.Vec3(0, 25, 0),
              new CANNON.Vec3(0, 0, 0)
            );
            this.player.landing = false;
          }
          break;
        case SCENE.GameOver:
          console.log("gameover");
          break;
        default:
          console.log("scene is default");
      }
      // console.log("click", this.landing);
      // 一度着地していたらクリックでジャンプ
    };
    // クリックでジャンプ
    this.canvas.addEventListener("click", this.click);
  }

  /**
   * GLTFLoader
   */
  gltfLoad(url) {
    return new Promise((resolve) => {
      this.loader.load(url, (data) => {
        resolve(data);
      });
    });
  }

  /**
   * プレイヤーを設置
   */
  setPlayerObjects() {
    // プレイヤー
    this.gltfLoad(dino)
      .then((value) => {
        this.player = new Player(
          this.canvas,
          this.scene,
          this.cannonPhysics,
          value
        );
      })
      .catch((error) => {
        console.error(error);
      });
  }

  /**
   * 灯り
   */
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

  /**
   * 初期設定
   */
  init() {
    this.aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(50, this.aspect, 1, 1000);
    // this.camera.position.z = 40;
    // this.camera.position.set(-15, 10, 30);
    this.camera.position.set(-15, 60, 60);
    this.camera.lookAt(new THREE.Vector3(10, 0, 0));

    // this.controls = new OrbitControls(this.camera);

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

  /**
   * フレームごとに実行
   */
  animate() {
    this.stats.begin();
    // this.opening.tick();

    switch (this.gameScene) {
      case SCENE.Opening:
        this.opening.tick();
        // console.log(this.opening.mesh);
        if (this.opening.mesh === null) break;
        // console.log("b");
        if (this.opening.mesh.material.opacity < 0.05) {
          // console.log("a");
          this.gameScene = SCENE.Playing;
        }
        break;
      case SCENE.Playing:
        // console.log("playing");
        if (this.player && this.enemies) {
          this.cannonPhysics.world.step(1 / 60);
          this.player.tick();
          this.enemies.tick(0.07);
        }
        break;
      case SCENE.GameOver:
        console.log("gameover");
        break;
      default:
        console.log("scene is default");
    }

    // if (this.player && this.enemies) {
    //   this.cannonPhysics.world.step(1 / 60);
    //   this.player.tick();
    //   this.enemies.tick(0.07);
    // }
    // this.controls.update();
    this.renderer.render(this.scene, this.camera);

    this.stats.end();
  }

  /**
   * ウィンドウサイズ変更時にcanvasサイズ変更
   */
  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}

new Jumper();
