import React, { Component } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DragControls } from 'three/examples/jsm/controls/DragControls';

class RubiksCubeAnimation extends Component {
  constructor(props) {
    super(props);

    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.animate = this.animate.bind(this);
  }

  componentDidMount() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    let geometry = new THREE.BoxGeometry(0.4, 0.4, 0.4);
    let material;

    let cubes = [];

    // Add each pieces
    for (var x = 0; x < 3; x++) {
      for (var y = 0; y < 3; y++) {
        for (var z = 0; z < 3; z++) {

          material = new THREE.MeshNormalMaterial({ color: Math.random() * 0xffffff  })
          let miniCube = new THREE.Mesh(geometry, material);

          miniCube.position.x = x * 0.5 - 0.5;
          miniCube.position.y = y * 0.5 - 0.5;
          miniCube.position.z = z * 0.5 - 0.5;

          scene.add(miniCube);
          cubes.push(miniCube);
        }
      }
    }

    camera.position.z = 3;
    renderer.setSize(width, height);

    // Ortbit Controls
		const orbitControls = new OrbitControls( camera, renderer.domElement );
    orbitControls.rotateSpeed = 0.4;
    
    // Drag Controls
		const dragControls = new DragControls( cubes, camera, renderer.domElement );
    dragControls.addEventListener( 'dragstart', function () { orbitControls.enabled = false; } );
		dragControls.addEventListener( 'dragend', function () { orbitControls.enabled = true; } );

    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.material = material;
    this.cubes = cubes;
    this.orbitControls = orbitControls;
    this.dragControls = dragControls;

    this.mount.appendChild(this.renderer.domElement);
    this.start();
  }

  componentWillUnmount() {
    this.stop();
    this.mount.removeChild(this.renderer.domElement);
  }

  start() {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate);
    }
  }

  stop() {
    cancelAnimationFrame(this.frameId);
  }

  animate() {
    this.cubes[8].rotation.x += 0.01;
    this.cubes[8].rotation.y += 0.05;

    this.renderScene(this.scene, this.camera);
    this.frameId = window.requestAnimationFrame(this.animate);
  }

  renderScene() {
    this.renderer.render(this.scene, this.camera);
  }

  render() {
    return (
      <div
        style={{ width: '400px', height: '400px' }}
        ref={(mount) => { this.mount = mount }}
      />
    )
  }
}

export default RubiksCubeAnimation;