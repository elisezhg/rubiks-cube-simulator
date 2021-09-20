class FaceMovement {
  constructor() {
    this.groupIndices = {
      "U": [6, 7, 8, 15, 16, 17, 24, 25, 26],
      "D": [0, 1, 2, 9, 10, 11, 18, 19, 20],
      "F": [18, 19, 20, 21, 22, 23, 24, 25, 26],
      "B": [0, 1, 2, 3, 4, 5, 6, 7, 8],
      "L": [0, 3, 6, 9, 12, 15, 18, 21, 24],
      "R": [2, 5, 8, 11, 14, 17, 20, 23, 26],
      "X": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26],
      "Y": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26],
    }

    this.possibleMovesByFace = {
      0: ["F", "F'", "B", "B'", "L", "L'", "R", "R'"],
      1: ["U", "U'", "D", "D'", "L", "L'", "R", "R'"],
      2: ["U", "U'", "D", "D'", "F", "F'", "B", "B'"],
      3: ["U", "U'", "D", "D'", "L", "L'", "R", "R'"],
      4: ["U", "U'", "D", "D'", "F", "F'", "B", "B'"],
      5: ["F", "F'", "B", "B'", "L", "L'", "R", "R'"],
    }

    this.mappingFaceDirection = {
      0: {
        "Up": ["L'", "R"],
        "Down": ["L", "R'"],
        "Left": ["F'", "B"],
        "Right": ["F", "B'"]
      },
      1: {
        "Up": ["L'", "R"],
        "Down": ["L", "R'"],
        "Left": ["U", "D'"],
        "Right": ["U'", "D"]
      },
      2: {
        "Up": ["F'", "B"],
        "Down": ["F", "B'"],
        "Left": ["U", "D'"],
        "Right": ["U'", "D"]
      },
      3: {
        "Up": ["L", "R'"],
        "Down": ["L'", "R"],
        "Left": ["U", "D'"],
        "Right": ["U'", "D"]
      },
      4: {
        "Up": ["F", "B'"],
        "Down": ["F'", "B"],
        "Left": ["U", "D'"],
        "Right": ["U'", "D"]
      },
      5: {
        "Up": ["L'", "R"],
        "Down": ["L", "R'"],
        "Left": ["F", "B'"],
        "Right": ["F'", "B"]
      }
    }
  }

  getIndices(move) {
    return move? this.groupIndices[move.slice(0, 1)] : [];
  }

  getPossibleMoves(indexMiniCube, indexFace) {
      let moves = [];

      for (var key in this.possibleMovesByFace[indexFace]) {
          let move = this.possibleMovesByFace[indexFace][key];
          if (this.groupIndices[move.slice(0, 1)].includes(indexMiniCube)) {
              moves.push(move);
          }
      }

      return moves;
  }

  getPossibleMovesFromDirection(direction, face) {
    let moves = [];

    if (direction.x === 1) {
      moves = moves.concat(this.mappingFaceDirection[face]["Right"]);
    }
    
    if (direction.x === -1) {
      moves = moves.concat(this.mappingFaceDirection[face]["Left"]);
    }
    
    if (direction.y === 1) {
      moves = moves.concat(this.mappingFaceDirection[face]["Up"]);
    }
    
    if (direction.y === -1) {
      moves = moves.concat(this.mappingFaceDirection[face]["Down"]);
    }

    return moves;
  }
}

export default FaceMovement;