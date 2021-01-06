import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import CANNON from "cannon";

import dino from "../assets/gltf/dino.glb";

export class CannonPhysics {
  constructor(scene) {
    this.world = new CANNON.World();
    this.world.gravity.set(0, -30, 0);
    this.world.broadphase = new CANNON.NaiveBroadphase(); //ぶつかっている可能性のあるオブジェクト同士を見つける
    this.world.solver.iterations = 8; //反復計算回数
    this.world.solver.tolerance = 0.1; //許容値

    // var mass = 1;
    // var shape = new CANNON.Box(new CANNON.Vec3(5, 5, 5));

    // this.phyBox = new CANNON.Body({ mass, shape });
    // this.phyBox.angularVelocity.set(0, 5, 10); //角速度
    // this.phyBox.angularDamping = 0.1; //減衰率
    // this.world.add(this.phyBox);
  }

  //   tick() {
  //     if (this.object === undefined) return;
  //     this.object.position.copy(this.phyBox.position);
  //     this.object.quaternion.copy(this.phyBox.quaternion);
  //     console.log(this.object.position);
  //   }
}
