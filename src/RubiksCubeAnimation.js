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
    this.updateColorMiniCubes = this.updateColorMiniCubes.bind(this);
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

    this.queue = [];
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
      this.initMoveAnimation();
      this.props.toggleNeedsUpdate();
    }

    // Dequeue
    if (this.props.queue.length !== 0 && !this.currentMove) {
      let currentMove = this.props.queue.shift();
      console.log(`animating ${currentMove}...`);

      switch (currentMove) {
        case "U":
        case "U'":
          this.createGroup([6, 7, 8, 15, 16, 17, 24, 25, 26]);
          break;

        case "D":
        case "D'":
          this.createGroup([0, 1, 2, 9, 10, 11, 18, 19, 20]);
          break;
        
        case "F":
        case "F'":
          this.createGroup([18, 19, 20, 21, 22, 23, 24, 25, 26]);
          break;
        
        case "B":
        case "B'":
          this.createGroup([0, 1, 2, 3, 4, 5, 6, 7, 8]);
          break;
        
        case "L":
        case "L'":
          this.createGroup([0, 3, 6, 9, 12, 15, 18, 21, 24]);
          break;
        
        case "R":
        case "R'":
          this.createGroup([2, 5, 8, 11, 14, 17, 20, 23, 26]);
          break;
        
        default:
          break;
      }

      this.currentMove = currentMove;
    }

    // Animate current move
    switch (this.currentMove) {
      case "U":
        if (Math.abs(this.currentGroup.rotation.y) < Math.PI /2) {
          this.currentGroup.rotation.y -= Math.PI / 90;
        } else {
          this.props.rubiksCube.turnUpClockwise();
          this.initMoveAnimation();
        }
        break;

      case "U'":
        if (Math.abs(this.currentGroup.rotation.y) < Math.PI /2) {
          this.currentGroup.rotation.y += Math.PI / 90;
        } else {
          this.props.rubiksCube.turnUpAntiClockwise();
          this.initMoveAnimation();
        }
        break;
      
      case "D":
        if (Math.abs(this.currentGroup.rotation.y) < Math.PI /2) {
          this.currentGroup.rotation.y += Math.PI / 90;
        } else {
          this.props.rubiksCube.turnDownClockwise();
          this.initMoveAnimation();
        }
        break;
      
      case "D'":
        if (Math.abs(this.currentGroup.rotation.y) < Math.PI /2) {
          this.currentGroup.rotation.y -= Math.PI / 90;
        } else {
          this.props.rubiksCube.turnDownAntiClockwise();
          this.currentGroup.rotation.y = 0;
          this.initMoveAnimation();
        }
        break;
      
      case "F":
        if (Math.abs(this.currentGroup.rotation.z) < Math.PI /2) {
          this.currentGroup.rotation.z -= Math.PI / 90;
        } else {
          this.props.rubiksCube.turnFrontClockwise();
          this.initMoveAnimation();
        }
        break;

      case "F'":
        if (Math.abs(this.currentGroup.rotation.z) < Math.PI /2) {
          this.currentGroup.rotation.z += Math.PI / 90;
        } else {
          this.props.rubiksCube.turnFrontAntiClockwise();
          this.initMoveAnimation();
        }
        break;

      case "B":
        if (Math.abs(this.currentGroup.rotation.z) < Math.PI /2) {
          this.currentGroup.rotation.z += Math.PI / 90;
        } else {
          this.props.rubiksCube.turnBackClockwise();
          this.initMoveAnimation();
        }
        break;

      case "B'":
        if (Math.abs(this.currentGroup.rotation.z) < Math.PI /2) {
          this.currentGroup.rotation.z -= Math.PI / 90;
        } else {
          this.props.rubiksCube.turnBackAntiClockwise();
          this.initMoveAnimation();
        }
        break;

      case "L":
        if (Math.abs(this.currentGroup.rotation.x) < Math.PI /2) {
          this.currentGroup.rotation.x += Math.PI / 90;
        } else {
          this.props.rubiksCube.turnLeftClockwise();
          this.initMoveAnimation();
        }
        break;

      case "L'":
        if (Math.abs(this.currentGroup.rotation.x) < Math.PI /2) {
          this.currentGroup.rotation.x -= Math.PI / 90;
        } else {
          this.props.rubiksCube.turnLeftAntiClockwise();
          this.initMoveAnimation();
        }
        break;

      case "R":
        if (Math.abs(this.currentGroup.rotation.x) < Math.PI /2) {
          this.currentGroup.rotation.x -= Math.PI / 90;
        } else {
          this.props.rubiksCube.turnRightClockwise();
          this.initMoveAnimation();
        }
        break;

      case "R'":
        if (Math.abs(this.currentGroup.rotation.x) < Math.PI /2) {
          this.currentGroup.rotation.x += Math.PI / 90;
        } else {
          this.props.rubiksCube.turnRightAntiClockwise();
          this.initMoveAnimation();
        }
        break;

      default:
        break;
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

  updateColorMiniCubes() {
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

  createGroup(indices) {
    this.currentGroup = new THREE.Group();

    indices.forEach(i => {
      this.currentGroup.add(this.cubes[i])
    });

    this.scene.add(this.currentGroup);
  }

  initMoveAnimation() {
    this.currentMove = null;
    this.currentGroup.rotation.set(0, 0, 0);
    this.updateColorMiniCubes();
  }
}

export default RubiksCubeAnimation;