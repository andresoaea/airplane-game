(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["/js/game"],{

/***/ "./src/js/Socket.js":
/*!**************************!*\
  !*** ./src/js/Socket.js ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Socket = /*#__PURE__*/function () {
  function Socket(scene) {
    var _this = this;

    _classCallCheck(this, Socket);

    this.scene = scene;
    var url = "ws://192.168.0.105:8080/comm?playerId=".concat(scene.players.player.id, "&opponentId=").concat(scene.players.opponent.id);
    var conn = new WebSocket(url); // //
    // this.toSend = null;
    // //

    conn.onopen = function (e) {
      console.log("Connection established to ".concat(url)); // this.send(this.toSend);
    };

    this.conn = conn;

    conn.onmessage = function (e) {
      // console.log(e.data);
      var msg = JSON.parse(e.data);

      _this.handleReceivedMessage(msg);
    };
  }

  _createClass(Socket, [{
    key: "handleReceivedMessage",
    value: function handleReceivedMessage(msg) {
      if (!msg.action) return;
      console.log(msg);

      switch (msg.action) {
        case 'opponentDisconnected':
          this.doOpponentDisconnected(msg);
          break;

        case 'attack':
          this.doAttack(msg);
          break;

        case 'setOpponentData':
          this.doSetOpponentData(msg);
          break;
      }
    }
  }, {
    key: "doSetOpponentData",
    value: function doSetOpponentData(msg) {
      this.scene.opponentData = msg.opponentData;
    }
  }, {
    key: "doAttack",
    value: function doAttack(msg) {
      var cellId = msg.cellClicked;
      if (!cellId) return;
      var graphics = this.scene.add.graphics({
        fillStyle: {
          color: 0x0000ff
        }
      });
      graphics.fillRectShape(this.scene.cells[cellId.replace('p', 'o')].rect);
    }
  }, {
    key: "doOpponentDisconnected",
    value: function doOpponentDisconnected(msg) {
      console.log('opponent disconnected');
      this.scene.scene.start('SetPlaneScene');
    } // Used external

  }, {
    key: "send",
    value: function send(msg) {
      if (this.conn.readyState === WebSocket.CLOSED) return;
      return this.conn.send(JSON.stringify(msg));
    } // sendOnConnect(msg) {
    //     this.toSend = msg;
    // }

  }]);

  return Socket;
}();

/* harmony default export */ __webpack_exports__["default"] = (Socket);

/***/ }),

