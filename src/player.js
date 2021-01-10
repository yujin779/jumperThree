import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import CANNON from "cannon";

import dino from "../assets/gltf/dino.glb";

export class Player {
  constructor(canvas, scene, cannonPhysics, gltf) {
    this.group = new THREE.Group();
    // 着地判定
    this.landing = false;
    this.canvas = canvas;
    this.object = gltf.scene;
    this.object.position.y = -1.1;
    this.object.position.x = -0.3;
    this.group.add(this.object);

    //物理設定ボックスのサイズ
    const args = [1.6, 2.3, 2];

    // 物理設定
    var mass = 1;
    var shape = new CANNON.Box(
      new CANNON.Vec3(args[0] / 2, args[1] / 2, args[2] / 2)
    );
    this.phyBox = new CANNON.Body({ mass, shape });
    this.phyBox.fixedRotation = true;
    this.phyBox.position.y = 30;
    cannonPhysics.world.add(this.phyBox);

    // 物理設定のサイズをボックスで描画
    let cubeGeometry = new THREE.BoxGeometry(args[0], args[1], args[2]);
    let cubeMaterial = new THREE.MeshStandardMaterial({
      color: "green",
      transparent: true,
      opacity: 0.3,
    });
    let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    this.group.add(cube);
    scene.add(this.group);

    this.click = () => {
      // console.log("click", this.landing);
      // 一度着地していたらクリックでジャンプ
      if (this.landing) {
        // console.log("islanding");
        this.phyBox.applyImpulse(
          new CANNON.Vec3(0, 25, 0),
          new CANNON.Vec3(0, 0, 0)
        );
        this.landing = false;
      }
    };
    // クリックでジャンプ
    this.canvas.addEventListener("click", this.click);
    // 当たり判定
    this.phyBox.addEventListener("collide", (e) => {
      // console.log("colliderr", e.contact.bi);
      if (e.contact.bi.name === "floor") this.landing = true;
      if (e.contact.bi.name === "enemy") console.log("enemy");
    });
  }

  tick() {
    if (this.object === undefined) return;
    // 角度とxポジションを固定
    this.phyBox.quaternion = new CANNON.Quaternion(0, 0, 0, 1);
    this.phyBox.position.x = 0;
    this.phyBox.position.z = 0;
    // this.phyBox.position.x -= 0.01;
    // 物理更新
    this.group.position.copy(this.phyBox.position);
    this.group.quaternion.copy(this.phyBox.quaternion);
  }
}
