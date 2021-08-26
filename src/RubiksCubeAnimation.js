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
    this.updateColorMiniCube = this.updateColorMiniCube.bind(this);
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
    let geometry;
    const material = new THREE.MeshBasicMaterial({vertexColors: true });
    let miniCube;
    let cubes = [];

    // Add each pieces
    for (var z = 0; z < 3; z++) {
      for (var y = 0; y < 3; y++) {
        for (var x = 0; x < 3; x++) {
          geometry = new THREE.BoxGeometry(0.45, 0.45, 0.45).toNonIndexed();

          // Color faces
          const positionAttribute = geometry.getAttribute('position');

          let colors = [];
          let color = new THREE.Color();
          
          for (let i = 0; i < positionAttribute.count / 6; i ++) {
            
            let mapIdx = {
              0: 2,
              1: 4,
              2: 0,
              3: 5,
              4: 1,
              5: 3
            }

            let minicubeColor = this.props.rubiksCube.getColor(x + 3 * y + 9 * z, mapIdx[i]);
            color.set(minicubeColor);
            
            // define the same color for each vertex of a triangle
            for (let i = 0; i < 6; i++) {
              colors.push( color.r, color.g, color.b );
            }
          }
          
          geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
          geometry.needsUpdate = true; 

          miniCube = new THREE.Mesh(geometry, material);

          miniCube.position.set(x * 0.5 - 0.5, y * 0.5 - 0.5, z * 0.5 - 0.5);
          scene.add(miniCube);
          // cubes.push(miniCube);
          cubes[x + 3 * y + 9 * z] = miniCube;
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
    if (this.props.needsUpdate) {
      this.props.toggleUpdate();
      this.updateColorMiniCube();
    }

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

  updateColorMiniCube() {
    for (let idxMiniCube = 0; idxMiniCube < this.cubes.length; idxMiniCube++) {
      let geometry = this.cubes[idxMiniCube].geometry;
      const positionAttribute = geometry.getAttribute('position');
      let colors = [];
      let color = new THREE.Color();

      for (let i = 0; i < positionAttribute.count / 6; i ++) {

        let mapIdx = {
          0: 2,
          1: 4,
          2: 0,
          3: 5,
          4: 1,
          5: 3
        }

        let minicubeColor = this.props.rubiksCube.getColor(idxMiniCube, mapIdx[i]);
        color.set(minicubeColor);
        
        for (let j = 0; j < 6; j++) {
          colors.push( color.r, color.g, color.b );
        }
      }
  
      geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    }
  }
}

export default RubiksCubeAnimation;