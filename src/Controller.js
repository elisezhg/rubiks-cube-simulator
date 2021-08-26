import { Component } from "react";
import RubiksCubeAnimation from "./RubiksCubeAnimation";

const RubiksCube = require("./RubiksCube");

class Controller extends Component {
  constructor(props) {
    super(props);

    this.toggleUpdate = this.toggleUpdate.bind(this);

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
    this.resetRubiksCube = this.resetRubiksCube.bind(this);

    this.turn = this.turn.bind(this);

    this.state = {
      rubiksCube: new RubiksCube(),
      needsUpdate: false
    };
  }

  componentDidMount() {
    window.addEventListener('keydown', this.turn)
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.turn)
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

  resetRubiksCube() {
    this.state.rubiksCube.initState();
    this.toggleUpdate();
  }

  toggleUpdate() {
    this.setState({
      needsUpdate: !this.state.needsUpdate
    });
  }

  turnFrontClockwise() {
    this.state.rubiksCube.turnFrontClockwise();
    this.setState({needsUpdate: true});
  }

  turnFrontAntiClockwise() {
    this.state.rubiksCube.turnFrontAntiClockwise();
    this.setState({needsUpdate: true});
  }

  turnUpClockwise() {
    this.state.rubiksCube.turnUpClockwise();
    this.setState({needsUpdate: true});
  }

  turnUpAntiClockwise() {
    this.state.rubiksCube.turnUpAntiClockwise();
    this.setState({needsUpdate: true});
  }

  turnDownClockwise() {
    this.state.rubiksCube.turnDownClockwise();
    this.setState({needsUpdate: true});
  }

  turnDownAntiClockwise() {
    this.state.rubiksCube.turnDownAntiClockwise();
    this.setState({needsUpdate: true});
  }

  turnLeftClockwise() {
    this.state.rubiksCube.turnLeftClockwise();
    this.setState({needsUpdate: true});
  }

  turnLeftAntiClockwise() {
    this.state.rubiksCube.turnLeftAntiClockwise();
    this.setState({needsUpdate: true});
  }

  turnRightClockwise() {
    this.state.rubiksCube.turnRightClockwise();
    this.setState({needsUpdate: true});
  }

  turnRightAntiClockwise() {
    this.state.rubiksCube.turnRightAntiClockwise();
    this.setState({needsUpdate: true});
  }

  turnBackClockwise() {
    this.state.rubiksCube.turnBackClockwise();
    this.setState({needsUpdate: true});
  }

  turnBackAntiClockwise() {
    this.state.rubiksCube.turnBackAntiClockwise();
    this.setState({needsUpdate: true});
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
        <RubiksCubeAnimation
          rubiksCube={this.state.rubiksCube}
          needsUpdate={this.state.needsUpdate}
          toggleUpdate={this.toggleUpdate}
        />
      </div>
      )
  }
}

export default Controller;