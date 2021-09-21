import React, { Component } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import FaceMovement from './FaceMovement';

class RubiksCubeAnimation extends Component {
  constructor(props) {
    super(props);

    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.animate = this.animate.bind(this);
    this.updateColorMiniCubes = this.updateColorMiniCubes.bind(this);
    this.resizeCanvasToDisplaySize = this.resizeCanvasToDisplaySize.bind(this);
    this.pointerDown = this.pointerDown.bind(this);
    this.pointerUp = this.pointerUp.bind(this);
    this.pointerMove = this.pointerMove.bind(this);
    this.getIndexMiniCube = this.getIndexMiniCube.bind(this);
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
    camera.lookAt(0, 0, 0);
    this.cameraTarget = new THREE.Vector3(0, 3, 7);


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
    orbitControls.rotateSpeed = 0.4;
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

    window.addEventListener("resize", this.resizeCanvasToDisplaySize, false);

    this.getFrontFace();

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.draggable = null;
    this.directionVector = new THREE.Vector2();
    this.FM = new FaceMovement();
  
    window.addEventListener("pointerdown", this.pointerDown, false);
    window.addEventListener("pointerup", this.pointerUp, false);
    window.addEventListener("pointermove", this.pointerMove, false);
  }

  getIndexMiniCube(miniCube) {
    return this.cubes.indexOf(miniCube);
  }

  getFaceMiniCube(normal) {
    if (normal.x === 1) {
      return 2;
    } else if (normal.x === -1) {
      return 4;
    } else if (normal.y === 1) {
      return 0;
    } else if (normal.y === -1) {
      return 5;
    } else if (normal.z === 1) {
      return 1;
    } else {
      return 3;
    }
  }

  pointerDown(event) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    
    this.raycaster.setFromCamera(this.mouse, this.camera);
    let intersects = this.raycaster.intersectObjects(this.cubes);