/***/ "./src/js/components/Plane.js":
/*!************************************!*\
  !*** ./src/js/components/Plane.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var Plane = /*#__PURE__*/function (_Phaser$GameObjects$S) {
  _inherits(Plane, _Phaser$GameObjects$S);

  var _super = _createSuper(Plane);

  function Plane(config) {
    var _this;

    _classCallCheck(this, Plane);

    _this = _super.call(this, config.scene, config.x, config.y, "plane-".concat(config.planeNum));
    config.scene.add.existing(_assertThisInitialized(_this));
    _this.scene = config.scene;

    _this.setScale(0.4).setInteractive().setData('initialPos', {
      x: _this.x,
      y: _this.y
    });

    _this.scene.input.on('pointerdown', _this.startDrag, _assertThisInitialized(_this)); // Other variables


    _this.planeName = "plane".concat(config.planeNum);
    _this.stablePos = [{
      x: _this.x,
      y: _this.y
    }];
    _this.planeCells = [];
    _this.isInDropZone = false;
    _this.firstClickTime = 0; // this.lastPos = { x: 0, y: 0 };
    // this.lastAngle = 0;

    return _this;
  }

  _createClass(Plane, [{
    key: "startDrag",
    value: function startDrag(pointer, targets) {
      if (targets[0] !== this) return;
      this.dragObj = targets[0]; // this.dragObj.depth++;
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
  }, {
    key: "doDrag",
    value: function doDrag(pointer, targets) {
      if (targets[0] !== this) return;

      if (typeof this.dragObj !== 'undefined') {
        // Move
        this.dragObj.x = pointer.x - this.pointerDiffX;
        this.dragObj.y = pointer.y - this.pointerDiffY;
        var initialPos = this.dragObj.getData('initialPos'); // Scale

        if (pointer.x < initialPos.x) {
          if (this.isInDropZone) {
            this.dragObj.setScale(1.1);
          } else {
            this.dragObj.setScale((game.config.width - this.dragObj.x) / 450);
          }
        }
      }
    }
  }, {
    key: "stopDrag",
    value: function stopDrag(pointer, targets) {
      if (targets[0] !== this) return;
      this.scene.input.on('pointerdown', this.startDrag, this);
      this.scene.input.off('pointermove', this.doDrag, this);
      this.scene.input.off('pointerup', this.stopDrag, this);
      if (typeof this.dragObj == 'undefined') return; // Check if in drop zone

      var dragX = this.dragObj.x;
      var dragY = this.dragObj.y;
      var dropZone = this.getDropZone();

      if (dragX > dropZone.x && dragX < dropZone.x + dropZone.width && dragY > dropZone.y && dragY < dropZone.y + dropZone.height) {
        // Inside drop zone
        this.dragObj.setScale(1); //console.log(this.lastAngle);
        // if (
        //     (this.x !== this.lastPos.x && this.y !== this.lastPos.y) ||
        //     this.angle !== this.lastAngle
        // ) {

        this.repositionToClosest('x');
        this.repositionToClosest('y'); // }
        // this.lastPos = {
        //     x: this.x,
        //     y: this.y,
        // };
        // this.lastAngle = this.angle;

        this.setPlaneCells();
        this.isInDropZone = true; //this.dragObj.x =
      } else {
        // Outside drop zone / Go back to initial position
        this.goToInitialPosition();
        this.isInDropZone = false;
      }
    }
  }, {
    key: "goToInitialPosition",
    value: function goToInitialPosition() {
      this.scene.tweens.add({
        targets: [this.dragObj],
        x: this.dragObj.getData('initialPos').x,
        y: this.dragObj.getData('initialPos').y,
        scaleX: 0.4,
        scaleY: 0.4,
        duration: 500
      }); // console.log(this.scene.planes);

      delete this.scene.planes[this.planeName]; // console.log(this.scene.planes);
    }
  }, {
    key: "repositionToClosest",
    value: function repositionToClosest(axis) {
      var isVertical = this.angle === 90 || this.angle === -90;

      if (isVertical) {
        this.repositionVertical(axis);
      } else {
        this.repositionHorizontal(axis);
      } // console.log(isVertical);

    }
  }, {
    key: "repositionHorizontal",
    value: function repositionHorizontal(axis) {
      var dropZone = this.getDropZone();

      for (var i = 0; i < 8; i++) {
        if (i < 2) continue;
        var closest = i * 40;
        var relativeDistance = this.dragObj[axis] - dropZone[axis];

        if (axis === 'y') {
          relativeDistance = relativeDistance + 20;
        }

        if (relativeDistance - closest < 39) {
          // Horizontal plane
          var newPos = closest + dropZone[axis] + (axis === 'x' ? 20 : 0);

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
  }, {
    key: "repositionVertical",
    value: function repositionVertical(axis) {
      var dropZone = this.getDropZone();

      for (var i = 0; i < 9; i++) {
        if (i < 2) continue;
        var closest = i * 40;
        var relativeDistance = this.dragObj[axis] - dropZone[axis];

        if (axis === 'x') {
          relativeDistance = relativeDistance + 20;
        }

        if (relativeDistance - closest < 39) {
          // Horizontal plane
          var newPos = closest + dropZone[axis] + (axis === 'y' ? 20 : 0);

          if (i > 5) {
            // this.dragObj[axis] =
            //     5 * 40 + dropZone[axis] + (axis === 'x' ? 20 : 0);
            if (axis === 'x') {
              this.dragObj.x = 6 * 40 + dropZone.x; //console.log('aici 1');
            } else {
              this.dragObj.y = 5 * 40 + dropZone.x - 20; ///console.log('aici 2');
            }
          } else {
            this.dragObj[axis] = newPos;
          }

          break;
        }
      }
    }
  }, {
    key: "getDropZone",
    value: function getDropZone() {
      var _this$scene$dropZoneR = this.scene.dropZoneRect,
          x = _this$scene$dropZoneR.x,
          y = _this$scene$dropZoneR.y,
          width = _this$scene$dropZoneR.width,
          height = _this$scene$dropZoneR.height;
      return {
        x: x,
        y: y,
        width: width,
        height: height
      };
    }
  }, {
    key: "setPlaneCells",
    value: function setPlaneCells() {
      var headCellId;
      var planeData = this.getPlanePositionData();
      var headPoint = planeData.headPoint; //console.log(planeData);

      this.scene.cells.forEach(function (cell) {
        if (cell.rect.centerX === headPoint.x && cell.rect.centerY === headPoint.y) {
          headCellId = cell.id;
        }
      }); //console.log(headCellId);

      var headCords = headCellId.split('').map(function (num) {
        return parseInt(num);
      });
      headCords = {
        x: headCords[0],
        y: headCords[1]
      }; // let planeCells = [
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

      var planeCells = [];
      var schema = planeData.schema;
      var originX = headCords.x + planeData.diff.x;
      var originY = headCords.y + planeData.diff.y;

      for (var i = 0; i < schema.length; i++) {
        var line = schema[i]; //console.log('line', i);

        for (var j = 0; j < line.length; j++) {
          var cellPlaceholder = line[j];

          if (cellPlaceholder) {
            planeCells.push("".concat(originX + j).concat(originY + i));
          } //console.log(`${i + 1}${j + 1}`);

        }
      } //console.log(planeCells);


      this.planeCells = planeCells;

      if (this.scene.planes[this.planeName]) {
        this.scene.planes[this.planeName].cells = planeCells;
      } // Push current plane to planes object


      var currPlaneExists = Object.keys(this.scene.planes).includes(this.planeName);

      if (!currPlaneExists) {
        this.scene.planes[this.planeName] = {
          cells: planeCells,
          instance: this
        };
      } // let existingCurrentPlane = this.scene.planes.find((plane) => {
      //     return plane.name === this.planeName;
      // });
      // if (!existingCurrentPlane) {
      //     this.scene.planes.push({
      //         name: this.planeName,
      //         cells: planeCells,
      //         instance: this,
      //     });
      // }
      // Check for overlap


      var isOverlapping = this.checkOverlap();
      console.log(isOverlapping);

      if (!isOverlapping) {
        this.stablePos.push({
          x: this.x,
          y: this.y
        });

        if (this.stablePos.length > 1) {
          this.stablePos.shift();
        }
      } //localStorage.setItem('lastPlaceCells', planeCells.join(','));

    }
  }, {
    key: "checkOverlap",
    value: function checkOverlap() {
      var keys = Object.keys(this.scene.planes);
      if (keys.length < 2) return false;
      var firstPlaneCells = this.scene.planes[keys[0]].cells; // console.log(firstPlaneCells);

      var overlap = false;

      for (var i = 0; i < this.planeCells.length; i++) {
        if (firstPlaneCells.includes(this.planeCells[i])) {
          //console.log('overlap');
          // Reposition plane back to last stable positio
          if (this.stablePos[0].x === this.getData('initialPos').x && this.stablePos[0].y === this.getData('initialPos').y) {
            this.goToInitialPosition(); //console.log('overl init');
          } else {
            this.x = this.stablePos[0].x;
            this.y = this.stablePos[0].y; // console.log('overl afetr');
          }

          console.log(this.planeCells[i]);
          overlap = true;
          break;
        }
      }

      return overlap;
    }
  }, {
    key: "getPlanePositionData",
    value: function getPlanePositionData() {
      var schema;
      var headPoint;
      var diff; // Compute start point difference
      // It is distance in cells from plane head
      // to plane margin (top/left 0)

      switch (this.angle) {
        case 90:
          headPoint = {
            x: this.x + this.height / 2 - this.scene.cellSize / 2,
            y: this.y
          };
          schema = [[0, 0, 1, 0], [1, 0, 1, 0], [1, 1, 1, 1], [1, 0, 1, 0], [0, 0, 1, 0]];
          diff = {
            x: -3,
            y: -2
          };
          break;

        case -180:
          headPoint = {
            x: this.x,
            y: this.y + this.height / 2 - this.scene.cellSize / 2
          };
          schema = [[0, 1, 1, 1, 0], [0, 0, 1, 0, 0], [1, 1, 1, 1, 1], [0, 0, 1, 0, 0]];
          diff = {
            x: -2,
            y: -3
          };
          break;

        case -90:
          headPoint = {
            x: this.x - this.height / 2 + this.scene.cellSize / 2,
            y: this.y
          };
          schema = [[0, 1, 0, 0], [0, 1, 0, 1], [1, 1, 1, 1], [0, 1, 0, 1], [0, 1, 0, 0]];
          diff = {
            x: 0,
            y: -2
          };
          break;

        default:
          headPoint = {
            x: this.x,
            y: this.y - this.height / 2 + this.scene.cellSize / 2
          };
          schema = [[0, 0, 1, 0, 0], [1, 1, 1, 1, 1], [0, 0, 1, 0, 0], [0, 1, 1, 1, 0]];
          diff = {
            x: -2,
            y: 0
          };
      }

      return {
        schema: schema,
        headPoint: headPoint,
        diff: diff
      };
    }
  }, {
    key: "checkDoubleTap",
    value: function checkDoubleTap() {
      if (typeof this.dragObj === 'undefined') return;

      if (this.firstClickTime == 0) {
        this.firstClickTime = this.getTime();
        return;
      }

      var elapsed = this.getTime() - this.firstClickTime;

      if (elapsed < 400) {
        // Rotate plane on double tap
        this.angle += 90; // this.repositionToClosest('x');
        // this.repositionToClosest('y');
      }

      this.firstClickTime = 0;
    }
  }, {
    key: "getTime",
    value: function getTime() {
      //make a new date object
      var d = new Date(); //return the number of milliseconds since 1 January 1970 00:00:00.

      return d.getTime();
    }
  }]);

  return Plane;
}(Phaser.GameObjects.Sprite);

/* harmony default export */ __webpack_exports__["default"] = (Plane);

/***/ }),

/***/ "./src/js/components/Players.js":
/*!**************************************!*\
  !*** ./src/js/components/Players.js ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Players = /*#__PURE__*/function () {
  function Players() {
    var _this$getParameterByN, _this$getParameterByN2;

    _classCallCheck(this, Players);

    this.player = {
      id: (_this$getParameterByN = this.getParameterByName('userId')) !== null && _this$getParameterByN !== void 0 ? _this$getParameterByN : '1',
      name: 'User',
      photo: null
    };
    this.opponent = {
      id: (_this$getParameterByN2 = this.getParameterByName('opponentId')) !== null && _this$getParameterByN2 !== void 0 ? _this$getParameterByN2 : '2',
      name: 'UserOpponent',
      photo: null
    };
  } // helper for debugging


  _createClass(Players, [{
    key: "getParameterByName",
    value: function getParameterByName(name) {
      var url = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window.location.href;
      name = name.replace(/[\[\]]/g, '\\$&');
      var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
          results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }
  }]);

  return Players;
}();

/* harmony default export */ __webpack_exports__["default"] = (Players);

/***/ }),

