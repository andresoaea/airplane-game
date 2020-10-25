class Plane extends Phaser.GameObjects.Sprite {
    constructor(config) {
        super(config.scene, config.x, config.y, config.planeName);
        config.scene.add.existing(this);

        this.scene = config.scene;

        this.setScale(0.4)
            .setInteractive()
            .setData('initialPos', {
                x: this.x,
                y: this.y,
            });

        this.scene.input.on('pointerdown', this.startDrag, this);

        // Other variables

        this.planeName = config.planeName;
        this.stablePos = [];
        this.planeCells = [];
        this.isInDropZone = false;
        this.firstClickTime = 0;
        // this.lastPos = { x: 0, y: 0 };
        // this.lastAngle = 0;
    }

    startDrag(pointer, targets) {
        if (targets[0] !== this) return;
        this.dragObj = targets[0];

        // this.dragObj.depth++;
        // this.scene.planes.map((plane) => {
        //     return plane.instance.depth--;
        // });

        // if (this.scene.planes.length === 2) {
        //     this.scene.planes.find((plane) => {
        //         return plane.instance === this;
        //     });
        // }

        //  console.log(this.dragObj.depth);
        // console.log(this.planeName);

        this.checkDoubleTap();
        this.scene.input.off('pointerdown', this.startDrag, this);
        this.scene.input.on('pointermove', this.doDrag, this);
        this.scene.input.on('pointerup', this.stopDrag, this);

        if (typeof this.dragObj !== 'undefined') {
            this.pointerDiffY = pointer.y - this.dragObj.y;
            this.pointerDiffX = pointer.x - this.dragObj.x;
        }
    }

    doDrag(pointer, targets) {
        if (targets[0] !== this) return;

        if (typeof this.dragObj !== 'undefined') {
            // Move
            this.dragObj.x = pointer.x - this.pointerDiffX;
            this.dragObj.y = pointer.y - this.pointerDiffY;

            let initialPos = this.dragObj.getData('initialPos');

            // Scale
            if (pointer.x < initialPos.x) {
                if (this.isInDropZone) {
                    this.dragObj.setScale(1.1);
                } else {
                    this.dragObj.setScale(
                        (game.config.width - this.dragObj.x) / 450
                    );
                }
            }
        }
    }

    stopDrag(pointer, targets) {
        if (targets[0] !== this) return;

        this.scene.input.on('pointerdown', this.startDrag, this);
        this.scene.input.off('pointermove', this.doDrag, this);
        this.scene.input.off('pointerup', this.stopDrag, this);

        if (typeof this.dragObj == 'undefined') return;

        // Check if in drop zone
        let dragX = this.dragObj.x;
        let dragY = this.dragObj.y;

        let dropZone = this.getDropZone();

        if (
            dragX > dropZone.x &&
            dragX < dropZone.x + dropZone.width &&
            dragY > dropZone.y &&
            dragY < dropZone.y + dropZone.height
        ) {
            // Inside drop zone
            this.dragObj.setScale(1);

            //console.log(this.lastAngle);

            // if (
            //     (this.x !== this.lastPos.x && this.y !== this.lastPos.y) ||
            //     this.angle !== this.lastAngle
            // ) {
            this.repositionToClosest('x');
            this.repositionToClosest('y');
            // }

            // this.lastPos = {
            //     x: this.x,
            //     y: this.y,
            // };
            // this.lastAngle = this.angle;

            this.setPlaneCells();

            this.isInDropZone = true;

            //this.dragObj.x =
        } else {
            // Outside drop zone / Go back to initial position
            this.scene.tweens.add({
                targets: [this.dragObj],
                x: this.dragObj.getData('initialPos').x,
                y: this.dragObj.getData('initialPos').y,
                scaleX: 0.4,
                scaleY: 0.4,
                duration: 500,
            });

            this.isInDropZone = false;
        }
    }

    repositionToClosest(axis) {
        let isVertical = this.angle === 90 || this.angle === -90;

        if (isVertical) {
            this.repositionVertical(axis);
        } else {
            this.repositionHorizontal(axis);
        }

        // console.log(isVertical);
    }

    repositionHorizontal(axis) {
        let dropZone = this.getDropZone();

        for (let i = 0; i < 8; i++) {
            if (i < 2) continue;

            let closest = i * 40;
            let relativeDistance = this.dragObj[axis] - dropZone[axis];

            if (axis === 'y') {
                relativeDistance = relativeDistance + 20;
            }

            if (relativeDistance - closest < 39) {
                // Horizontal plane
                let newPos = closest + dropZone[axis] + (axis === 'x' ? 20 : 0);

                if (i > 5) {
                    // this.dragObj[axis] =
                    //     5 * 40 + dropZone[axis] + (axis === 'x' ? 20 : 0);
                    if (axis === 'x') {
                        this.dragObj.x = 5 * 40 + dropZone.x + 20;
                    } else {
                        this.dragObj.y = 5 * 40 + dropZone.x;
                    }
                } else {
                    this.dragObj[axis] = newPos;
                }

                break;
            }
        }
    }

    repositionVertical(axis) {
        let dropZone = this.getDropZone();

        for (let i = 0; i < 9; i++) {
            if (i < 2) continue;

            let closest = i * 40;
            let relativeDistance = this.dragObj[axis] - dropZone[axis];

            if (axis === 'x') {
                relativeDistance = relativeDistance + 20;
            }

            if (relativeDistance - closest < 39) {
                // Horizontal plane
                let newPos = closest + dropZone[axis] + (axis === 'y' ? 20 : 0);

                if (i > 5) {
                    // this.dragObj[axis] =
                    //     5 * 40 + dropZone[axis] + (axis === 'x' ? 20 : 0);
                    if (axis === 'x') {
                        this.dragObj.x = 6 * 40 + dropZone.x;
                        //console.log('aici 1');
                    } else {
                        this.dragObj.y = 5 * 40 + dropZone.x - 20;
                        ///console.log('aici 2');
                    }
                } else {
                    this.dragObj[axis] = newPos;
                }

                break;
            }
        }
    }

    getDropZone() {
        let { x, y, width, height } = this.scene.dropZoneRect;
        return { x, y, width, height };
    }

    setPlaneCells() {
        let headCellId;
        let planeData = this.getPlanePositionData();
        let headPoint = planeData.headPoint;

        //console.log(planeData);

        this.scene.cells.forEach((cell) => {
            if (
                cell.rect.centerX === headPoint.x &&
                cell.rect.centerY === headPoint.y
            ) {
                headCellId = cell.id;
            }
        });

        //console.log(headCellId);

        let headCords = headCellId.split('').map((num) => parseInt(num));
        headCords = { x: headCords[0], y: headCords[1] };

        // let planeCells = [
        //     headCellId,
        //     // `${headCords.y + 1}${headCords.x - 2}`,
        //     // `${headCords.y + 1}${headCords.x - 1}`,
        //     // `${headCords.x}${headCords.y + 1}`,
        //     // `${headCords.x + 1}${headCords.y + 1}`,
        //     // `${headCords.x + 2}${headCords.y + 1}`,
        //     // `${headCords.x}${headCords.y + 2}`,
        //     // `${headCords.y + 3}${headCords.x - 1}`,
        //     // `${headCords.x}${headCords.y + 3}`,
        //     // `${headCords.x + 1}${headCords.y + 3}`,
        // ];
        let planeCells = [];

        let schema = planeData.schema;

        let originX = headCords.x + planeData.diff.x;
        let originY = headCords.y + planeData.diff.y;

        for (let i = 0; i < schema.length; i++) {
            const line = schema[i];
            //console.log('line', i);

            for (let j = 0; j < line.length; j++) {
                const cellPlaceholder = line[j];

                if (cellPlaceholder) {
                    planeCells.push(`${originX + j}${originY + i}`);
                }

                //console.log(`${i + 1}${j + 1}`);
            }
        }

        //console.log(planeCells);
        this.planeCells = planeCells;

        let existingCurrentPlane = this.scene.planes.find((plane) => {
            return plane.name === this.planeName;
        });

        if (!existingCurrentPlane) {
            this.scene.planes.push({
                name: this.planeName,
                cells: planeCells,
                instance: this,
            });
        }

        let isOverlaping = this.checkOverlap();
        if (!isOverlaping) {
            this.stablePos.push({
                x: this.x,
                y: this.y,
            });

            if (this.stablePos.length > 1) {
                this.stablePos.shift();
            }
        }

        //localStorage.setItem('lastPlaceCells', planeCells.join(','));
    }

    checkOverlap() {
        if (this.scene.planes.length < 2) return false;

        let overlap = false;
        let firstPlaneCells = this.scene.planes[0].cells;

        this.planeCells.forEach((cell) => {
            if (firstPlaneCells.includes(cell)) {
                console.log('overlap');
                this.x = this.stablePos[0].x;
                this.y = this.stablePos[0].y;
                overlap = true;
            }
        });

        return overlap;
    }

    getPlanePositionData() {
        let schema;
        let headPoint;
        let diff; // Compute start point difference
        // It is distance in cells from plane head
        // to plane margin (top/left 0)

        switch (this.angle) {
            case 90:
                headPoint = {
                    x: this.x + this.height / 2 - this.scene.cellSize / 2,
                    y: this.y,
                };
                schema = [
                    [0, 0, 1, 0],
                    [1, 0, 1, 0],
                    [1, 1, 1, 1],
                    [1, 0, 1, 0],
                    [0, 0, 1, 0],
                ];
                diff = {
                    x: -3,
                    y: -2,
                };
                break;
            case -180:
                headPoint = {
                    x: this.x,
                    y: this.y + this.height / 2 - this.scene.cellSize / 2,
                };
                schema = [
                    [0, 1, 1, 1, 0],
                    [0, 0, 1, 0, 0],
                    [1, 1, 1, 1, 1],
                    [0, 0, 1, 0, 0],
                ];
                diff = {
                    x: -2,
                    y: -3,
                };
                break;
            case -90:
                headPoint = {
                    x: this.x - this.height / 2 + this.scene.cellSize / 2,
                    y: this.y,
                };
                schema = [
                    [0, 1, 0, 0],
                    [0, 1, 0, 1],
                    [1, 1, 1, 1],
                    [0, 1, 0, 1],
                    [0, 1, 0, 0],
                ];
                diff = {
                    x: 0,
                    y: -2,
                };
                break;

            default:
                headPoint = {
                    x: this.x,
                    y: this.y - this.height / 2 + this.scene.cellSize / 2,
                };
                schema = [
                    [0, 0, 1, 0, 0],
                    [1, 1, 1, 1, 1],
                    [0, 0, 1, 0, 0],
                    [0, 1, 1, 1, 0],
                ];
                diff = {
                    x: -2,
                    y: 0,
                };
        }

        return { schema, headPoint, diff };
    }

    checkDoubleTap() {
        if (typeof this.dragObj === 'undefined') return;

        if (this.firstClickTime == 0) {
            this.firstClickTime = this.getTime();
            return;
        }

        let elapsed = this.getTime() - this.firstClickTime;

        if (elapsed < 400) {
            // Rotate plane on double tap

            this.angle += 90;
            // this.repositionToClosest('x');
            // this.repositionToClosest('y');
        }

        this.firstClickTime = 0;
    }

    getTime() {
        //make a new date object
        let d = new Date();
        //return the number of milliseconds since 1 January 1970 00:00:00.
        return d.getTime();
    }
}

export default Plane;
