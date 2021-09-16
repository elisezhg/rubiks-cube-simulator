import { Component } from "react";
import RubiksCubeAnimation from "./RubiksCubeAnimation";
import RubiksCube from "./RubiksCube";
import RubiksCubeSolver from "./RubiksCubeSolver";

class Controller extends Component {
  constructor(props) {
    super(props);

    this.toggleNeedsUpdate = this.toggleNeedsUpdate.bind(this);
    this.resetRubiksCube = this.resetRubiksCube.bind(this);
    this.generateScramble = this.generateScramble.bind(this);
    this.scramble = this.scramble.bind(this);
    this.solve = this.solve.bind(this);

    // Movements
    this.turnFrontClockwise = this.turnFrontClockwise.bind(this);
    this.turnFrontAntiClockwise = this.turnFrontAntiClockwise.bind(this);
    this.turnUpClockwise = this.turnUpClockwise.bind(this);
    this.turnUpAntiClockwise = this.turnUpAntiClockwise.bind(this);
    this.turnDownClockwise = this.turnDownClockwise.bind(this);
    this.turnDownAntiClockwise = this.turnDownAntiClockwise.bind(this);
    this.turnLeftClockwise = this.turnLeftClockwise.bind(this);
    this.turnLeftAntiClockwise = this.turnLeftAntiClockwise.bind(this);
    this.turnRightClockwise = this.turnRightClockwise.bind(this);
    this.turnRightAntiClockwise = this.turnRightAntiClockwise.bind(this);
    this.turnBackClockwise = this.turnBackClockwise.bind(this);
    this.turnBackAntiClockwise = this.turnBackAntiClockwise.bind(this);

    this.turn = this.turn.bind(this);

    this.state = {
      rubiksCube: new RubiksCube(),
      rubiksCubeSolver: new RubiksCubeSolver(),
      needsUpdate: false,
      queue: []
    };
  }

  componentDidMount() {
    window.addEventListener('keydown', this.turn);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.turn);
  }

  turn(event) {
    switch(event.keyCode) {
      case 70:
        this.turnFrontClockwise();
        break;
      case 66:
        this.turnBackClockwise();
        break;
      case 76:
        this.turnLeftClockwise();
        break;
      case 82:
        this.turnRightClockwise();
        break;
      case 85:
        this.turnUpClockwise();
        break;
      case 68:
        this.turnDownClockwise();
        break;
      default:
        console.log("not recognized");
    }
  }

  solve() {
    let solution = this.state.rubiksCubeSolver.solve(this.state.rubiksCube);
    
    this.queueUpMoves(solution);
  }

  scramble() {
    if (!this.state.scramble) {
      alert("Please generate a scramble first!");
    } else {
      this.queueUpMoves(this.state.scramble);
    }
  }

  queueUpMoves(scramble) {
    let moves = scramble.split(" ");

    moves.forEach(m => {
      if (m.slice(1) === "2") {
        this.state.queue.push(m.slice(0, 1));
      }

      this.state.queue.push(m.slice(0, 1));
    });
  }

  generateScramble() {

    let generatedMoves = [];

    let possibleMoves = ["F", "B", "L", "R", "U", "D"];
    let possibleVariations = ["", "'", "2"];

    for (let i = 0; i < 25; i++) {
      let randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
      
      while (generatedMoves.length !== 0 && randomMove === generatedMoves.slice(-1)[0].slice(0,1)) {
        randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
      }

      randomMove += possibleVariations[Math.floor(Math.random() * possibleVariations.length)];
      generatedMoves.push(randomMove);
    }      

    this.setState({
      scramble: generatedMoves.join(" ")
    })
  }

  resetRubiksCube() {
    this.setState({
      queue: []
    })
    this.state.rubiksCube.initState();
    this.toggleNeedsUpdate();
  }

  toggleNeedsUpdate() {
    this.setState({
      needsUpdate: !this.state.needsUpdate
    })
  }

  turnFrontClockwise() {
    this.state.queue.push("F");
  }

  turnFrontAntiClockwise() {
    this.state.queue.push("F'");
  }

  turnUpClockwise() {
    this.state.queue.push("U");
  }

  turnUpAntiClockwise() {
    this.state.queue.push("U'");
  }

  turnDownClockwise() {
    this.state.queue.push("D");
  }

  turnDownAntiClockwise() {
    this.state.queue.push("D'");
  }

  turnLeftClockwise() {
    this.state.queue.push("L");
  }

  turnLeftAntiClockwise() {
    this.state.queue.push("L'");
  }

  turnRightClockwise() {
    this.state.queue.push("R");
  }

  turnRightAntiClockwise() {
    this.state.queue.push("R'");
  }

  turnBackClockwise() {
    this.state.queue.push("B");
  }

  turnBackAntiClockwise() {
    this.state.queue.push("B'");
  }

  render() {
    return (
      <div>
        <button type="button" onClick={() => this.turnFrontClockwise()}>F</button>
        <button type="button" onClick={() => this.turnFrontAntiClockwise()}>F'</button>
        <button type="button" onClick={() => this.turnUpClockwise()}>U</button>
        <button type="button" onClick={() => this.turnUpAntiClockwise()}>U'</button>
        <button type="button" onClick={() => this.turnDownClockwise()}>D</button>
        <button type="button" onClick={() => this.turnDownAntiClockwise()}>D'</button>
        <button type="button" onClick={() => this.turnLeftClockwise()}>L</button>
        <button type="button" onClick={() => this.turnLeftAntiClockwise()}>L'</button>
        <button type="button" onClick={() => this.turnRightClockwise()}>R</button>
        <button type="button" onClick={() => this.turnRightAntiClockwise()}>R'</button>
        <button type="button" onClick={() => this.turnBackClockwise()}>B</button>
        <button type="button" onClick={() => this.turnBackAntiClockwise()}>B'</button>
        <button type="button" onClick={() => this.resetRubiksCube()}>Reset</button>
        <button type="button" onClick={() => this.generateScramble()}>Generate Scramble</button>
        <button type="button" onClick={() => this.scramble()}>Scramble</button>
        <button type="button" onClick={() => this.solve()}>Solve</button>
        <p id="scramble">{this.state.scramble}</p>
        <RubiksCubeAnimation
          rubiksCube={this.state.rubiksCube}
          needsUpdate={this.state.needsUpdate}
          queue={this.state.queue}
          animateFrontClockwise={this.state.animateFrontClockwise}
          animateFrontAntiClockwise={this.state.animateFrontAntiClockwise}
          animateUpClockwise={this.state.animateUpClockwise}
          animateUpAntiClockwise={this.state.animateUpAntiClockwise}
          animateDownClockwise={this.state.animateDownClockwise}
          animateDownAntiClockwise={this.state.animateDownAntiClockwise}
          animateLeftClockwise={this.state.animateLeftClockwise}
          animateLeftAntiClockwise={this.state.animateLeftAntiClockwise}
          animateRightClockwise={this.state.animateRightClockwise}
          animateRightAntiClockwise={this.state.animateRightAntiClockwise}
          animateBackClockwise={this.state.animateBackClockwise}
          animateBackAntiClockwise={this.state.animateBackAntiClockwise}
          toggleNeedsUpdate={this.toggleNeedsUpdate}
        />
      </div>
      )
  }
}

export default Controller;