/***/ "./src/js/game.js":
/*!************************!*\
  !*** ./src/js/game.js ***!
  \************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var phaser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! phaser */ "./node_modules/phaser/dist/phaser.js");
/* harmony import */ var phaser__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(phaser__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _scenes_LoadScene__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./scenes/LoadScene */ "./src/js/scenes/LoadScene.js");
/* harmony import */ var _scenes_MainScene__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./scenes/MainScene */ "./src/js/scenes/MainScene.js");
/* harmony import */ var _scenes_SetPlaneScene__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./scenes/SetPlaneScene */ "./src/js/scenes/SetPlaneScene.js");
 // import moment, { lang } from 'moment';
// import Swal from 'sweetalert2';
// window.moment = moment;
// window.Swal = Swal;
// //indow.jQuery = window.$ = require('jquery');

window.axios = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';



var config = {
  type: phaser__WEBPACK_IMPORTED_MODULE_0___default.a.AUTO,
  width: 800,
  height: 458,
  parent: 'game',
  // physics: {
  //     default: 'arcade',
  //     arcade: {
  //         gravity: { y: 800 },
  //         //debug: true
  //     },
  // },
  title: 'The Airplanes with Friends',
  url: '',
  version: '1.0.0'
};
var game = new phaser__WEBPACK_IMPORTED_MODULE_0___default.a.Game(config);
game.scene.add('LoadScene', new _scenes_LoadScene__WEBPACK_IMPORTED_MODULE_1__["default"]());
game.scene.add('MainScene', new _scenes_MainScene__WEBPACK_IMPORTED_MODULE_2__["default"]());
game.scene.add('SetPlaneScene', new _scenes_SetPlaneScene__WEBPACK_IMPORTED_MODULE_3__["default"]());
game.scene.start('LoadScene');
window.game = game;

