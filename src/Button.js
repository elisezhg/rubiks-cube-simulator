import React, { Component } from "react";
import "./css/style.css";

class Button extends Component {
    constructor() {
      super();
      this.state = {
        color: "red"
      };
    }
    
    render() {
      return (
        <button
          type="button"
          onClick={this.props.function}
        >
          {this.props.text}
        </button>
      );
    }
}

export default Button;