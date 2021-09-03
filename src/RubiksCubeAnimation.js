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

    const renderer = new THREE.WebGLRenderer({antialias: true});
    let geometry;
    const material = new THREE.MeshBasicMaterial({vertexColors: true});
    let miniCube;
    let cubes = [];

    // Add each pieces
    for (var z = 0; z < 3; z++) {
      for (var y = 0; y < 3; y++) {
        for (var x = 0; x < 3; x++) {
          geometry = new THREE.BoxGeometry(1, 1, 1).toNonIndexed();

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

          // miniCube.position.set(x * 0.5 - 0.5, y * 0.5 - 0.5, z * 0.5 - 0.5);
          miniCube.position.set(x - 1, y - 1, z - 1);
          scene.add(miniCube);
          // cubes.push(miniCube);
          cubes[x + 3 * y + 9 * z] = miniCube;
        }
      }
    }

    camera.position.z = 8;
    renderer.setSize(width, height);

    // Ortbit Controls
		const orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.rotateSpeed = 0.4;
    
    // Drag Controls
    let groups = [];
    this.groups = groups;
		const dragControls = new DragControls(groups, camera, renderer.domElement);
    dragControls.addEventListener('dragstart', function () {orbitControls.enabled = false;});
		dragControls.addEventListener('dragend', function () {orbitControls.enabled = true;});
		// dragControls.addEventListener('drag', function (event) {event.object.position.z = 0; event.object.position.x = 0;});
    // dragControls.transformGroup = true;

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
    // F
    if (this.props.animateFrontClockwise) {
      this.createFrontGroup();
      if (Math.abs(this.FrontGroup.rotation.z) < Math.PI /2) {
        this.FrontGroup.rotation.z -= Math.PI / 90;
      } else {
        this.props.toggle("animateFrontClockwise");
        this.FrontGroup.rotation.z = 0;
        this.updateColorMiniCube();
        this.FrontGroup.remove(9);
      }
    // L
    } else if (this.props.animateLeftClockwise) {
      this.createLeftGroup();
      if (Math.abs(this.LeftGroup.rotation.x) < Math.PI /2) {
        this.LeftGroup.rotation.x += Math.PI / 90;
      } else {
        this.props.toggle("animateLeftClockwise");
        this.LeftGroup.rotation.x = 0;
        this.updateColorMiniCube();
        this.LeftGroup.remove(9);
      }
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

  createUpGroup() {
    if (this.UpGroup != null) return;
    this.UpGroup = new THREE.Group();
    this.UpGroup.add(
      this.cubes[6], this.cubes[7], this.cubes[8],
      this.cubes[15], this.cubes[16], this.cubes[17],
      this.cubes[24], this.cubes[25], this.cubes[26]
    );
    this.scene.add(this.UpGroup);
    this.UpGroup.position.set(0, 0, 0);
    this.groups.push(this.UpGroup);
  }

  createDownGroup() {
    if (this.DownGroup != null) return;
    this.DownGroup = new THREE.Group();
    this.DownGroup.add(
      this.cubes[0], this.cubes[1], this.cubes[2],
      this.cubes[9], this.cubes[10], this.cubes[11],
      this.cubes[18], this.cubes[19], this.cubes[20]
    );
    this.scene.add(this.DownGroup);
    this.DownGroup.position.set(0, 0, 0);
    this.groups.push(this.DownGroup);
  }

  createLeftGroup() {
    if (this.LeftGroup != null) return;
    this.LeftGroup = new THREE.Group();
    this.LeftGroup.add(
      this.cubes[0], this.cubes[3], this.cubes[6],
      this.cubes[9], this.cubes[12], this.cubes[15],
      this.cubes[18], this.cubes[21], this.cubes[24]
    );
    this.scene.add(this.LeftGroup);
    this.LeftGroup.position.set(0, 0, 0);
    this.groups.push(this.LeftGroup);
  }

  createRightGroup() {
    if (this.RightGroup != null) return;
    this.RightGroup = new THREE.Group();
    this.RightGroup.add(
      this.cubes[2], this.cubes[5], this.cubes[8],
      this.cubes[11], this.cubes[14], this.cubes[17],
      this.cubes[20], this.cubes[23], this.cubes[26]
    );
    this.scene.add(this.RightGroup);
    this.RightGroup.position.set(0, 0, 0);
    this.groups.push(this.RightGroup);
  }

  createFrontGroup() {
    if (this.FrontGroup != null) return;
    this.FrontGroup = new THREE.Group();
    this.FrontGroup.add(
      this.cubes[18], this.cubes[19], this.cubes[20],
      this.cubes[21], this.cubes[22], this.cubes[23],
      this.cubes[24], this.cubes[25], this.cubes[26]
    );
    this.scene.add(this.FrontGroup);
    this.FrontGroup.position.set(0, 0, 0);
    this.groups.push(this.FrontGroup);
  }

  createBackGroup() {
    if (this.BackGroup != null) return;
    this.BackGroup = new THREE.Group();
    this.BackGroup.add(
      this.cubes[0], this.cubes[1], this.cubes[2],
      this.cubes[3], this.cubes[4], this.cubes[5],
      this.cubes[6], this.cubes[7], this.cubes[8]
    );
    this.scene.add(this.BackGroup);
    this.BackGroup.position.set(0, 0, 0);
    this.groups.push(this.BackGroup);
  }
}

export default RubiksCubeAnimation;