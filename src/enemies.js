import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import CANNON from "cannon";

import bigCactus from "../assets/gltf/bigCactus.glb";
import littleCactus from "../assets/gltf/littleCactus.glb";

const TypesOfEnemies = [
  {
    obj: {
      name: "littleCactus",
      gltfNum: 0,
      gltf: littleCactus,
      position: { x: -2.75, y: 0.4, z: -0.2 },
      rotation: { x: 1.5 },
    },
    colider: {
      args: [1.2, 3, 1],
      // position: { y: 4 },
    },
  },
  {
    obj: {
      name: "bigCactus",
      gltfNum: 1,
      gltf: bigCactus,
      position: { x: -3.9, y: 0.4, z: -1.7 },
      rotation: { x: 1.5 },
    },
    colider: {
      args: [0.6, 5.5, 1],
      // position: { y: 0.6 },
    },
  },
];

/**
 * サボテン達の位置情報の作成と更新
 */
export class Enemies {
  constructor(scene, cannonPhysics) {
    this.scene = scene;
    this.cannonPhysics = cannonPhysics;
    // 作成するオブジェクトの数
    const number = 10;
    // 最初のオブジェクトを作成するx位置
    const startX = 30;
    // このx位置になったら位置を再設定
    this.returnX = -25;
    // オブジェクト間の距離
    this.distance = 15;
    // 移動するスピード
    // this.speed = -0.04;
    // 最初の位置データを作成
    this.createEnemiesList(number, startX, this.distance);

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
        // type: TypesOfEnemies[1],
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
          ) + this.distance;
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
        this.enemiesData[i]
      );
      this.enemiesObj.push(obj);
    }
  }
}

/**
 * サボテンを描画
 */
export class Enemy {
  constructor(scene, cannonPhysics, data) {
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
    // this.phyBox.position.y = 5;
    this.phyBox.position.x = data.positionX;
    cannonPhysics.world.add(this.phyBox);

    // 物理設定のサイズをボックスで描画
    let cubeGeometry = new THREE.BoxGeometry(
      data.type.colider.args[0],
      data.type.colider.args[1],
      data.type.colider.args[2]
    );
    let cubeMaterial = new THREE.MeshStandardMaterial({
      color: "blue",
      transparent: true,
      opacity: 0.3,
    });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    this.group.add(cube);
    scene.add(this.group);
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
