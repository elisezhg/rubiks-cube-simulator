class RubiksCube {
    constructor() {
        this.state = [
            Array(9).fill(0xffffff), // White
            Array(9).fill(0x00ff00), // Green
            Array(9).fill(0xff0000), // Red
            Array(9).fill(0x0000ff), // Blue
            Array(9).fill(0xffa500), // Orange
            Array(9).fill(0xffff00)  // Yellow
        ];

        this.miniCubesMapping = {
            0: {
                0: this.state[0][0],
                1: null,
                2: null,
                3: this.state[3][2],
                4: this.state[4][0],
                5: null
            },
            1: {
                0: this.state[0][1],
                1: null,
                2: null,
                3: this.state[3][1],
                4: null,
                5: null
            },
            2: {
                0: this.state[0][2],
                1: null,
                2: this.state[2][2],
                3: this.state[3][3],
                4: null,
                5: null
            },
            3: {
                0: null,
                1: null,
                2: null,
                3: this.state[3][5],
                4: this.state[4][3],
                5: null
            },
            4: {
                0: null,
                1: null,
                2: null,
                3: this.state[3][4],
                4: null,
                5: null
            },
            5: {
                0: null,
                1: null,
                2: this.state[2][5],
                3: this.state[3][3],
                4: null,
                5: null
            },
            6: {
                0: null,
                1: null,
                2: null,
                3: this.state[3][8],
                4: this.state[4][6],
                5: this.state[5][6]
            },
            7: {
                0: null,
                1: null,
                2: null,
                3: this.state[3][7],
                4: null,
                5: this.state[5][7]
            },
            8: {
                0: null,
                1: null,
                2: this.state[2][8],
                3: this.state[3][6],
                4: null,
                5: this.state[5][6]
            },
            9: {
                0: this.state[0][3],
                1: null,
                2: null,
                3: null,
                4: this.state[4][1],
                5: null
            },
            10: {
                0: this.state[0][4],
                1: null,
                2: null,
                3: null,
                4: null,
                5: null
            },
            11: {
                0: this.state[0][2],
                1: null,
                2: this.state[2][1],
                3: null,
                4: null,
                5: null
            },
            12: {
                0: null,
                1: null,
                2: null,
                3: null,
                4: this.state[4][4],
                5: null
            },
            13: {
                0: null,
                1: null,
                2: null,
                3: null,
                4: null,
                5: null
            },
            14: {
                0: null,
                1: null,
                2: this.state[2][4],
                3: null,
                4: null,
                5: null
            },
            15: {
                0: null,
                1: null,
                2: null,
                3: null,
                4: this.state[4][7],
                5: this.state[5][3]
            },
            16: {
                0: null,
                1: null,
                2: null,
                3: null,
                4: null,
                5: this.state[5][4]
            },
            17: {
                0: null,
                1: null,
                2: this.state[2][7],
                3: null,
                4: null,
                5: this.state[5][5]
            },
            18: {
                0: this.state[0][6],
                1: this.state[1][0],
                2: null,
                3: null,
                4: this.state[4][3],
                5: null
            },
            19: {
                0: this.state[0][7],
                1: this.state[1][1],
                2: null,
                3: null,
                4: null,
                5: null
            },
            20: {
                0: this.state[0][2],
                1: this.state[1][2],
                2: this.state[2][0],
                3: null,
                4: null,
                5: null
            },
            21: {
                0: null,
                1: this.state[1][3],
                2: null,
                3: null,
                4: this.state[4][1],
                5: null
            },
            22: {
                0: null,
                1: this.state[1][4],
                2: null,
                3: null,
                4: null,
                5: null
            },
            23: {
                0: null,
                1: this.state[1][5],
                2: this.state[2][3],
                3: null,
                4: null,
                5: null
            },
            24: {
                0: null,
                1: this.state[1][6],
                2: null,
                3: null,
                4: this.state[4][8],
                5: this.state[5][0]
            },
            25: {
                0: null,
                1: this.state[1][7],
                2: null,
                3: null,
                4: null,
                5: this.state[5][0]
            },
            26: {
                0: null,
                1: this.state[1][8],
                2: this.state[2][6],
                3: null,
                4: null,
                5: this.state[5][2]
            }
        }

        this.size = 3;
    }

    getState() {
        return this.state;
    }

    getSize() {
        return this.size;
    }

    getColor(x, y, z) {
        let index = x + 3 * (2-y) + 9 * z;
        console.log(`x: ${x}, y: ${y}, z: ${z} -> ${index} ${this.miniCubesMapping[index]}`);
        return this.miniCubesMapping[index];
    }

    getColorUpdated(i) {
        return this.miniCubesMapping[i];
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
