import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import CANNON from "cannon";

import dino from "../assets/gltf/dino.glb";

export class Player {
  constructor(scene, cannonPhysics) {
    this.group = new THREE.Group();

    //glTFの読み込み
    const loader = new GLTFLoader();
    loader.load(dino, (data) => {
      this.object = data.scene;
      //物理設定ボックスとの位置調整
      this.object.position.y = -1.1;
      this.object.position.x = -0.3;
      this.group.add(this.object);
    });

    //物理設定ボックスのサイズ
    const args = [1.6, 2.3, 5];

    // 物理設定
    var mass = 1;
    var shape = new CANNON.Box(
      new CANNON.Vec3(args[0] / 2, args[1] / 2, args[2] / 2)
    );
    this.phyBox = new CANNON.Body({ mass, shape });
    // this.phyBox.quaternion.setFromAxisAngle(
    //   new CANNON.Vec3(1, 0, 0),
    //   -Math.PI / 2
    // );
    // this.phyBox.angularVelocity.set(0, 5, 10); //角速度
    this.phyBox.angularDamping = 0.1; //減衰率
    this.phyBox.position.y = 25;
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
  }

  tick() {
    if (this.object === undefined) return;
    // this.phyBox.position.x -= 0.01;
    // 物理更新
    this.group.position.copy(this.phyBox.position);
    this.group.quaternion.copy(this.phyBox.quaternion);
  }
}
