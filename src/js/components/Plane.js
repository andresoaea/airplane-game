class Plane extends Phaser.GameObjects.Sprite {
    constructor(config) {
        super(config.scene, config.x, config.y, 'plane-1');
        config.scene.add.existing(this);

        this.scene = config.scene;

        this.setScale(0.4)
            .setInteractive()
            .setData('initialPos', {
                x: this.x,
                y: this.y,
            });

        this.scene.input.on('pointerdown', this.startDrag, this);
    }

    startDrag(pointer, targets) {
        this.scene.input.off('pointerdown', this.startDrag, this);
        this.dragObj = targets[0];
        this.scene.input.on('pointermove', this.doDrag, this);
        this.scene.input.on('pointerup', this.stopDrag, this);
    }

    doDrag(pointer) {
        if (typeof this.dragObj !== 'undefined') {
            // Move
            this.dragObj.x = pointer.x;
            this.dragObj.y = pointer.y;

            let initialPos = this.dragObj.getData('initialPos');

            // Scale
            if (pointer.x < initialPos.x) {
                this.dragObj.setScale(
                    (game.config.width - this.dragObj.x) / 450
                );
            }
        }
    }

    stopDrag() {
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
            // this.dragObj.x = dropZone.x + this.dragObj.width / 2;
            // this.dragObj.y = dropZone.y + this.dragObj.height / 2;

            // this.scene.cells.forEach((cell) => {
            //     console.log(cell);
            // });

            this.repositionToClosest('x');
            this.repositionToClosest('y');

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
        }
    }

    repositionToClosest(axis) {
        let dropZone = this.getDropZone();

        for (let i = 0; i < 8; i++) {
            if (i < 2) continue;

            let closest = i * 40;
            let actualDist = this.dragObj[axis] - dropZone[axis];

            if (actualDist - closest < 39) {
                this.dragObj[axis] =
                    closest + dropZone[axis] + (axis === 'x' ? 20 : 0);
                break;
            }
        }
    }

    getDropZone() {
        let { x, y, width, height } = this.scene.dropZoneRect;
        return { x, y, width, height };
    }
}

export default Plane;
