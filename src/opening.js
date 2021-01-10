import * as THREE from "three";
import CANNON from "cannon";
import { VOXLoader } from "three/examples/jsm/loaders/VOXLoader";
import titleVox from "../assets/vox/op.vox";

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
    this.voxGroup = new THREE.Group();
    this.voxLoad(titleVox);
    this.voxGroup.position.x = 20;
    const quaternion = new THREE.Quaternion();
    quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2);

    const vector = new THREE.Vector3(1, 0, 0);
    this.voxGroup.applyQuaternion(quaternion);
    this.voxGroup.position.z = 20;
    this.group.add(this.voxGroup);

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

  voxLoad(url) {
    let mesh = null;
    this.dummy = new THREE.Object3D();

    // ローダーを作成
    const loader = new VOXLoader();
    //大きさ
    const scale = 0.1;
    console.log("url", url);
    loader.load(url, (chunks) => {
      console.log("  chunks.length", chunks[0].data.length);

      mesh = new THREE.InstancedMesh(
        new THREE.BoxBufferGeometry(scale, scale, scale),
        new THREE.MeshStandardMaterial({
          //color: color.setRGB(r, g, b),
          transparent: true,
        }),
        chunks[0].data.length / 4
      );
      this.voxGroup.add(mesh);
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        const size = chunk.size;
        const data = chunk.data;
        let di = 0;
        for (let j = 0, k = 0; j < data.length; j += 4, k++) {
          let x = 0;
          if (data[j] >= 0) {
            x = data[j + 0] - size.x / 2;
          } else {
            x = data[j + 0] + 256 - size.x / 2;
          }
          const y = data[j + 1] - size.y / 2;
          const z = data[j + 2] - size.z / 2;
          this.dummy.position.set(x * scale, z * scale, -y * scale);
          this.dummy.updateMatrix();
          mesh.setMatrixAt(di++, this.dummy.matrix);
        }
        mesh.instanceMatrix.needsUpdate = true;
        console.log("mesh", mesh);
      }
    });
  }
}
