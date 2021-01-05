import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import dino from "../assets/gltf/dino.glb";

export class Player {
  constructor(scene) {
    console.log("cnst");
    //glTFの読み込み
    const loader = new GLTFLoader();
    console.log(loader);
    console.log(dino);
    loader.load(dino, (data) => {
      this.object = data.scene;
      // //拡大
      // let scale = 5;
      // this.object.scale.set(scale, scale, scale);
      scene.add(this.object);
    });
  }
}
