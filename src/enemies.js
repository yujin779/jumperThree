import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import CANNON from "cannon";

import bigCactus from "../assets/gltf/bigCactus.glb";
import littleCactus from "../assets/gltf/littleCactus.glb";

import cactus1 from "../assets/gltf/cactus1.glb";
import cactus2 from "../assets/gltf/cactus2.glb";
import chicken from "../assets/gltf/chicken.glb";
import bird from "../assets/gltf/bird.glb";

const TypesOfEnemies = [
  {
    obj: {
      name: "cactus1",
      gltfNum: 0,
      gltf: cactus1,
      position: { x: 0.4, y: 0.2, z: 0.4 },
      rotation: 1.5,
    },
    colider: {
      args: [1.5, 2.5, 1],
      position: { y: 0.2 },
    },
  },
  {
    obj: {
      name: "cactus2",
      gltfNum: 1,
      gltf: cactus2,
      position: { x: 0.2, y: 0, z: 0 },
      rotation: 1.5,
    },
    colider: {
      args: [0.6, 5, 1],
      position: { y: 0.4 },
    },
  },
  {
    obj: {
      name: "chicken",
      gltfNum: 2,
      gltf: chicken,
      position: { x: 0.2, y: 0, z: 0 },
      rotation: 1.5,
    },
    colider: {
      args: [0.8, 2, 1],
      position: { y: 0.5 },
    },
  },
  {
    obj: {
      name: "bird",
      gltfNum: 3,
      gltf: bird,
      position: { x: 0.2, y: -3.2, z: 0 },
      rotation: 1.5,
    },
    colider: {
      args: [0.8, 0.8, 1],
      position: { y: 5 },
    },
  },
];

/**
 * サボテン達の位置情報の作成と更新
 */
export class Enemies {
  constructor(scene, cannonPhysics) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.cannonPhysics = cannonPhysics;
    // 作成するオブジェクトの数
    this.number = 40;
    // 最初のオブジェクトを作成するx位置
    this.startX = 30;
    // このx位置になったら位置を再設定
    this.returnX = -25;
    // オブジェクト間の距離
    this.distance = 20;
    this.addMaxDistance = 30;
    // 最初の位置データを作成
    this.createEnemiesList(this.number, this.startX, this.distance);

    // オブジェクトを作成
    this.createEnemiesObj();
    scene.add(this.group);
  }

  reset() {
    // コライダーを削除
    for (var i = this.enemiesObj.length - 1; i >= 0; i--) {
      const obj = this.enemiesObj[i];
      this.cannonPhysics.world.removeBody(obj.phyBox);
    }
    // オブジェクトを削除
    this.group.remove.apply(this.group, this.group.children);
    // 最初の位置データを作成
    this.createEnemiesList(this.number, this.startX, this.distance);

    // オブジェクトを作成
    this.createEnemiesObj();
  }

  createEnemiesList(number, startX, distance) {
    this.enemiesData = [];
    for (let i = 0; i < number; i++) {
      let p = startX;
      if (i !== 0) p = this.enemiesData[i - 1].positionX + distance;

      this.enemiesData.push({
        positionX: p,
        type: TypesOfEnemies[Math.floor(Math.random() * TypesOfEnemies.length)],
      });
    }
  }

  tick(speed) {
    for (let i = 0; i < this.enemiesData.length; i++) {
      this.enemiesData[i].positionX -= speed;
      // returnXの位置まで来たらポジションを移動
      if (this.enemiesData[i].positionX < this.returnX) {
        this.enemiesData[i].positionX =
          Math.max.apply(
            null,
            this.enemiesData.map((o) => o.positionX)
          ) +
          this.distance +
          Math.random() * this.addMaxDistance;
      }
      // オブジェクトを移動
      this.enemiesObj[i].tick(this.enemiesData[i].positionX);
    }
  }

  createEnemiesObj() {
    this.enemiesObj = [];
    for (let i = 0; i < this.enemiesData.length; i++) {
      const obj = new Enemy(
        this.scene,
        this.cannonPhysics,
        this.enemiesData[i],
        this.group
      );
      this.enemiesObj.push(obj);
    }
  }
}

/**
 * サボテンを描画
 */
export class Enemy {
  constructor(scene, cannonPhysics, data, group) {
    this.data = data;
    this.group = new THREE.Group();
    this.load(data.type.obj.gltf);

    // 物理設定
    var mass = 0;
    var shape = new CANNON.Box(
      new CANNON.Vec3(
        data.type.colider.args[0] / 2,
        data.type.colider.args[1] / 2,
        data.type.colider.args[2] / 2
      )
    );
    this.phyBox = new CANNON.Body({ mass, shape });
    this.phyBox.fixedRotation = true;
    this.phyBox.name = "enemy";
    this.phyBox.position.y = this.data.type.colider.position.y;
    this.phyBox.position.x = data.positionX;
    cannonPhysics.world.add(this.phyBox);

    // 物理設定のサイズをボックスで描画
    let cubeGeometry = new THREE.BoxGeometry(
      data.type.colider.args[0],
      data.type.colider.args[1],
      data.type.colider.args[2]
    );
    let cubeMaterial = new THREE.MeshStandardMaterial({
      color: "yellow",
      transparent: true,
      opacity: 0.3,
      // コライダーを非表示
      visible: false,
    });
    this.cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    // this.cube.rotation.y = this.data.type.obj.rotation[this.randRotation];
    this.group.add(this.cube);
    group.add(this.group);
    this.group.position.copy(this.phyBox.position);
  }

  tick(x) {
    this.phyBox.position.x = x;
    // 物理更新
    this.group.position.copy(this.phyBox.position);
  }

  load(url) {
    // プレイヤー
    this.gltfLoad(url)
      .then((value) => {
        value.scene.position.copy(this.data.type.obj.position);
        value.scene.rotation.y = this.data.type.obj.rotation;
        this.group.add(value.scene);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  /**
   * GLTFLoader
   */
  gltfLoad(url) {
    return new Promise((resolve) => {
      const loader = new GLTFLoader();
      loader.load(url, (data) => {
        resolve(data);
      });
    });
  }
}
