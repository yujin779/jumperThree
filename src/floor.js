import * as THREE from "three";
import CANNON from "cannon";

export class Floor {
  constructor(scene, cannonPhysics) {
    this.group = new THREE.Group();
    const args = [30, 2, 30];

    // 物理設定
    var mass = 1;
    var shape = new CANNON.Box(
      new CANNON.Vec3(args[0] / 2, args[1] / 2, args[2] / 2)
    );
    this.phyBox = new CANNON.Body({ mass: 0, shape: shape });
    // this.phyBox.quaternion.setFromAxisAngle(
    //   new CANNON.Vec3(1, 0, 0),
    //   -Math.PI / 2
    // );
    // this.phyBox.angularVelocity.set(0, 5, 10); //角速度
    this.phyBox.angularDamping = 0.1; //減衰率
    this.phyBox.position.y = -5;
    cannonPhysics.world.add(this.phyBox);

    // 物理設定のサイズをボックスで描画
    let cubeGeometry = new THREE.BoxGeometry(args[0], args[1], args[2]);
    let cubeMaterial = new THREE.MeshStandardMaterial({
      color: "white",
      transparent: true,
      opacity: 0.3,
    });
    let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.y = -5;
    this.group.add(cube);
    scene.add(this.group);
  }

  //   tick() {
  //     if (this.object === undefined) return;
  //     // 物理更新
  //     this.group.position.copy(this.phyBox.position);
  //     this.group.quaternion.copy(this.phyBox.quaternion);
  //   }
}
