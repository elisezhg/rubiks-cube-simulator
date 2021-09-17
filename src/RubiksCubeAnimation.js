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

    // Load arrow
    const geoArrow = new THREE.BoxGeometry(0, 3, 3);
    const textureArrow1 = new THREE.TextureLoader().load("https://i.ibb.co/XsGkhwp/rotation.png");
    const matArrow1 = new THREE.MeshBasicMaterial({map: textureArrow1, color: 0xffffff, transparent: true, opacity: 0.7});
    const arrow1 = new THREE.Mesh(geoArrow, matArrow1);

    const textureArrow2 = new THREE.TextureLoader().load("https://i.ibb.co/20zNt2s/rotation2.png");
    const matArrow2 = new THREE.MeshBasicMaterial({map: textureArrow2, color: 0xffffff, transparent: true, opacity: 0.7});
    const arrow2 = new THREE.Mesh(geoArrow, matArrow2);

    // Ortbit Controls
		const orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.enablePan = false;

    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.material = material;
    this.orbitControls = orbitControls;

    this.arrow1 = arrow1;
    this.arrow2 = arrow2;
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

    // If a move button is hovered, we display the arrow
    if (this.props.hoveredMove && !this.displayedArrow) {
      this.showArrow();
    // otherwise, we remove the arrow
    } else if (!this.props.hoveredMove && this.displayedArrow) {
      this.scene.remove(this.displayedArrow);
      this.displayedArrow = null;
    }

    this.dequeue();
    this.animateCurrentMove();

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

  dequeue() {
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
  }

  animateCurrentMove() {
    switch (this.currentMove) {
      case "U":
        if (Math.abs(this.currentGroup.rotation.y) < Math.PI / 2) {
          this.currentGroup.rotation.y -= Math.PI * this.props.rotationSpeed;
          this.arrow2.rotation.y -= Math.PI * this.props.rotationSpeed;
        } else {
          this.props.rubiksCube.turnUpClockwise();
          this.initMoveAnimation();
        }
        break;

      case "U'":
        if (Math.abs(this.currentGroup.rotation.y) < Math.PI / 2) {
          this.currentGroup.rotation.y += Math.PI * this.props.rotationSpeed;
          this.arrow1.rotation.y += Math.PI * this.props.rotationSpeed;
        } else {
          this.props.rubiksCube.turnUpAntiClockwise();
          this.initMoveAnimation();
        }
        break;
      
      case "D":
        if (Math.abs(this.currentGroup.rotation.y) < Math.PI / 2) {
          this.currentGroup.rotation.y += Math.PI * this.props.rotationSpeed;
          this.arrow2.rotation.y += Math.PI * this.props.rotationSpeed;
        } else {
          this.props.rubiksCube.turnDownClockwise();
          this.initMoveAnimation();
        }
        break;
      
      case "D'":
        if (Math.abs(this.currentGroup.rotation.y) < Math.PI / 2) {
          this.currentGroup.rotation.y -= Math.PI * this.props.rotationSpeed;
          this.arrow1.rotation.y -= Math.PI * this.props.rotationSpeed;
        } else {
          this.props.rubiksCube.turnDownAntiClockwise();
          this.initMoveAnimation();
        }
        break;
      
      case "F":
        if (Math.abs(this.currentGroup.rotation.z) < Math.PI / 2) {
          this.currentGroup.rotation.z -= Math.PI * this.props.rotationSpeed;
          this.arrow2.rotation.z -= Math.PI * this.props.rotationSpeed;
        } else {
          this.props.rubiksCube.turnFrontClockwise();
          this.initMoveAnimation();
        }
        break;

      case "F'":
        if (Math.abs(this.currentGroup.rotation.z) < Math.PI / 2) {
          this.currentGroup.rotation.z += Math.PI * this.props.rotationSpeed;
          this.arrow1.rotation.z += Math.PI * this.props.rotationSpeed;
        } else {
          this.props.rubiksCube.turnFrontAntiClockwise();
          this.initMoveAnimation();
        }
        break;

      case "B":
        if (Math.abs(this.currentGroup.rotation.z) < Math.PI / 2) {
          this.currentGroup.rotation.z += Math.PI * this.props.rotationSpeed;
          this.arrow2.rotation.z += Math.PI * this.props.rotationSpeed;
        } else {
          this.props.rubiksCube.turnBackClockwise();
          this.initMoveAnimation();
        }
        break;

      case "B'":
        if (Math.abs(this.currentGroup.rotation.z) < Math.PI / 2) {
          this.currentGroup.rotation.z -= Math.PI * this.props.rotationSpeed;
          this.arrow1.rotation.z -= Math.PI * this.props.rotationSpeed;
        } else {
          this.props.rubiksCube.turnBackAntiClockwise();
          this.initMoveAnimation();
        }
        break;

      case "L":
        if (Math.abs(this.currentGroup.rotation.x) < Math.PI / 2) {
          this.currentGroup.rotation.x += Math.PI * this.props.rotationSpeed;
          this.arrow2.rotation.x += Math.PI * this.props.rotationSpeed;
        } else {
          this.props.rubiksCube.turnLeftClockwise();
          this.initMoveAnimation();
        }
        break;

      case "L'":
        if (Math.abs(this.currentGroup.rotation.x) < Math.PI / 2) {
          this.currentGroup.rotation.x -= Math.PI * this.props.rotationSpeed;
          this.arrow1.rotation.x -= Math.PI * this.props.rotationSpeed;
        } else {
          this.props.rubiksCube.turnLeftAntiClockwise();
          this.initMoveAnimation();
        }
        break;

      case "R":
        if (Math.abs(this.currentGroup.rotation.x) < Math.PI / 2) {
          this.currentGroup.rotation.x -= Math.PI * this.props.rotationSpeed;
          this.arrow2.rotation.x -= Math.PI * this.props.rotationSpeed;
        } else {
          this.props.rubiksCube.turnRightClockwise();
          this.initMoveAnimation();
        }
        break;

      case "R'":
        if (Math.abs(this.currentGroup.rotation.x) < Math.PI / 2) {
          this.currentGroup.rotation.x += Math.PI * this.props.rotationSpeed;
          this.arrow1.rotation.x += Math.PI * this.props.rotationSpeed;
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

  showArrow() {    
    switch (this.props.hoveredMove) {
      case "U":
        this.arrow2.geometry = new THREE.BoxGeometry(3, 0, 3);
        this.arrow2.position.set(0, 1.55, 0);
        this.displayedArrow = this.arrow2;
        break;

      case "U'":
        this.arrow1.geometry = new THREE.BoxGeometry(3, 0, 3);
        this.arrow1.position.set(0, 1.55, 0);
        this.displayedArrow = this.arrow1;
        break;
      
      case "D":
        this.arrow2.geometry = new THREE.BoxGeometry(3, 0, 3);
        this.arrow2.position.set(0, -1.55, 0);
        this.displayedArrow = this.arrow2;
        break;
      
      case "D'":
        this.arrow1.geometry = new THREE.BoxGeometry(3, 0, 3);
        this.arrow1.position.set(0, -1.55, 0);
        this.displayedArrow = this.arrow1;
        break;
      
      case "F":
        this.arrow2.geometry = new THREE.BoxGeometry(3, 3, 0);
        this.arrow2.position.set(0, 0, 1.55);
        this.displayedArrow = this.arrow2;
        break;

      case "F'":
        this.arrow1.geometry = new THREE.BoxGeometry(3, 3, 0);
        this.arrow1.position.set(0, 0, 1.55);
        this.displayedArrow = this.arrow1;
        break;

      case "B":
        this.arrow2.geometry = new THREE.BoxGeometry(3, 3, 0);
        this.arrow2.position.set(0, 0, -1.55);
        this.displayedArrow = this.arrow2;
        break;

      case "B'":
        this.arrow1.geometry = new THREE.BoxGeometry(3, 3, 0);
        this.arrow1.position.set(0, 0, -1.55);
        this.displayedArrow = this.arrow1;
        break;

      case "L":
        this.arrow2.geometry = new THREE.BoxGeometry(0, 3, 3);
        this.arrow2.position.set(-1.55, 0, 0);
        this.displayedArrow = this.arrow2;
        break;

      case "L'":
        this.arrow1.geometry = new THREE.BoxGeometry(0, 3, 3);
        this.arrow1.position.set(-1.55, 0, 0);
        this.displayedArrow = this.arrow1;
        break;

      case "R":
        this.arrow2.geometry = new THREE.BoxGeometry(0, 3, 3);
        this.arrow2.position.set(1.55, 0, 0);
        this.displayedArrow = this.arrow2;
        break;

      case "R'":
        this.arrow1.geometry = new THREE.BoxGeometry(0, 3, 3);
        this.arrow1.position.set(1.55, 0, 0);
        this.displayedArrow = this.arrow1;
        break;

      default:
        break;
    }

    this.displayedArrow.geometry.needsUpdate = true;
    this.scene.add(this.displayedArrow);
    this.displayedArrow.rotation.set(0, 0, 0);
  }
}

export default RubiksCubeAnimation;