class Plane extends Phaser.GameObjects.Sprite {
    constructor(config) {
        super(
            config.scene,
            config.x * game.zoom,
            config.y * game.zoom,
            `plane-${config.planeNum}`
        );

        config.scene.add.existing(this);

        this.scene = config.scene;

        this.setScale(0.4)
            .setInteractive()
            .setData('initialPos', {
                x: this.x,
                y: this.y,
            });

        this.setInteractive();
        this.scene.input.setDraggable(this);
        this.scene.input.on('dragstart', this.dragStart, this);
        this.scene.input.on('dragend', this.dragEnd, this);
        this.scene.input.on('drag', this.drag, this);

        // Other variables
        //this.dragObj = null;
        this.planeName = `plane${config.planeNum}`;
        this.stablePos = [
            {
                x: this.x,
                y: this.y,
            },
        ];
        this.planeCells = [];
        this.isInDropZone = false;
        this.firstClickTime = 0;
    }

    /**
     *  Drag & drop logic
     */

    dragStart(pointer, gameObject) {
        if (gameObject !== this) return;
        this.moveToFront();
        // console.log('start  drag');
    }

    drag(pointer, gameObject, dragX, dragY) {
        if (gameObject !== this) return;
        //console.log('drag');
        gameObject.x = dragX;
        gameObject.y = dragY;

        this.scaleOnDrag(pointer);
    }

    dragEnd(pointer, gameObject) {
        if (gameObject !== this) return;
        // console.log('end drag');
        this.checkDoubleTap(pointer);
        this.checkIfInDropZone();
    }

