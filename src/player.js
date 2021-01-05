import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import CANNON from "cannon";

import dino from "../assets/gltf/dino.glb";

export class Player {
  constructor(scene) {
    //glTFの読み込み
    const loader = new GLTFLoader();
    loader.load(dino, (data) => {
      this.object = data.scene;
      // //拡大
      // let scale = 5;
      // this.object.scale.set(scale, scale, scale);
      scene.add(this.object);
    });

    this.world = new CANNON.World();
    this.world.gravity.set(0, -10, 0);
  }
}
