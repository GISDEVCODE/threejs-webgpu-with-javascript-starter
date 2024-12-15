import * as THREE from "three/webgpu"
import { OrbitControls  } from "three/addons/Addons.js"
//https://github.com/GISDEVCODE/threejs-webgpu-with-javascript-starter.git
export default class App {
  static async Create() {
    const app = new App();

    await app._setupThreeJs();
    app._setupCamera();
    app._setupLight();
    app._setupControls();
    app._setupModel();
    app._setupEvents();

    return app;
  }

  async _setupThreeJs() {
    const divContainer = document.querySelector("#canvas-container");
    this._divContainer = divContainer;

    let renderer = new THREE.WebGPURenderer({ antialias: true, forceWebGL: false });
    await renderer.init();

    renderer.setClearColor(new THREE.Color("#2c3e50"), 1);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;

    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;

    divContainer.appendChild(renderer.domElement);

    this._renderer = renderer;
    const scene = new THREE.Scene();
    this._scene = scene;
  }

  _setupCamera() {
    const width = this._divContainer.clientWidth;
    const height = this._divContainer.clientHeight;
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 10);
    camera.position.z = 3;
    this._camera = camera;
  }

  _setupLight() {
    const color = 0xffffff
    const intensity = 1
    const light = new THREE.DirectionalLight(color, intensity)
    light.position.set(-1, 2, 4)
    this._scene.add(light)
  }

  _setupModel() {
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshStandardMaterial();
    const mesh = new THREE.Mesh(geometry, material)

    this._scene.add(mesh);
    this._mesh = mesh;
  }

  _setupControls() {
    this._orbitControls = new OrbitControls(this._camera, this._divContainer);
  }

  _setupEvents() {
    window.onresize = this.resize.bind(this);
    this.resize();

    this._clock = new THREE.Clock()
    this._renderer.setAnimationLoop(this.render.bind(this));
  }

  update() {
    const delta = this._clock.getDelta();
    this._mesh.rotation.y += delta;
    this._orbitControls.update();
  }

  render() {
    this.update();
    this._renderer.render(this._scene, this._camera);
  }

  resize() {
    const width = this._divContainer.clientWidth;
    const height = this._divContainer.clientHeight;

    this._camera.aspect = width / height;
    this._camera.updateProjectionMatrix();

    this._renderer.setSize(width, height);
  }
}