import * as THREE from "three";
import CANNON from "cannon";

/**
 * 床
 */
export class Floor {
  constructor(scene, cannonPhysics, size = [1, 1, 1], position = [0, 0, 0]) {
    this.group = new THREE.Group();

    // 物理設定
    var mass = 1;
    var shape = new CANNON.Box(
      new CANNON.Vec3(size[0] / 2, size[1] / 2, size[2] / 2)
    );
    this.phyBox = new CANNON.Body({ mass: 0, shape: shape });
    this.phyBox.name = "floor";
    this.phyBox.position.set(position[0], position[1], position[2]);
    cannonPhysics.world.add(this.phyBox);
    console.log("phBox", this.phyBox);
    // 物理設定のサイズをボックスで描画
    let cubeGeometry = new THREE.BoxGeometry(size[0], size[1], size[2]);
    let cubeMaterial = new THREE.MeshStandardMaterial({
      color: "white",
      transparent: true,
      opacity: 0.3,
    });
    let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(position[0], position[1], position[2]);
    this.group.add(cube);
    scene.add(this.group);
  }
}
