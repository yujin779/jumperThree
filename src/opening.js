import * as THREE from "three";
import CANNON from "cannon";
import { VOXLoader } from "three/examples/jsm/loaders/VOXLoader";

/**
 * 床
 */
export class Opening {
  constructor(scene, camera, cannonPhysics) {
    console.log("camera is", camera);
    this.group = new THREE.Group();
    console.log("group is", this.group.quaternion);
    // groupをカメラの正面に向ける
    this.group.quaternion.copy(camera.quaternion);
    // this.group.position.x = 10;

    // リストを作成
    this.list = [];
    // ローダーを作成
    const loader = new VOXLoader();

    // 物理設定のサイズをボックスで描画
    let cubeGeometry = new THREE.BoxGeometry(30, 20, 10);
    let cubeMaterial = new THREE.MeshStandardMaterial({
      color: "black",
      transparent: true,
      opacity: 0.7,
    });
    let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    // cube.position.x = 7.5;
    // cube.position.z = 13;
    cube.position.set(7.5, 2, 15);
    // cube.position.set(position[0], position[1], position[2]);
    this.group.add(cube);
    scene.add(this.group);
  }
}