    // If the cube is selected and there's no current move
    if (intersects.length > 0) {

      // Disable Orbit Controls
      this.orbitControls.enabled = false;
      this.orbitControls.saveState();
      
      if (!this.currentMove) {
        let idxMiniCube = this.getIndexMiniCube(intersects[0].object);
        let faceMiniCube = this.getFaceMiniCube(intersects[0].face.normal);
        this.possibleMoves = this.FM.getPossibleMoves(idxMiniCube, faceMiniCube);
  
        this.selectedFace = faceMiniCube;
        this.draggable = true;

        this.oldX = this.mouse.x;
        this.oldY = this.mouse.y;
      }
    }
  }
  
  pointerUp() {
    if (this.draggable) {
      
      // Enable Orbit Controls
      // this.orbitControls.reset();
      // this.orbitControls.enabled = true;

      this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
      this.orbitControls.rotateSpeed = 0.4;
      this.orbitControls.enablePan = false;

      // Set the current move to trigger the animation
      this.currentMove = this.direction;
      
      // Reset
      this.possibleMoves = null;
      this.direction = null;
      this.draggable = null;
    }
  }

  getFrontFace() {
    const idxFaces = [16, 22, 14, 4, 12, 10];

    let frontFace;
    let distanceMin = Infinity;

    idxFaces.forEach(idx => {
      const distance = this.camera.position.distanceTo(this.cubes[idx].position);

      if (distance < distanceMin) {
        distanceMin = distance;
        frontFace = idx;
      }
    })

    return idxFaces.indexOf(frontFace);
  }

  pointerMove(event) {
    const currentFrontFace = this.getFrontFace();

    if (currentFrontFace !== 1 && !this.currentMove && !this.animating && this.props.queue.length === 0) {
      if (currentFrontFace === 4) {
        this.props.rubiksCube.turnYAxisAntiClockwise();
        this.camera.position.x *= -1;

      } else if (currentFrontFace === 0) {
        this.animating = true;
        this.currentMove = "X'";
        this.cameraTarget.x = this.camera.position.x;
        this.cameraTarget.z = this.camera.position.z < 4? this.camera.position.z + 3 : 7;
        this.createGroup(this.FM.getIndices(this.currentMove));

      } else if (currentFrontFace === 5) {
        this.animating = true;
        this.currentMove = "X";
        this.cameraTarget.x = this.camera.position.x;
        this.cameraTarget.z = this.camera.position.z < 4? this.camera.position.z + 3 : 7;
        this.createGroup(this.FM.getIndices(this.currentMove));

      } else if (currentFrontFace === 3) {
        this.props.rubiksCube.turnYAxis();
        this.camera.position.x *= -1;
        this.camera.position.z *= -1;
      }
      
      this.orbitControls.update();
      this.updateColorMiniCubes();      
    }

    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    
    this.raycaster.setFromCamera(this.mouse, this.camera);
    
    this.diffX = this.mouse.x - this.oldX;
    this.diffY = this.mouse.y - this.oldY;

    if (this.draggable && this.props.queue.length === 0) {

      // Determines the direction vector
      if (!this.currentGroup) {
        this.directionVector.set(
          Math.abs(this.diffX) > Math.abs(this.diffY)? (this.diffX > 0? 1 : -1) : 0,
          Math.abs(this.diffY) > Math.abs(this.diffX)? (this.diffY > 0? 1 : -1) : 0
        );
      } else {
        this.directionVector.set(
          this.diffX > 0? 1 : -1,
          this.diffY > 0? 1 : -1
        );
      }
      
      this.possibleDirections = this.FM.getPossibleMovesFromDirection(this.directionVector, this.selectedFace);

      // with the direction, determine the possible move (only one possible)
      this.direction = this.possibleDirections.filter(value => this.possibleMoves.includes(value))[0];
      if (this.direction) this.possibleMoves = [this.direction.slice(0, 1), this.direction.slice(0, 1) + "'"]; // Limit future possible moves
      
      // if the current group is not created yet:
      if (!this.currentGroup && this.direction) {
        this.createGroup(this.FM.getIndices(this.direction));
        this.draggable = this.currentGroup;

      } else if (this.currentGroup) {
        // rotation of the group to the direction
        if (Math.abs(this.currentGroup.rotation.x) < Math.PI / 2 &&
            Math.abs(this.currentGroup.rotation.y) < Math.PI / 2 &&
            Math.abs(this.currentGroup.rotation.z) < Math.PI / 2) {
          switch(this.direction) {
            case "L":
            case "L'":
            case "R":
            case "R'":
              this.draggable.rotation.x = -this.mouse.y;
              break;
            case "U":
            case "U'":
            case "D":
            case "D'":    
            this.draggable.rotation.y = this.mouse.x;
              break;
            case "F":
            case "F'":
            case "B":
            case "B'":    
              this.draggable.rotation.z =  Math.abs(this.mouse.x) > Math.abs(this.mouse.y)? this.mouse.x : this.mouse.y;
                break;
            default:
              break;
          }
        }
      }
    }

    this.oldX = this.mouse.x;
    this.oldY = this.mouse.y;
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
    if (this.animating) {
      this.camera.lookAt(0, 0, 0);
      this.camera.position.lerp(this.cameraTarget, 10 * this.props.rotationSpeed);

      if (this.camera.position.distanceTo(this.cameraTarget) < 0.05) this.animating = false;
    }

    if (this.props.needsUpdate) {
      this.initMoveAnimation();
      this.props.toggleNeedsUpdate();
    }

    // If a move button is hovered, we display the arrow
    if (this.props.hoveredMove && !this.displayedArrow && !this.draggable) {
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

      this.createGroup(this.FM.getIndices(currentMove));

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

      case "Y":
        if (Math.abs(this.currentGroup.rotation.y) < Math.PI / 2) {
          this.currentGroup.rotation.y -= Math.PI * this.props.rotationSpeed;
        } else {
          this.props.rubiksCube.turnYAxisClockwise();
          this.initMoveAnimation();
        }
        break;

      case "Y'":
        if (Math.abs(this.currentGroup.rotation.y) < Math.PI / 2) {
          this.currentGroup.rotation.y += Math.PI * this.props.rotationSpeed;
        } else {
          this.props.rubiksCube.turnYAxisAntiClockwise();
          this.initMoveAnimation();
        }
        break;
      
      case "X":
        if (Math.abs(this.currentGroup.rotation.x) < Math.PI / 2) {
          this.currentGroup.rotation.x -= Math.PI * this.props.rotationSpeed;
        } else {
          this.props.rubiksCube.turnXAxisClockwise();
          this.initMoveAnimation();
        }
        break;

      case "X'":
        if (Math.abs(this.currentGroup.rotation.x) < Math.PI / 2) {
          this.currentGroup.rotation.x += Math.PI * this.props.rotationSpeed;
        } else {
          this.props.rubiksCube.turnXAxisAntiClockwise();
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
    this.currentGroup = null;
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