/***/ }),

/***/ "./src/js/scenes/LoadScene.js":
/*!************************************!*\
  !*** ./src/js/scenes/LoadScene.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var LoadScene = /*#__PURE__*/function (_Phaser$Scene) {
  _inherits(LoadScene, _Phaser$Scene);

  var _super = _createSuper(LoadScene);

  function LoadScene() {
    _classCallCheck(this, LoadScene);

    return _super.call(this, {
      key: 'LoadScene'
    });
  }

  _createClass(LoadScene, [{
    key: "preload",
    value: function preload() {
      /**
       * LoadScene images
       */
      // this.load.multiatlas(
      //     'atlas',
      //     'assets/sprites/tp/atlas.json',
      //     'assets/sprites/tp'
      // );
      this.load.image('btn-start-game', 'assets/images/btn-start-game.png');
      this.load.image('plane-1', 'assets/images/planes/plane-1.png');
      this.load.image('plane-2', 'assets/images/planes/plane-2.png');
      this.showPreloader();
    }
  }, {
    key: "showPreloader",
    value: function showPreloader() {
      var scene = this;
      var fontStyle = {
        fontFamily: 'Play',
        fontSize: 28,
        color: '#ffffff',
        stroke: '#fff',
        strokeThickness: 2,
        shadow: {
          offsetX: 1,
          offsetY: 1,
          color: '#000',
          blur: 0,
          stroke: true,
          fill: true
        }
      };
      var progressBar = scene.add.graphics();
      var progressBox = scene.add.graphics();
      progressBox.fillStyle(0x222222, 0.05);
      progressBox.fillRect((game.config.width - 250) / 2, game.config.height / 2 + 40, 250, 50);
      var width = scene.cameras.main.width;
      var height = scene.cameras.main.height;
      var loadingText = scene.make.text({
        x: width / 2,
        y: height / 2 - 50,
        text: 'Loading...',
        style: fontStyle
      });
      loadingText.setOrigin(0.5, 0.5);
      var percentText = scene.make.text({
        x: width / 2,
        y: height / 2 - 5,
        text: '0%',
        style: fontStyle
      });
      percentText.setOrigin(0.5, 0.5);
      scene.load.on('progress', function (value) {
        percentText.setText(parseInt(value * 100) + '%');
        progressBar.clear();
        progressBar.fillStyle(0xbf4689, 1);
        progressBar.fillRect((game.config.width - 250) / 2 + 5, game.config.height / 2 + 50, 240 * value, 30);
      });
      scene.load.on('complete', function () {
        // console.log('preload done')
        progressBar.destroy();
        progressBox.destroy();
        loadingText.destroy();
        percentText.destroy(); //game.scene.start('Start');

        game.scene.start('SetPlaneScene');
      });
    }
  }]);

  return LoadScene;
}(Phaser.Scene);

