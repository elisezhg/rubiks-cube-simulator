import React, { Component } from "react";

class Button extends Component {    
    render() {
      return (
        <button
          type="button"
          onClick={this.props.function}
          onMouseEnter={() => {if (this.props.setHoveredMove && !this.props.isMobile) {this.props.setHoveredMove(this.props.text)}}}
          onMouseLeave={() => {if (this.props.setHoveredMove && !this.props.isMobile) {this.props.setHoveredMove(null)}}}
        >
          {this.props.text}
        </button>
      );
    }
}

export default Button;