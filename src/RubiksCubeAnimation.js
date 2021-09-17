import React, { Component } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

class RubiksCubeAnimation extends Component {
  constructor(props) {
    super(props);

    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.animate = this.animate.bind(this);
    this.updateColorMiniCubes = this.updateColorMiniCubes.bind(this);
    this.resizeCanvasToDisplaySize = this.resizeCanvasToDisplaySize.bind(this);
  }

  componentDidMount() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfffdd0);
    
    const renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(width, height, false);

    const camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      1000
    );
    camera.position.set(5, 3, 5);

    let geometry;
    const material = new THREE.MeshBasicMaterial({vertexColors: true});
    let miniCube;
    let cubes = [];
    let cubeBorders = [];

    // Add each pieces
    for (var z = 0; z < 3; z++) {
      for (var y = 0; y < 3; y++) {
        for (var x = 0; x < 3; x++) {
          let idx = x + 3 * y + 9 * z;

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

            let minicubeColor = this.props.rubiksCube.getColor(idx, mapIdx[i]);
            color.set(minicubeColor);
            
            // define the same color for each vertex of a triangle
            for (let i = 0; i < 6; i++) {
              colors.push( color.r, color.g, color.b );
            }
          }
          
          geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
          geometry.needsUpdate = true; 

          miniCube = new THREE.Mesh(geometry, material);

          miniCube.position.set(x - 1, y - 1, z - 1);
          scene.add(miniCube);
          cubes[idx] = miniCube;

          // Cube Border
          const thresholdAngle = 15;
          const edges = new THREE.EdgesGeometry(geometry, thresholdAngle);
          const line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial({color: 0x000000, linewidth: 2}));
          
          line.position.set(x - 1, y - 1, z - 1);
          scene.add(line);
          cubeBorders[idx] = line;
        }
      }
    }

    // Ortbit Controls
		const orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.enablePan = false;

    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.material = material;
    this.orbitControls = orbitControls;

    this.cubes = cubes;
    this.cubeBorders = cubeBorders;

    this.mount.appendChild(this.renderer.domElement);
    this.start();

    this.queue = [];

    window.addEventListener("resize", this.resizeCanvasToDisplaySize, false);
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
        
        case "X2":
        case "Y2":
          let indices = [];
          for (var i = 0; i < this.cubes.length; i++) indices.push(i);
          this.createGroup(indices);
          break;
        
        default:
          break;
      }

      this.currentMove = currentMove;
    }

    // Animate current move
    switch (this.currentMove) {
      case "U":
        if (Math.abs(this.currentGroup.rotation.y) < Math.PI / 2) {
          this.currentGroup.rotation.y -= Math.PI * this.props.rotationSpeed;
        } else {
          this.props.rubiksCube.turnUpClockwise();
          this.initMoveAnimation();
        }
        break;

      case "U'":
        if (Math.abs(this.currentGroup.rotation.y) < Math.PI / 2) {
          this.currentGroup.rotation.y += Math.PI * this.props.rotationSpeed;
        } else {
          this.props.rubiksCube.turnUpAntiClockwise();
          this.initMoveAnimation();
        }
        break;
      
      case "D":
        if (Math.abs(this.currentGroup.rotation.y) < Math.PI / 2) {
          this.currentGroup.rotation.y += Math.PI * this.props.rotationSpeed;
        } else {
          this.props.rubiksCube.turnDownClockwise();
          this.initMoveAnimation();
        }
        break;
      
      case "D'":
        if (Math.abs(this.currentGroup.rotation.y) < Math.PI / 2) {
          this.currentGroup.rotation.y -= Math.PI * this.props.rotationSpeed;
        } else {
          this.props.rubiksCube.turnDownAntiClockwise();
          this.initMoveAnimation();
        }
        break;
      
      case "F":
        if (Math.abs(this.currentGroup.rotation.z) < Math.PI / 2) {
          this.currentGroup.rotation.z -= Math.PI * this.props.rotationSpeed;
        } else {
          this.props.rubiksCube.turnFrontClockwise();
          this.initMoveAnimation();
        }
        break;

      case "F'":
        if (Math.abs(this.currentGroup.rotation.z) < Math.PI / 2) {
          this.currentGroup.rotation.z += Math.PI * this.props.rotationSpeed;
        } else {
          this.props.rubiksCube.turnFrontAntiClockwise();
          this.initMoveAnimation();
        }
        break;

      case "B":
        if (Math.abs(this.currentGroup.rotation.z) < Math.PI / 2) {
          this.currentGroup.rotation.z += Math.PI * this.props.rotationSpeed;
        } else {
          this.props.rubiksCube.turnBackClockwise();
          this.initMoveAnimation();
        }
        break;

      case "B'":
        if (Math.abs(this.currentGroup.rotation.z) < Math.PI / 2) {
          this.currentGroup.rotation.z -= Math.PI * this.props.rotationSpeed;
        } else {
          this.props.rubiksCube.turnBackAntiClockwise();
          this.initMoveAnimation();
        }
        break;

      case "L":
        if (Math.abs(this.currentGroup.rotation.x) < Math.PI / 2) {
          this.currentGroup.rotation.x += Math.PI * this.props.rotationSpeed;
        } else {
          this.props.rubiksCube.turnLeftClockwise();
          this.initMoveAnimation();
        }
        break;

      case "L'":
        if (Math.abs(this.currentGroup.rotation.x) < Math.PI / 2) {
          this.currentGroup.rotation.x -= Math.PI * this.props.rotationSpeed;
        } else {
          this.props.rubiksCube.turnLeftAntiClockwise();
          this.initMoveAnimation();
        }
        break;

      case "R":
        if (Math.abs(this.currentGroup.rotation.x) < Math.PI / 2) {
          this.currentGroup.rotation.x -= Math.PI * this.props.rotationSpeed;
        } else {
          this.props.rubiksCube.turnRightClockwise();
          this.initMoveAnimation();
        }
        break;

      case "R'":
        if (Math.abs(this.currentGroup.rotation.x) < Math.PI / 2) {
          this.currentGroup.rotation.x += Math.PI * this.props.rotationSpeed;
        } else {
          this.props.rubiksCube.turnRightAntiClockwise();
          this.initMoveAnimation();
        }
        break;

      case "X2":
        if (Math.abs(this.currentGroup.rotation.z) < Math.PI) {
          this.currentGroup.rotation.z -= Math.PI * this.props.rotationSpeed;
        } else {
          this.props.rubiksCube.turnXAxis();
          this.initMoveAnimation();
        }
        break;

      case "Y2":
        if (Math.abs(this.currentGroup.rotation.y) < Math.PI) {
          this.currentGroup.rotation.y -= Math.PI * this.props.rotationSpeed;
        } else {
          this.props.rubiksCube.turnYAxis();
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
        ref={(mount) => { this.mount = mount }}
      />
      )
  }

  // From Stackoverflow: https://stackoverflow.com/questions/45041158/resizing-canvas-webgl-to-fit-screen-width-and-heigh
  resizeCanvasToDisplaySize(force) {
    const canvas = this.renderer.domElement;
    const width = window.innerWidth;
    const height = window.innerHeight;
  
    if (force || canvas.width !== width || canvas.height !== height) {
      this.renderer.setSize(width, height, false);
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    }
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
      this.currentGroup.add(this.cubeBorders[i])
    });

    this.scene.add(this.currentGroup);
  }

  initMoveAnimation() {
    this.currentMove = null;
    if (this.currentGroup) this.currentGroup.rotation.set(0, 0, 0);
    this.updateColorMiniCubes();
  }
}

export default RubiksCubeAnimation;