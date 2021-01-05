import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import CANNON from "cannon";

import dino from "../assets/gltf/dino.glb";

export class Player {
  constructor(scene, cannonPhysics) {
    //glTFの読み込み
    const loader = new GLTFLoader();
    loader.load(dino, (data) => {
      this.object = data.scene;
      // //拡大
      // let scale = 5;
      // this.object.scale.set(scale, scale, scale);
      console.log(this.object);
      scene.add(this.object);
    });

    var mass = 1;
    var shape = new CANNON.Box(new CANNON.Vec3(5, 5, 5));

    this.phyBox = new CANNON.Body({ mass, shape });
    // this.phyBox.angularVelocity.set(0, 5, 10); //角速度
    this.phyBox.angularDamping = 0.1; //減衰率
    cannonPhysics.world.add(this.phyBox);
  }

  tick() {
    if (this.object === undefined) return;
    this.object.position.copy(this.phyBox.position);
    this.object.quaternion.copy(this.phyBox.quaternion);
  }
}