/* harmony default export */ __webpack_exports__["default"] = (LoadScene);

/***/ }),

/***/ "./src/js/scenes/MainScene.js":
/*!************************************!*\
  !*** ./src/js/scenes/MainScene.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _components_Players__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../components/Players */ "./src/js/components/Players.js");
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

// import Socket from '../Socket';


var MainScene = /*#__PURE__*/function (_Phaser$Scene) {
  _inherits(MainScene, _Phaser$Scene);

  var _super = _createSuper(MainScene);

  function MainScene() {
    var _this;

    _classCallCheck(this, MainScene);

    _this = _super.call(this, {
      key: 'MainScene',
      physics: {
        arcade: {//debug: true,
        }
      }
    });
    _this.cells = {};
    _this.opponentData = {}; // it is set on Socket class

    return _this;
  }

  _createClass(MainScene, [{
    key: "init",
    value: function init(data) {
      this.myPlanesCells = data.planesData.cells; // console.log('heads', this.myPlanesCells[0], this.myPlanesCells[10]);

      this.cameras.main.setBackgroundColor('#fff');
    } //debug

  }, {
    key: "drawByCells",
    value: function drawByCells(cells) {
      var _this2 = this;

      // console.log(this.cells);
      cells.forEach(function (cl) {
        //   let graphics = this.add.graphics({ fillStyle: { color: 0x0000ff } });
        var graphics = _this2.add.graphics({
          lineStyle: {
            width: 3,
            color: 0x000000
          }
        });

        graphics.strokeRectShape(_this2.cells["o".concat(cl)].rect);
      });
    }
  }, {
    key: "create",
    value: function create() {
      this.drawSceneBackground(); // this.socket.sendOnConnect({
      //     action: 'setOpponentData',
      //     opponentData: {
      //         planesCells: this.myPlanesCells,
      //     },
      // });

      this.drawPlayerMap(40, 80);
      this.drawPlayerMap(440, 80, 'opponent'); //debug
      //window.Socket = Socket;

      window.MainScene = this;
      this.drawByCells(this.myPlanesCells);
    }
  }, {
    key: "drawPlayerMap",
    value: function drawPlayerMap(x, y) {
      var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var sqareWidth = 40;
      var cellsNum = 8;

      for (var i = 0; i < cellsNum; i++) {
        // Go vertical
        for (var j = 0; j < cellsNum; j++) {
          // Go horizontal
          this.drawRect(x + j * sqareWidth, y + i * sqareWidth, sqareWidth, i, j, type);
        }
      }
    }
  }, {
    key: "drawRect",
    value: function drawRect(x, y, sqareWidth, i, j, type) {
      var _this3 = this;

      var rect = new Phaser.Geom.Rectangle(x, y, sqareWidth, sqareWidth); //   let graphics = this.add.graphics({ fillStyle: { color: 0x0000ff } });

      var graphics = this.add.graphics({
        lineStyle: {
          width: 1,
          color: 0x0000aa
        }
      });
      graphics.strokeRectShape(rect);
      graphics.setInteractive(new Phaser.Geom.Rectangle(x, y, sqareWidth, sqareWidth), Phaser.Geom.Rectangle.Contains);
      var owner = type === 'opponent' ? 'p' : 'o';
      var id = "".concat(owner).concat(j + 1).concat(i + 1);
      this.cells[id] = {
        graphics: graphics,
        rect: rect
      }; // graphics.setData('id', id);

      graphics.on('pointerdown', function () {
        if (type !== 'opponent') return;

        _this3.socket.send({
          action: 'attack',
          cellClicked: id
        }); // console.log(graphics.getData('id'));


        graphics = _this3.add.graphics({
          fillStyle: {
            color: 0x0000ff
          }
        });
        graphics.fillRectShape(rect);
      });
    }
  }, {
    key: "drawSceneBackground",
    value: function drawSceneBackground() {
      var x = 0;
      var y = 0;
      var sqareWidth = 40;
      var cellsNum = 20;

      for (var i = 0; i < cellsNum; i++) {
        // Go vertical
        for (var j = 0; j < cellsNum; j++) {
          // Go horizontal
          this.drawBgRect(x + j * sqareWidth, y + i * sqareWidth, sqareWidth, i, j);
        }
      }
    }
  }, {
    key: "drawBgRect",
    value: function drawBgRect(x, y, sqareWidth, i, j) {
      var rect = new Phaser.Geom.Rectangle(x, y, sqareWidth, sqareWidth); //   let graphics = this.add.graphics({ fillStyle: { color: 0x0000ff } });

      var graphics = this.add.graphics({
        lineStyle: {
          width: 1,
          color: 0xeeeeee
        }
      });
      graphics.strokeRectShape(rect);
    }
  }]);

  return MainScene;
}(Phaser.Scene);

