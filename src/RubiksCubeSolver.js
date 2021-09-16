const Cube = require('cubejs');

class RubiksCubeSolver {
  solve(rubiksCube) {
    this.initSolver();

    let string = this.convertStateToString(rubiksCube.getState());
    let cube = Cube.fromString(string);

    return cube.isSolved()? "" : cube.solve();
  }

  initSolver() {
    // Init the solver, might take 4-5 seconds
    Cube.initSolver();
  }

  convertStateToString(state) {
    const mappingColorToLetter = {
      0xffffff: "U",
      0xbaff29: "F",
      0xff101f: "R",
      0x0081a7: "B",
      0xffbc40: "L",
      0xffff66: "D"
    }

    state = state.map(face => {
      return face.map(color => mappingColorToLetter[color]).join("");
    });

    return state[0] + state[2] + state[1] + state[5] + state[4] + state[3];
  }
}
  
export default RubiksCubeSolver;