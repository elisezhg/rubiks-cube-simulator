class RubiksCube {
    constructor() {
        this.state = [
            Array(9).fill(0x00ff00), // Green
            Array(9).fill(0xffffff), // White
            Array(9).fill(0xff0000), // Red
            Array(9).fill(0x00ffff), // yellow
            Array(9).fill(0xffff00), // Orange
            Array(9).fill(0x0000ff)  // Blue
        ];

        this.size = 3;
    }

    getState() {
        return this.state;
    }

    getSize() {
        return this.size;
    }

    getColor(x, y, z) {
        // TODO
    }

    turnFrontClockwise() {
        // tmp top
        let tmp1 = this.state[1][6];
        let tmp2 = this.state[1][7];
        let tmp3 = this.state[1][8];

        // top
        this.state[1][6] = this.state[4][8];
        this.state[1][7] = this.state[4][5];
        this.state[1][8] = this.state[4][2];
        
        // right
        this.state[4][8] = this.state[3][0];
        this.state[4][5] = this.state[3][1];
        this.state[4][2] = this.state[3][2];

        // bottom
        this.state[3][0] = this.state[2][0];
        this.state[3][1] = this.state[2][3];
        this.state[3][2] = this.state[2][6];

        // left
        this.state[2][0] = tmp1;
        this.state[2][3] = tmp2;
        this.state[2][6] = tmp3;

        // edges
        let tmpEdge1 = this.state[0][0];
        this.state[0][0] = this.state[0][6];
        this.state[0][6] = this.state[0][8];
        this.state[0][8] = this.state[0][2];
        this.state[0][2] = tmpEdge1;
        
        let tmpEdge2 = this.state[0][1];
        this.state[0][1] = this.state[0][3];
        this.state[0][3] = this.state[0][7];
        this.state[0][7] = this.state[0][5];
        this.state[0][5] = tmpEdge2;

        return this.state;
    }

    turnFrontAntiClockwise() {

    }

    turnLeftClockwise() {

    }

    turnLeftAntiClockwise() {
        
    }

    turnRightClockwise() {

    }

    turnRightAntiClockwise() {
        
    }
}

module.exports = RubiksCube