    /**
     * Visual actions
     */
    checkIfInDropZone() {
        const dropZone = this.getDropZone();

        if (
            this.x > dropZone.x &&
            this.x < dropZone.x + dropZone.width &&
            this.y > dropZone.y &&
            this.y < dropZone.y + dropZone.height
        ) {
            // Inside drop zone
            this.setScale(1);

            this.repositionToClosest('x');
            this.repositionToClosest('y');

            this.setPlaneCells();

            this.isInDropZone = true;
        } else {
            // Outside drop zone / Go back to initial position
            this.goToInitialPosition();
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

        for (let i = 0; i < 10; i++) {
            if (i < 2) continue;

            let closest = i * game.opts.cellSize;
            let relativeDistance = this[axis] - dropZone[axis];

            if (axis === 'y') {
                relativeDistance = relativeDistance + game.opts.cellSize / 2;
            }

            if (relativeDistance - closest < game.opts.cellSize - 1) {
                // Horizontal plane
                let newPos =
                    closest +
                    dropZone[axis] +
                    (axis === 'x' ? game.opts.cellSize / 2 : 0);

                if (i > 7) {
                    // this.dragObj[axis] =
                    //     5 * 40 + dropZone[axis] + (axis === 'x' ? 20 : 0);
                    if (axis === 'x') {
                        this.x =
                            7 * game.opts.cellSize +
                            dropZone.x +
                            game.opts.cellSize / 2;
                    } else {
                        this.y = 8 * game.opts.cellSize + dropZone.y;
                    }
                } else {
                    this[axis] = newPos;
                }

                break;
            }
        }
    }

    repositionVertical(axis) {
        let dropZone = this.getDropZone();

        for (let i = 0; i < 11; i++) {
            if (i < 2) continue;

            let closest = i * game.opts.cellSize;
            let relativeDistance = this[axis] - dropZone[axis];

            if (axis === 'x') {
                relativeDistance = relativeDistance + game.opts.cellSize / 2;
            }

            if (relativeDistance - closest < game.opts.cellSize - 1) {
                // Horizontal plane
                let newPos =
                    closest +
                    dropZone[axis] +
                    (axis === 'y' ? game.opts.cellSize / 2 : 0);

                if (i > 7) {
                    // this.dragObj[axis] =
                    //     5 * 40 + dropZone[axis] + (axis === 'x' ? 20 : 0);
                    if (axis === 'x') {
                        this.x = 8 * game.opts.cellSize + dropZone.x;
                        //console.log('aici 1');
                    } else {
                        this.y =
                            8 * game.opts.cellSize +
                            dropZone.x -
                            game.opts.cellSize / 2;
                        ///console.log('aici 2');
                    }
                } else {
                    this[axis] = newPos;
                }

                break;
            }
        }
    }

    goToInitialPosition() {
        this.scene.tweens.add({
            targets: [this],
            x: this.getData('initialPos').x,
            y: this.getData('initialPos').y,
            scaleX: game.zoom * 0.4,
            scaleY: game.zoom * 0.4,
            duration: 500,
        });

        // console.log(this.scene.planes);
        delete this.scene.planes[this.planeName];
        // console.log(this.scene.planes);
    }

    scaleOnDrag(pointer) {
        if (pointer.x < this.getData('initialPos').x) {
            if (this.isInDropZone) {
                this.setScale(1.1);
            } else {
                this.setScaleNoZoom((game.config.width - this.x) / 450);
            }
        }
    }

    moveToFront() {
        const objects = this.scene.planesGameObjects;
        objects.forEach((planeGameObject) => {
            if (this === planeGameObject) {
                objects.splice(objects.indexOf(this), 1);
                objects.push(this);
            }
        });
        objects.forEach((planeGameObject) => {
            planeGameObject.setDepth(objects.indexOf(planeGameObject));
        });
    }

    /**
     *  Calculations and settings
     */
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

        if (!headCellId) {
            this.goToInitialPosition();
            return;
        }

        let headCords = headCellId.split('').map((num) => parseInt(num));
        headCords = { x: headCords[0], y: headCords[1] };

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

        // console.log(planeCells);
        this.planeCells = planeCells;

        // Push current plane to planes object
        const currPlaneExists = Object.keys(this.scene.planes).includes(
            this.planeName
        );

        if (!currPlaneExists) {
            this.scene.planes[this.planeName] = {
                cells: planeCells,
                instance: this,
            };
        } else {
            this.scene.planes[this.planeName].cells = planeCells;
        }

        // Check for overlap
        let isOverlapping = this.checkOverlap();
        //console.log(isOverlapping, this.planeName);
        if (!isOverlapping) {
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
        let keys = Object.keys(this.scene.planes);
        if (keys.length < 2) return false;

        let otherPlaneCells;

        keys.forEach((planeKey) => {
            if (planeKey !== this.planeName) {
                otherPlaneCells = this.scene.planes[planeKey].cells;
            }
        });

        let overlap = false;

        for (let i = 0; i < this.planeCells.length; i++) {
            if (otherPlaneCells.includes(this.planeCells[i])) {
                //console.log('overlap');

                // Reposition plane back to last stable positio
                if (
                    this.stablePos[0].x === this.getData('initialPos').x &&
                    this.stablePos[0].y === this.getData('initialPos').y
                ) {
                    this.goToInitialPosition();

                    //console.log('overl init');
                } else {
                    this.x = this.stablePos[0].x;
                    this.y = this.stablePos[0].y;
                    // console.log('overl afetr');
                }

                // console.log(this.planeCells[i]);

                overlap = true;
                break;
            }
        }

        return overlap;
    }

    getDropZone() {
        let { x, y, width, height } = this.scene.dropZoneRect;
        return { x, y, width, height };
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
                    x:
                        this.x +
                        (this.height * game.zoom) / 2 -
                        game.opts.cellSize / 2,
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
                    y:
                        this.y +
                        (this.height * game.zoom) / 2 -
                        game.opts.cellSize / 2,
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
                    x:
                        this.x -
                        (this.height * game.zoom) / 2 +
                        game.opts.cellSize / 2,
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
                    y:
                        this.y -
                        (this.height * game.zoom) / 2 +
                        game.opts.cellSize / 2,
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

    /**
     * Double tap check
     */
    checkDoubleTap() {
        if (!this.lastClickTime) {
            this.lastClickTime = this.scene.time.now;
            return;
        }
        const clickDelay = this.scene.time.now - this.lastClickTime;
        this.lastClickTime = this.scene.time.now;
        if (clickDelay < 350) {
            this.angle += 90;
            // this.repositionToClosest('x');
            // this.repositionToClosest('y');
        }
    }

    /**
     * Override inherited methods
     */
    setScale(scale) {
        super.setScale(scale * game.zoom);
        return this;
    }

    setScaleNoZoom(scale) {
        super.setScale(scale);
        return this;
    }
}

export default Plane;