/* harmony default export */ __webpack_exports__["default"] = (MainScene);

/***/ }),

/***/ "./src/js/scenes/SetPlaneScene.js":
/*!****************************************!*\
  !*** ./src/js/scenes/SetPlaneScene.js ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _components_Players__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../components/Players */ "./src/js/components/Players.js");
/* harmony import */ var _components_Plane__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../components/Plane */ "./src/js/components/Plane.js");
/* harmony import */ var _Socket__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Socket */ "./src/js/Socket.js");
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }





var SetPlaneScene = /*#__PURE__*/function (_Phaser$Scene) {
  _inherits(SetPlaneScene, _Phaser$Scene);

  var _super = _createSuper(SetPlaneScene);

  function SetPlaneScene() {
    var _this;

    _classCallCheck(this, SetPlaneScene);

    _this = _super.call(this, {
      key: 'SetPlaneScene',
      physics: {
        arcade: {//debug: true,
        }
      }
    });
    _this.cellSize = 40;
    _this.cells = [];
    _this.planes = {};
    return _this;
  }

  _createClass(SetPlaneScene, [{
    key: "init",
    value: function init() {
      this.cameras.main.setBackgroundColor('#fff');
    }
  }, {
    key: "create",
    value: function create() {
      this.drawSceneBackground(); // Setup players

      this.players = new _components_Players__WEBPACK_IMPORTED_MODULE_0__["default"]();
      var x = 120;
      var y = 80;
      this.drawPlayerMap(x, y); //this.plane = new Plane(this);

      var plane1 = new _components_Plane__WEBPACK_IMPORTED_MODULE_1__["default"]({
        scene: this,
        x: game.config.width / 2 + 200,
        y: 140,
        planeNum: 1
      });
      var plane2 = new _components_Plane__WEBPACK_IMPORTED_MODULE_1__["default"]({
        scene: this,
        x: game.config.width / 2 + 300,
        y: 140,
        planeNum: 2
      }); // Start game btn

      this.addStartGame();
      var mainScene = game.scene.getScene('MainScene');
      mainScene.players = this.players;
      this.socket = new _Socket__WEBPACK_IMPORTED_MODULE_2__["default"](mainScene);
      mainScene.socket = this.socket; //debug
      // window.Socket = Socket;

      window.SetPlaneScene = this; // let cls = localStorage.getItem('lastPlaceCells').split(',');
      // this.drawByCells(cls);
    }
  }, {
    key: "addStartGame",
    value: function addStartGame() {
      var _this2 = this;

      this.add.image(630, 380, 'btn-start-game').setInteractive({
        useHandCursor: true
      }).on('pointerup', function () {
        // let heads = [];
        var allPlanesCells = [];
        var keys = Object.keys(_this2.planes);
        var keysLength = keys.length;

        if (keysLength < 2) {
          // add 2 planes
          return;
        }

        for (var i = 0; i < keysLength; i++) {
          //heads.push(this.planes[keys[i]].cells[0]);
          allPlanesCells = [].concat(_toConsumableArray(allPlanesCells), _toConsumableArray(_this2.planes[keys[i]].cells));
        }

        _this2.scene.stop();

        _this2.scene.start('MainScene', {
          planesData: {
            cells: allPlanesCells
          }
        });
      });
    } // debug

  }, {
    key: "drawByCells",
    value: function drawByCells(cells) {
      var _this3 = this;

      cells.forEach(function (cl) {
        //   let graphics = this.add.graphics({ fillStyle: { color: 0x0000ff } });
        var graphics = _this3.add.graphics({
          lineStyle: {
            width: 3,
            color: 0x000000
          }
        });

        graphics.strokeRectShape(_this3.cells[cl].rect);
      });
    }
  }, {
    key: "drawPlayerMap",
    value: function drawPlayerMap(x, y) {
      var squareWidth = this.cellSize;
      var cellsNum = 8;

      for (var i = 0; i < cellsNum; i++) {
        // Go vertical
        for (var j = 0; j < cellsNum; j++) {
          // Go horizontal
          this.drawRect(x + j * squareWidth, y + i * squareWidth, squareWidth, i, j);
        }
      }

      this.drawBorder(x, y, squareWidth, cellsNum);
    }
  }, {
    key: "drawBorder",
    value: function drawBorder(x, y, squareWidth, cellsNum) {
      var width = squareWidth * cellsNum;
      var rect = new Phaser.Geom.Rectangle(x, y, width, width); //   let graphics = this.add.graphics({ fillStyle: { color: 0x0000ff } });

      var graphics = this.add.graphics({
        lineStyle: {
          width: 3,
          color: 0x000000
        }
      });
      graphics.strokeRectShape(rect);
      this.dropZoneRect = rect;
    }
  }, {
    key: "drawRect",
    value: function drawRect(x, y, squareWidth, i, j, type) {
      var rect = new Phaser.Geom.Rectangle(x, y, squareWidth, squareWidth); //   let graphics = this.add.graphics({ fillStyle: { color: 0x0000ff } });

      var graphics = this.add.graphics({
        lineStyle: {
          width: 1,
          color: 0x000000
        }
      });
      graphics.strokeRectShape(rect);
      var id = "".concat(j + 1).concat(i + 1);
      this.cells[id] = {
        id: id,
        rect: rect
      };
    }
  }, {
    key: "drawSceneBackground",
    value: function drawSceneBackground() {
      var x = 0;
      var y = 0;
      var squareWidth = this.cellSize;
      var cellsNum = 20;

      for (var i = 0; i < cellsNum; i++) {
        // Go vertical
        for (var j = 0; j < cellsNum; j++) {
          // Go horizontal
          this.drawBgRect(x + j * squareWidth, y + i * squareWidth, squareWidth, i, j);
        }
      }
    }
  }, {
    key: "drawBgRect",
    value: function drawBgRect(x, y, squareWidth, i, j) {
      var rect = new Phaser.Geom.Rectangle(x, y, squareWidth, squareWidth); //   let graphics = this.add.graphics({ fillStyle: { color: 0x0000ff } });

      var graphics = this.add.graphics({
        lineStyle: {
          width: 1,
          color: 0xeeeeee
        }
      });
      graphics.strokeRectShape(rect);
    }
  }]);

  return SetPlaneScene;
}(Phaser.Scene);

/* harmony default export */ __webpack_exports__["default"] = (SetPlaneScene);

/***/ }),

/***/ "./src/sass/game.scss":
/*!****************************!*\
  !*** ./src/sass/game.scss ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 0:
/*!***************************************************!*\
  !*** multi ./src/js/game.js ./src/sass/game.scss ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! /var/www/html/airplane/src/js/game.js */"./src/js/game.js");
module.exports = __webpack_require__(/*! /var/www/html/airplane/src/sass/game.scss */"./src/sass/game.scss");


/***/ })

},[[0,"/js/manifest","/js/vendor"]]]);
//# sourceMappingURL=game.js.map