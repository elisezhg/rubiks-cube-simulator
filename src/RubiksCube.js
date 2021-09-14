class RubiksCube {
  constructor() {
    this.initState();

    this.miniCubesMapping = {
      0: [null, null, null, 8, 6, 6],
      1: [null, null, null, 7, null, 7],
      2: [null, null, 8, 6, null, 8],
      3: [null, null, null, 5, 3, null],
      4: [null, null, null, 4, null, null],
      5: [null, null, 5, 3, null, null],
      6: [0, null, null, 2, 0, null],
      7: [1, null, null, 1, null, null],
      8: [2, null, 2, 0, null, null],
      9: [null, null, null, null, 7, 3],
      10: [null, null, null, null, null, 4],
      11: [null, null, 7, null, null, 5],
      12: [null, null, null, null, 4, null],
      13: [null, null, null, null, null, null],
      14: [null, null, 4, null, null, null],
      15: [3, null, null, null, 1, null],
      16: [4, null, null, null, null, null],
      17: [5, null, 1, null, null, null],
      18: [null, 6, null, null, 8, 0],
      19: [null, 7, null, null, null, 1],
      20: [null, 8, 6, null, null, 2],
      21: [null, 3, null, null, 5, null],
      22: [null, 4, null, null, null, null],
      23: [null, 5, 3, null, null, null],
      24: [6, 0, null, null, 2, null],
      25: [7, 1, null, null, null, null],
      26: [8, 2, 0, null, null, null]
    };

    this.size = 3;
  }

  initState() {
    this.state = [
      Array(9).fill(0xffffff), // White
      Array(9).fill(0x00ff00), // Green
      Array(9).fill(0xff0000), // Red
      Array(9).fill(0x0000ff), // Blue
      Array(9).fill(0xffa500), // Orange
      Array(9).fill(0xffff00)  // Yellow
    ];
  }

  getState() {
    return this.state;
  }

  getSize() {
    return this.size;
  }

  getColor(miniCubeIndex, faceIndex) {
    let colorIndex = this.miniCubesMapping[miniCubeIndex][faceIndex];
    return colorIndex != null? this.state[faceIndex][colorIndex] : 0x000000;
  }

  turnFrontClockwise() {
    let tmp1 = this.state[0][6];
    let tmp2 = this.state[0][7];
    let tmp3 = this.state[0][8];

    this.state[0][6] = this.state[4][8];
    this.state[0][7] = this.state[4][5];
    this.state[0][8] = this.state[4][2];

    this.state[4][2] = this.state[5][0];
    this.state[4][5] = this.state[5][1];
    this.state[4][8] = this.state[5][2];

    this.state[5][0] = this.state[2][6];
    this.state[5][1] = this.state[2][3];
    this.state[5][2] = this.state[2][0];

    this.state[2][0] = tmp1;
    this.state[2][3] = tmp2;
    this.state[2][6] = tmp3;

    this.turnFaceClockwise(1);
  }

  turnFrontAntiClockwise() {
    let tmp1 = this.state[0][6];
    let tmp2 = this.state[0][7];
    let tmp3 = this.state[0][8];

    this.state[0][6] = this.state[2][0];
    this.state[0][7] = this.state[2][3];
    this.state[0][8] = this.state[2][6];

    this.state[2][0] = this.state[5][2];
    this.state[2][3] = this.state[5][1];
    this.state[2][6] = this.state[5][0];

    this.state[5][0] = this.state[4][2];
    this.state[5][1] = this.state[4][5];
    this.state[5][2] = this.state[4][8];

    this.state[4][8] = tmp1;
    this.state[4][5] = tmp2;
    this.state[4][2] = tmp3;

    this.turnFaceAntiClockwise(1);
  }
  
  turnBackClockwise() {
    let tmp1 = this.state[0][0];
    let tmp2 = this.state[0][1];
    let tmp3 = this.state[0][2];

    this.state[0][0] = this.state[2][2];
    this.state[0][1] = this.state[2][5];
    this.state[0][2] = this.state[2][8];

    this.state[2][2] = this.state[5][8];
    this.state[2][5] = this.state[5][7];
    this.state[2][8] = this.state[5][6];

    this.state[5][6] = this.state[4][0];
    this.state[5][7] = this.state[4][3];
    this.state[5][8] = this.state[4][6];

    this.state[4][6] = tmp1;
    this.state[4][3] = tmp2;
    this.state[4][0] = tmp3;

    this.turnFaceClockwise(3);
  }

  turnBackAntiClockwise() {
    let tmp1 = this.state[0][0];
    let tmp2 = this.state[0][1];
    let tmp3 = this.state[0][2];

    this.state[0][0] = this.state[4][6];
    this.state[0][1] = this.state[4][3];
    this.state[0][2] = this.state[4][0];

    this.state[4][0] = this.state[5][6];
    this.state[4][3] = this.state[5][7];
    this.state[4][6] = this.state[5][8];

    this.state[5][6] = this.state[2][8];
    this.state[5][7] = this.state[2][5];
    this.state[5][8] = this.state[2][2];

    this.state[2][2] = tmp1;
    this.state[2][5] = tmp2;
    this.state[2][8] = tmp3;

    this.turnFaceAntiClockwise(3);
  }

  turnLeftClockwise() {
    let tmp1 = this.state[0][0];
    let tmp2 = this.state[0][3];
    let tmp3 = this.state[0][6];

    this.state[0][0] = this.state[3][8];
    this.state[0][3] = this.state[3][5];
    this.state[0][6] = this.state[3][2];

    this.state[3][8] = this.state[5][0];
    this.state[3][5] = this.state[5][3];
    this.state[3][2] = this.state[5][6];

    this.state[5][0] = this.state[1][0];
    this.state[5][3] = this.state[1][3];
    this.state[5][6] = this.state[1][6];

    this.state[1][0] = tmp1;
    this.state[1][3] = tmp2;
    this.state[1][6] = tmp3;

    this.turnFaceClockwise(4);
  }

  turnLeftAntiClockwise() {
    let tmp1 = this.state[0][0];
    let tmp2 = this.state[0][3];
    let tmp3 = this.state[0][6];

    this.state[0][0] = this.state[1][0];
    this.state[0][3] = this.state[1][3];
    this.state[0][6] = this.state[1][6];

    this.state[1][0] = this.state[5][0];
    this.state[1][3] = this.state[5][3];
    this.state[1][6] = this.state[5][6];

    this.state[5][0] = this.state[3][8];
    this.state[5][3] = this.state[3][5];
    this.state[5][6] = this.state[3][2];

    this.state[3][8] = tmp1;
    this.state[3][5] = tmp2;
    this.state[3][2] = tmp3;

    this.turnFaceAntiClockwise(4);
  }

  turnRightClockwise() {
    let tmp1 = this.state[0][2];
    let tmp2 = this.state[0][5];
    let tmp3 = this.state[0][8];

    this.state[0][2] = this.state[1][2];
    this.state[0][5] = this.state[1][5];
    this.state[0][8] = this.state[1][8];

    this.state[1][2] = this.state[5][2];
    this.state[1][5] = this.state[5][5];
    this.state[1][8] = this.state[5][8];

    this.state[5][2] = this.state[3][6];
    this.state[5][5] = this.state[3][3];
    this.state[5][8] = this.state[3][0];

    this.state[3][6] = tmp1;
    this.state[3][3] = tmp2;
    this.state[3][0] = tmp3;

    this.turnFaceClockwise(2);
  }

  turnRightAntiClockwise() {
    let tmp1 = this.state[0][2];
    let tmp2 = this.state[0][5];
    let tmp3 = this.state[0][8];

    this.state[0][2] = this.state[3][6];
    this.state[0][5] = this.state[3][3];
    this.state[0][8] = this.state[3][0];

    this.state[3][6] = this.state[5][2];
    this.state[3][3] = this.state[5][5];
    this.state[3][0] = this.state[5][8];

    this.state[5][2] = this.state[1][2];
    this.state[5][5] = this.state[1][5];
    this.state[5][8] = this.state[1][8];

    this.state[1][2] = tmp1;
    this.state[1][5] = tmp2;
    this.state[1][8] = tmp3;

    this.turnFaceAntiClockwise(2);
  }

  turnUpClockwise() {
    let tmp1 = this.state[1][0];
    let tmp2 = this.state[1][1];
    let tmp3 = this.state[1][2];

    this.state[1][0] = this.state[2][0];
    this.state[1][1] = this.state[2][1];
    this.state[1][2] = this.state[2][2];

    this.state[2][0] = this.state[3][0];
    this.state[2][1] = this.state[3][1];
    this.state[2][2] = this.state[3][2];

    this.state[3][0] = this.state[4][0];
    this.state[3][1] = this.state[4][1];
    this.state[3][2] = this.state[4][2];

    this.state[4][0] = tmp1;
    this.state[4][1] = tmp2;
    this.state[4][2] = tmp3;

    this.turnFaceClockwise(0);
  }

  turnUpAntiClockwise() {
    let tmp1 = this.state[1][0];
    let tmp2 = this.state[1][1];
    let tmp3 = this.state[1][2];

    this.state[1][0] = this.state[4][0];
    this.state[1][1] = this.state[4][1];
    this.state[1][2] = this.state[4][2];

    this.state[4][0] = this.state[3][0];
    this.state[4][1] = this.state[3][1];
    this.state[4][2] = this.state[3][2];

    this.state[3][0] = this.state[2][0];
    this.state[3][1] = this.state[2][1];
    this.state[3][2] = this.state[2][2];

    this.state[2][0] = tmp1;
    this.state[2][1] = tmp2;
    this.state[2][2] = tmp3;

    this.turnFaceAntiClockwise(0);
  }

  turnDownClockwise() {
    let tmp1 = this.state[1][6];
    let tmp2 = this.state[1][7];
    let tmp3 = this.state[1][8];

    this.state[1][6] = this.state[4][6];
    this.state[1][7] = this.state[4][7];
    this.state[1][8] = this.state[4][8];

    this.state[4][6] = this.state[3][6];
    this.state[4][7] = this.state[3][7];
    this.state[4][8] = this.state[3][8];

    this.state[3][6] = this.state[2][6];
    this.state[3][7] = this.state[2][7];
    this.state[3][8] = this.state[2][8];

    this.state[2][6] = tmp1;
    this.state[2][7] = tmp2;
    this.state[2][8] = tmp3;

    this.turnFaceClockwise(5);
  }

  turnDownAntiClockwise() {
    let tmp1 = this.state[1][6];
    let tmp2 = this.state[1][7];
    let tmp3 = this.state[1][8];

    this.state[1][6] = this.state[2][6];
    this.state[1][7] = this.state[2][7];
    this.state[1][8] = this.state[2][8];

    this.state[2][6] = this.state[3][6];
    this.state[2][7] = this.state[3][7];
    this.state[2][8] = this.state[3][8];

    this.state[3][6] = this.state[4][6];
    this.state[3][7] = this.state[4][7];
    this.state[3][8] = this.state[4][8];

    this.state[4][6] = tmp1;
    this.state[4][7] = tmp2;
    this.state[4][8] = tmp3;
    
    this.turnFaceAntiClockwise(5);
  }

  turnFaceClockwise(face) {
    let tmpFaceCorner = this.state[face][0];
    this.state[face][0] = this.state[face][6];
    this.state[face][6] = this.state[face][8];
    this.state[face][8] = this.state[face][2];
    this.state[face][2] = tmpFaceCorner;

    let tmpFaceEdge = this.state[face][1];
    this.state[face][1] = this.state[face][3];
    this.state[face][3] = this.state[face][7];
    this.state[face][7] = this.state[face][5];
    this.state[face][5] = tmpFaceEdge;
  }

  turnFaceAntiClockwise(face) {
    let tmpFaceCorner = this.state[face][0];
    this.state[face][0] = this.state[face][2];
    this.state[face][2] = this.state[face][8];
    this.state[face][8] = this.state[face][6];
    this.state[face][6] = tmpFaceCorner;

    let tmpFaceEdge = this.state[face][1];
    this.state[face][1] = this.state[face][5];
    this.state[face][5] = this.state[face][7];
    this.state[face][7] = this.state[face][3];
    this.state[face][3] = tmpFaceEdge;
  }
}

export default RubiksCube;