import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import CANNON from "cannon";

import bigCactus from "../assets/gltf/bigCactus.glb";

export class Enemies {
  constructor(scene, cannonPhysics) {
    const loader = new GLTFLoader();
    let model = null;
    loader.load(
      bigCactus,
      function (gltf) {
        model = gltf.scene;
        model.name = "model_with_cloth";
        model.scale.set(400.0, 400.0, 400.0);
        model.position.set(0, -400, 0);
        scene.add(gltf.scene);

        model["test"] = 100;
        console.log("model");
      },
      function (error) {
        console.log("An error happened");
        console.log(error);
      }
    );

    console.log("setModel", model);
    // this.tmpObj = new BigCactus(scene, cannonPhysics, this.bigCactus);
  }

  // load(loader, bigCactus) {
  //   loader.load(bigCactus, (data) => {
  //     return data.scene;
  //   });
  // }
}

export class BigCactus {
  constructor(scene, cannonPhysics, object) {
    console.log("bigCactusObj", object);
    this.group = new THREE.Group();
    // 着地判定
    this.landing = false;

    //物理設定ボックスのサイズ
    const args = [1.6, 2.3, 2];

    // 物理設定
    var mass = 1;
    var shape = new CANNON.Box(
      new CANNON.Vec3(args[0] / 2, args[1] / 2, args[2] / 2)
    );
    this.phyBox = new CANNON.Body({ mass, shape });
    // this.phyBox.angularVelocity.set(0, 5, 10); //角速度
    // this.phyBox.angularDamping = 0.1; //減衰率
    this.phyBox.fixedRotation = true;
    this.phyBox.position.y = 50;
    cannonPhysics.world.add(this.phyBox);
    console.log(this.phyBox);

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
  }

  tick() {
    if (this.object === undefined) return;
    // 角度とxポジションを固定
    // this.phyBox.quaternion = new CANNON.Quaternion(0, 0, 0, 1);
    // this.phyBox.position.x = 0;
    // this.phyBox.position.z = 0;
    // this.phyBox.position.x -= 0.01;
    // 物理更新
    this.group.position.copy(this.phyBox.position);
    this.group.quaternion.copy(this.phyBox.quaternion);
  }
}
