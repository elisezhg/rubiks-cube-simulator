import { Component } from "react";
import RubiksCubeAnimation from "./RubiksCubeAnimation";
import RubiksCube from "./RubiksCube";
import RubiksCubeSolver from "./RubiksCubeSolver";
import Button from "./Button";
import "./css/style.css";

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
    this.turnXAxis = this.turnXAxis.bind(this);
    this.turnYAxis = this.turnYAxis.bind(this);

    this.turn = this.turn.bind(this);

    this.state = {
      rubiksCube: new RubiksCube(),
      rubiksCubeSolver: new RubiksCubeSolver(),
      needsUpdate: false,
      queue: [],
      rotationSpeed: 1 / 75
    };
  }
  
  componentDidMount() {
    window.addEventListener('keydown', this.turn);
    this.generateScramble();
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
      case 96:
        this.state.rubiksCube.upsideDown();
        this.toggleNeedsUpdate();
        break;
      case 97:
        this.state.rubiksCube.moveCubeLeft();
        this.toggleNeedsUpdate();
        break;
      default:
        console.log("not recognized");
    }
  }

  solve() {
    this.setState({
      textDisplay: "Solving...",
      movesDisplay: ""
    })

    let solution = this.state.rubiksCubeSolver.solve(this.state.rubiksCube);

    if (solution === "") {
      this.setState({
        textDisplay: "Already solved!"
      })
    } else {
      this.setState({
        textDisplay: "Solution: ",
        movesDisplay: solution
      })
      
      this.queueUpMoves(solution);  
    }
  }

  scramble() {
    this.queueUpMoves(this.state.movesDisplay);
  }

  queueUpMoves(scramble) {
    let moves = scramble.split(" ");

    moves.forEach(m => {
      if (m.slice(1) === "2") {
        this.state.queue.push(m.slice(0, 1));
        this.state.queue.push(m.slice(0, 1));
      } else {
        this.state.queue.push(m);
      }
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
      textDisplay: "",
      movesDisplay: generatedMoves.join(" ")
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

  turnXAxis() {
    this.state.queue.push("X2");
  }

  turnYAxis() {
    this.state.queue.push("Y2");
  }

  render() {
    return (
      <div >
        <RubiksCubeAnimation
          rotationSpeed={this.state.rotationSpeed}
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

        <div className="moves-container">
          <Button text={"F"} function={this.turnFrontClockwise}/>
          <Button text={"F'"} function={this.turnFrontAntiClockwise}/><br/>
          <Button text={"B"} function={this.turnBackClockwise}/>
          <Button text={"B'"} function={this.turnBackAntiClockwise}/><br/>
          <Button text={"U"} function={this.turnUpClockwise}/>
          <Button text={"U'"} function={this.turnUpAntiClockwise}/><br/>
          <Button text={"D"} function={this.turnDownClockwise}/>
          <Button text={"D'"} function={this.turnDownAntiClockwise}/><br/>
          <Button text={"L"} function={this.turnLeftClockwise}/>
          <Button text={"L'"} function={this.turnLeftAntiClockwise}/><br/>
          <Button text={"R"} function={this.turnRightClockwise}/>
          <Button text={"R'"} function={this.turnRightAntiClockwise}/><br/>
          <Button text={"X2"} function={this.turnXAxis}/>
          <Button text={"Y2"} function={this.turnYAxis}/><br/>
        </div>

        <div className="actions-container">
          <Button text={"Generate Scramble"} function={this.generateScramble}/><br/>
          <Button text={"Scramble"} function={this.scramble}/><br/>
          <Button text={"Solve"} function={this.solve}/><br/>
          <Button text={"Reset"} function={this.resetRubiksCube}/><br/><br/>
          Speed:
          <input className="slider" type="range" min="-135" max="-15" defaultValue="-75" step = "15" onChange={(e) => this.setState({rotationSpeed: -1 / e.target.value})}></input>
        </div>

        <div className="information-display">
          <p>{this.state.textDisplay}{this.state.movesDisplay}</p>
        </div>
      </div>
      )
  }
}

export default Controller;