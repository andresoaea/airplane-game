(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["/js/game"],{

/***/ "./src/js/GameData.js":
/*!****************************!*\
  !*** ./src/js/GameData.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _components_Players__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/Players */ "./src/js/components/Players.js");
/* harmony import */ var _components_Turn__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/Turn */ "./src/js/components/Turn.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }




var GameData = /*#__PURE__*/function () {
  function GameData() {
    var _this$getParameterByN;

    _classCallCheck(this, GameData);

    var imageNum = this.getId() == 1 ? 1 : 2; //console.log(imageNum);

    this.players = {
      player: {
        id: this.getId(),
        name: 'User' + ((_this$getParameterByN = this.getParameterByName('userId')) !== null && _this$getParameterByN !== void 0 ? _this$getParameterByN : '1'),
        photo: "assets/images/profile-".concat(imageNum, ".jpg")
      }
    };
    this.turn = new _components_Turn__WEBPACK_IMPORTED_MODULE_1__["default"]();
  } // Called from Socket class


  _createClass(GameData, [{
    key: "setOpponent",
    value: function setOpponent(opponent) {
      this.players.opponent = opponent;
      var setPlaneScene = game.scene.getScene('SetPlaneScene');
      setPlaneScene.playersComponent = new _components_Players__WEBPACK_IMPORTED_MODULE_0__["default"](setPlaneScene);
    } // helper for debugging

  }, {
    key: "getId",
    value: function getId() {
      var _this$getParameterByN2;

      return (_this$getParameterByN2 = this.getParameterByName('userId')) !== null && _this$getParameterByN2 !== void 0 ? _this$getParameterByN2 : 1;
    }
  }, {
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

  return GameData;
}();

/* harmony default export */ __webpack_exports__["default"] = (GameData);

/***/ }),

/***/ "./src/js/Socket.js":
/*!**************************!*\
  !*** ./src/js/Socket.js ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function($) {function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Socket = /*#__PURE__*/function () {
  function Socket() {
    var _this = this;

    _classCallCheck(this, Socket);

    this.scene = game.scene.getScene('MainScene');
    var queryString = $.param(game.gameData.players.player);
    var url = "ws://192.168.0.105:8080/comm?".concat(queryString);
    var conn = new WebSocket(url);

    conn.onopen = function (e) {
      console.log("Connection established to ".concat(url));
    };

    this.conn = conn;

    conn.onmessage = function (e) {
      // console.log(e.data);
      var msg = JSON.parse(e.data);

      _this.handleReceivedMessage(msg);
    };

    conn.onerror = function () {
      Swal.fire({
        title: 'Ouups!',
        text: "We can't connect to the server now. Please try again later.",
        icon: 'error',
        showConfirmButton: false
      });
    };
  }

  _createClass(Socket, [{
    key: "handleReceivedMessage",
    value: function handleReceivedMessage(msg) {
      if (!msg.action) return;
      console.log(msg);

      switch (msg.action) {
        case 'setMyRoom':
          game.scene.getScene('SetOpponentScene').showMyRoomId(msg.room);
          game.gameData.turn.setIsMyTurn(true);
          break;

        case 'invalidRoom':
          game.scene.getScene('SetOpponentScene').printInvalidRoom();
          break;

        case 'enterToRoom':
          game.gameData.setOpponent(msg.opponent);
          game.scene.getScene('SetOpponentScene').startRoom(msg.room);
          break;

        case 'opponentDisconnected':
          this.doOpponentDisconnected(msg);
          break;

        case 'attack':
          this.doAttack(msg);
          game.gameData.turn.reverse();
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
      var cellNum = cellId.replace('p', '');
      var rect = this.scene.cells[cellId.replace('p', 'o')].rect;

      if (this.scene.myPlanesCells.includes(cellNum)) {
        // Targeted point
        var texture = this.scene.myPlanesCells[0] == cellNum || this.scene.myPlanesCells[10] == cellNum ? 'fire-cap' : 'fire';
        this.scene.add.image(rect.centerX, rect.centerY, texture).setScale(0.8);
      } else {
        // Missed point
        this.scene.add.image(rect.centerX, rect.centerY, 'x').setScale(0.8);
      } // const graphics = this.scene.add.graphics({
      //     fillStyle: { color },
      // });
      // graphics.fillRectShape(this.scene.cells[cellId.replace('p', 'o')].rect);

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
    }
  }]);

  return Socket;
}();

/* harmony default export */ __webpack_exports__["default"] = (Socket);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js")))

/***/ }),

/***/ "./src/js/components/Background.js":
/*!*****************************************!*\
  !*** ./src/js/components/Background.js ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Background = /*#__PURE__*/function () {
  function Background(scene) {
    _classCallCheck(this, Background);

    this.scene = scene;
    this.draw();
  }

  _createClass(Background, [{
    key: "draw",
    value: function draw() {
      var x = 0;
      var y = 0;
      var squareWidth = game.opts.cellSize;
      var cellsNum = 26;

      for (var i = 0; i < cellsNum; i++) {
        // Go vertical
        for (var j = 0; j < cellsNum; j++) {
          // Go horizontal
          this.drawSingleRect(x + j * squareWidth, y + i * squareWidth, squareWidth, i, j);
        }
      }
    }
  }, {
    key: "drawSingleRect",
    value: function drawSingleRect(x, y, squareWidth, i, j) {
      var rect = new Phaser.Geom.Rectangle(x, y, squareWidth, squareWidth);
      var graphics = this.scene.add.graphics({
        lineStyle: {
          width: 1 * game.zoom,
          color: 0xeeeeee
        }
      });
      graphics.strokeRectShape(rect);
    }
  }]);

  return Background;
}();

/* harmony default export */ __webpack_exports__["default"] = (Background);

/***/ }),

/***/ "./src/js/components/Map.js":
/*!**********************************!*\
  !*** ./src/js/components/Map.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function($) {function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Map = /*#__PURE__*/function () {
  function Map(scene, x, y) {
    var type = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
    var isMainScene = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

    _classCallCheck(this, Map);

    this.type = type;
    this.scene = scene;
    this.x = x * game.zoom;
    this.y = y * game.zoom;
    this.isMainScene = isMainScene;
    this.drawMap();
  }

  _createClass(Map, [{
    key: "drawMap",
    value: function drawMap() {
      var squareWidth = game.opts.cellSize;
      var cellsNum = 10;

      for (var i = 0; i < cellsNum; i++) {
        // Go vertical
        for (var j = 0; j < cellsNum; j++) {
          // Go horizontal
          this.drawRect(this.x + j * squareWidth, this.y + i * squareWidth, squareWidth, i, j);
        }
      }

      this.drawBorder(this.x, this.y, squareWidth, cellsNum); // Draw coordinates

      var letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];

      for (var _i = 0; _i < letters.length; _i++) {
        // Draw letters
        var letter = letters[_i].toUpperCase();

        this.drawText(letter, this.x - game.opts.cellSize / 2, this.y + game.opts.cellSize / 2 + game.opts.cellSize * _i); // Draw numbers

        this.drawText(_i + 1, this.x + game.opts.cellSize / 2 + game.opts.cellSize * _i, this.y - game.opts.cellSize / 2);
      }
    }
  }, {
    key: "drawBorder",
    value: function drawBorder(x, y, squareWidth, cellsNum) {
      var width = squareWidth * cellsNum;
      var rect = new Phaser.Geom.Rectangle(x, y, width, width);
      var graphics = this.scene.add.graphics({
        lineStyle: {
          width: 3 * game.zoom,
          color: 0x424242
        }
      });
      graphics.strokeRectShape(rect);
      this.scene.dropZoneRect = rect;
    }
  }, {
    key: "drawRect",
    value: function drawRect(x, y, squareWidth, i, j) {
      var _this = this;

      var rect = new Phaser.Geom.Rectangle(x, y, squareWidth, squareWidth); //   let graphics = this.add.graphics({ fillStyle: { color: 0x0000ff } });

      var graphics = this.scene.add.graphics({
        lineStyle: {
          width: 1 * game.zoom,
          color: 0x424242
        }
      });
      graphics.strokeRectShape(rect);

      if (this.isMainScene) {
        // Rect in MainScene
        graphics.setInteractive(new Phaser.Geom.Rectangle(x, y, squareWidth, squareWidth), Phaser.Geom.Rectangle.Contains);
        var owner = this.type === 'opponent' ? 'p' : 'o';
        var id = "".concat(owner).concat(j + 1).concat(i + 1);
        this.scene.cells[id] = {
          graphics: graphics,
          rect: rect
        };
        graphics.on('pointerdown', function () {
          if (_this.type !== 'opponent') return;

          if ($.isEmptyObject(_this.scene.opponentData)) {
            console.log('opponent not ready yet');
            return;
          }

          if (!_this.scene.turn.isMyTurn) {
            //console.log('not my turn');
            game.gameData.turn.scaleText();
            return;
          }

          _this.scene.socket.send({
            action: 'attack',
            cellClicked: id
          });

          var cellNum = "".concat(j + 1).concat(i + 1);

          if (_this.scene.opponentData.planesCells.includes(cellNum)) {
            // Targeted point
            var gph = _this.scene.add.graphics({
              fillStyle: {
                color: 0x800000
              }
            });

            gph.fillRectShape(rect);
            var texture = _this.scene.opponentData.planesCells[0] == cellNum || _this.scene.opponentData.planesCells[10] == cellNum ? 'fire-cap' : 'fire';

            _this.scene.add.image(rect.centerX, rect.centerY, texture).setScale(0.6);
          } else {
            // Missed point
            _this.scene.add.image(rect.centerX, rect.centerY, 'x').setScale(0.6);
          }

          game.gameData.turn.reverse();
        });
      } else {
        // Rect in SetPlaneScene
        var _id = "".concat(j + 1).concat(i + 1);

        this.scene.cells[_id] = {
          id: _id,
          rect: rect
        };
      }
    }
  }, {
    key: "drawText",
    value: function drawText(text, x, y) {
      var fontSize = 16 * game.zoom;
      this.scene.add.text(x, y, text, {
        color: '#424242',
        fontFamily: 'Righteous',
        // stroke: '#000',
        // strokeThickness: 1,
        fontSize: "".concat(fontSize, "px")
      }).setOrigin(0.5).setDepth(4);
    }
  }]);

  return Map;
}();

/* harmony default export */ __webpack_exports__["default"] = (Map);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js")))

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

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

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

    _this = _super.call(this, config.scene, config.x * game.zoom, config.y * game.zoom, "plane-".concat(config.planeNum));
    config.scene.add.existing(_assertThisInitialized(_this));
    _this.scene = config.scene;

    _this.setScale(0.4).setInteractive().setData('initialPos', {
      x: _this.x,
      y: _this.y
    });

    _this.setInteractive();

    _this.scene.input.setDraggable(_assertThisInitialized(_this));

    _this.scene.input.on('dragstart', _this.dragStart, _assertThisInitialized(_this));

    _this.scene.input.on('dragend', _this.dragEnd, _assertThisInitialized(_this));

    _this.scene.input.on('drag', _this.drag, _assertThisInitialized(_this)); // Other variables
    //this.dragObj = null;


    _this.planeName = "plane".concat(config.planeNum);
    _this.stablePos = [{
      x: _this.x,
      y: _this.y
    }];
    _this.planeCells = [];
    _this.isInDropZone = false;
    _this.firstClickTime = 0;
    return _this;
  }
  /**
   *  Drag & drop logic
   */


  _createClass(Plane, [{
    key: "dragStart",
    value: function dragStart(pointer, gameObject) {
      if (gameObject !== this) return;
      this.moveToFront(); // console.log('start  drag');
    }
  }, {
    key: "drag",
    value: function drag(pointer, gameObject, dragX, dragY) {
      if (gameObject !== this) return; //console.log('drag');

      gameObject.x = dragX;
      gameObject.y = dragY;
      this.scaleOnDrag(pointer);
    }
  }, {
    key: "dragEnd",
    value: function dragEnd(pointer, gameObject) {
      if (gameObject !== this) return; // console.log('end drag');

      this.checkDoubleTap(pointer);
      this.checkIfInDropZone();
    }
    /**
     * Visual actions
     */

  }, {
    key: "checkIfInDropZone",
    value: function checkIfInDropZone() {
      var dropZone = this.getDropZone();

      if (this.x > dropZone.x && this.x < dropZone.x + dropZone.width && this.y > dropZone.y && this.y < dropZone.y + dropZone.height) {
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

      for (var i = 0; i < 10; i++) {
        if (i < 2) continue;
        var closest = i * game.opts.cellSize;
        var relativeDistance = this[axis] - dropZone[axis];

        if (axis === 'y') {
          relativeDistance = relativeDistance + game.opts.cellSize / 2;
        }

        if (relativeDistance - closest < game.opts.cellSize - 1) {
          // Horizontal plane
          var newPos = closest + dropZone[axis] + (axis === 'x' ? game.opts.cellSize / 2 : 0);

          if (i > 7) {
            // this.dragObj[axis] =
            //     5 * 40 + dropZone[axis] + (axis === 'x' ? 20 : 0);
            if (axis === 'x') {
              this.x = 7 * game.opts.cellSize + dropZone.x + game.opts.cellSize / 2;
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
  }, {
    key: "repositionVertical",
    value: function repositionVertical(axis) {
      var dropZone = this.getDropZone();

      for (var i = 0; i < 11; i++) {
        if (i < 2) continue;
        var closest = i * game.opts.cellSize;
        var relativeDistance = this[axis] - dropZone[axis];

        if (axis === 'x') {
          relativeDistance = relativeDistance + game.opts.cellSize / 2;
        }

        if (relativeDistance - closest < game.opts.cellSize - 1) {
          // Horizontal plane
          var newPos = closest + dropZone[axis] + (axis === 'y' ? game.opts.cellSize / 2 : 0);

          if (i > 7) {
            // this.dragObj[axis] =
            //     5 * 40 + dropZone[axis] + (axis === 'x' ? 20 : 0);
            if (axis === 'x') {
              this.x = 8 * game.opts.cellSize + dropZone.x; //console.log('aici 1');
            } else {
              this.y = 8 * game.opts.cellSize + dropZone.x - game.opts.cellSize / 2; ///console.log('aici 2');
            }
          } else {
            this[axis] = newPos;
          }

          break;
        }
      }
    }
  }, {
    key: "goToInitialPosition",
    value: function goToInitialPosition() {
      this.scene.tweens.add({
        targets: [this],
        x: this.getData('initialPos').x,
        y: this.getData('initialPos').y,
        scaleX: game.zoom * 0.4,
        scaleY: game.zoom * 0.4,
        duration: 500
      }); // console.log(this.scene.planes);

      delete this.scene.planes[this.planeName]; // console.log(this.scene.planes);
    }
  }, {
    key: "scaleOnDrag",
    value: function scaleOnDrag(pointer) {
      if (pointer.x < this.getData('initialPos').x) {
        if (this.isInDropZone) {
          this.setScale(1.1);
        } else {
          this.setScaleNoZoom((game.config.width - this.x) / 450);
        }
      }
    }
  }, {
    key: "moveToFront",
    value: function moveToFront() {
      var _this2 = this;

      var objects = this.scene.planesGameObjects;
      objects.forEach(function (planeGameObject) {
        if (_this2 === planeGameObject) {
          objects.splice(objects.indexOf(_this2), 1);
          objects.push(_this2);
        }
      });
      objects.forEach(function (planeGameObject) {
        planeGameObject.setDepth(objects.indexOf(planeGameObject));
      });
    }
    /**
     *  Calculations and settings
     */

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
      });

      if (!headCellId) {
        this.goToInitialPosition();
        return;
      }

      var headCords = headCellId.split('').map(function (num) {
        return parseInt(num);
      });
      headCords = {
        x: headCords[0],
        y: headCords[1]
      };
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
      } // console.log(planeCells);


      this.planeCells = planeCells; // Push current plane to planes object

      var currPlaneExists = Object.keys(this.scene.planes).includes(this.planeName);

      if (!currPlaneExists) {
        this.scene.planes[this.planeName] = {
          cells: planeCells,
          instance: this
        };
      } else {
        this.scene.planes[this.planeName].cells = planeCells;
      } // Check for overlap


      var isOverlapping = this.checkOverlap(); //console.log(isOverlapping, this.planeName);

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
      var _this3 = this;

      var keys = Object.keys(this.scene.planes);
      if (keys.length < 2) return false;
      var otherPlaneCells;
      keys.forEach(function (planeKey) {
        if (planeKey !== _this3.planeName) {
          otherPlaneCells = _this3.scene.planes[planeKey].cells;
        }
      });
      var overlap = false;

      for (var i = 0; i < this.planeCells.length; i++) {
        if (otherPlaneCells.includes(this.planeCells[i])) {
          //console.log('overlap');
          // Reposition plane back to last stable positio
          if (this.stablePos[0].x === this.getData('initialPos').x && this.stablePos[0].y === this.getData('initialPos').y) {
            this.goToInitialPosition(); //console.log('overl init');
          } else {
            this.x = this.stablePos[0].x;
            this.y = this.stablePos[0].y; // console.log('overl afetr');
          } // console.log(this.planeCells[i]);


          overlap = true;
          break;
        }
      }

      return overlap;
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
            x: this.x + this.height * game.zoom / 2 - game.opts.cellSize / 2,
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
            y: this.y + this.height * game.zoom / 2 - game.opts.cellSize / 2
          };
          schema = [[0, 1, 1, 1, 0], [0, 0, 1, 0, 0], [1, 1, 1, 1, 1], [0, 0, 1, 0, 0]];
          diff = {
            x: -2,
            y: -3
          };
          break;

        case -90:
          headPoint = {
            x: this.x - this.height * game.zoom / 2 + game.opts.cellSize / 2,
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
            y: this.y - this.height * game.zoom / 2 + game.opts.cellSize / 2
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
    /**
     * Double tap check
     */

  }, {
    key: "checkDoubleTap",
    value: function checkDoubleTap() {
      if (!this.lastClickTime) {
        this.lastClickTime = this.scene.time.now;
        return;
      }

      var clickDelay = this.scene.time.now - this.lastClickTime;
      this.lastClickTime = this.scene.time.now;

      if (clickDelay < 350) {
        this.angle += 90; // this.repositionToClosest('x');
        // this.repositionToClosest('y');
      }
    }
    /**
     * Override inherited methods
     */

  }, {
    key: "setScale",
    value: function setScale(scale) {
      _get(_getPrototypeOf(Plane.prototype), "setScale", this).call(this, scale * game.zoom);

      return this;
    }
  }, {
    key: "setScaleNoZoom",
    value: function setScaleNoZoom(scale) {
      _get(_getPrototypeOf(Plane.prototype), "setScale", this).call(this, scale);

      return this;
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
  function Players(scene) {
    _classCallCheck(this, Players);

    this.scene = scene;
    this.player = game.gameData.players.player;
    this.opponent = game.gameData.players.opponent;
    this.printBackground();
    this.printPlayer();
    this.loadOpponent();
  }

  _createClass(Players, [{
    key: "printBackground",
    value: function printBackground() {
      var rect = new Phaser.Geom.Rectangle(0, 0, game.config.width, 66 * game.zoom);
      var graphics = this.scene.add.graphics();
      graphics.fillStyle(0x000000, 0.6);
      graphics.fillRectShape(rect);
    }
  }, {
    key: "loadOpponent",
    value: function loadOpponent() {
      if (this.scene.textures.exists("opponent-".concat(this.opponent.id))) {
        this.printOpponent();
        return;
      }

      this.scene.load.image("opponent-".concat(this.opponent.id), this.opponent.photo);
      this.scene.load.on('complete', this.printOpponent, this);
      this.scene.load.start();
    }
  }, {
    key: "printPlayer",
    value: function printPlayer() {
      this.printPlayerPhoto('player', 30, 10);
      this.printPlayerName(this.player.name, 90, 50, 0);
    }
  }, {
    key: "printOpponent",
    value: function printOpponent() {
      this.printPlayerPhoto("opponent-".concat(this.opponent.id), game.opts.defaultWidth - 80, 10);
      this.printPlayerName(this.opponent.name, game.opts.defaultWidth - 90, 50);
    }
  }, {
    key: "printPlayerPhoto",
    value: function printPlayerPhoto(key, x, y) {
      var width = 50 * game.zoom;
      var height = width;
      x = x * game.zoom;
      y = y * game.zoom; // Create mask

      var shape = this.scene.add.graphics();
      shape.fillStyle(0x000000, 1);
      shape.fillRoundedRect(x, y, width, height, 6);
      var mask = shape.createGeometryMask(); // Add player image

      var img = this.scene.add.image(x, y, key).setDepth(4).setMask(mask).setOrigin(0);
      img.displayWidth = width;
      img.displayHeight = height;
    }
  }, {
    key: "printPlayerName",
    value: function printPlayerName(name, x, y) {
      var originX = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
      var fontSize = 20 * game.zoom;
      this.scene.add.text(x * game.zoom, y * game.zoom, name, {
        color: '#fff',
        fontFamily: 'Righteous',
        stroke: 'rgba(0,0,0,.6)',
        strokeThickness: 1,
        fontSize: "".concat(fontSize, "px")
      }).setOrigin(originX, 0.5).setDepth(4);
    }
  }]);

  return Players;
}();

/* harmony default export */ __webpack_exports__["default"] = (Players);

/***/ }),

/***/ "./src/js/components/Turn.js":
/*!***********************************!*\
  !*** ./src/js/components/Turn.js ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Turn = /*#__PURE__*/function () {
  function Turn() {
    _classCallCheck(this, Turn);

    this.text = null;
    this.isMyTurn = false; // used in Mainscene to allow/disallow clicking on cells
  }

  _createClass(Turn, [{
    key: "setScene",
    value: function setScene(scene) {
      this.scene = scene;
      this.printTurnText();
      this.updateTurnText();
    }
  }, {
    key: "setIsMyTurn",
    value: function setIsMyTurn(bool) {
      this.isMyTurn = bool;
    }
  }, {
    key: "reverse",
    value: function reverse() {
      this.isMyTurn = !this.isMyTurn;
      this.updateTurnText();
    }
  }, {
    key: "getTurnText",
    value: function getTurnText() {
      return this.isMyTurn ? 'Your turn' : 'Opponent turn. Please wait..';
    }
  }, {
    key: "printTurnText",
    value: function printTurnText() {
      var fontSize = 16 * game.zoom;
      this.text = this.scene.add.text(game.config.width / 2, 36 * game.zoom, this.getTurnText(), {
        color: '#fff',
        fontFamily: 'Righteous',
        stroke: 'rgba(0,0,0,.6)',
        strokeThickness: 1,
        fontSize: "".concat(fontSize, "px")
      }).setOrigin(0.5).setDepth(4);
    }
  }, {
    key: "updateTurnText",
    value: function updateTurnText() {
      var _this = this;

      setTimeout(function () {
        var color = _this.isMyTurn ? '#0a9c00' : '#f79e0f';

        _this.text.setText(_this.getTurnText()).setColor(color);

        var tween = _this.scene.tweens.add({
          targets: [_this.text],
          scaleX: 1.5,
          scaleY: 1.5,
          duration: 400,
          yoyo: true,
          onComplete: function onComplete() {
            _this.text.setColor('#fff').setScale(1);
          }
        });
      }, 400);
    }
  }, {
    key: "scaleText",
    value: function scaleText() {
      var _this2 = this;

      this.text.setText(this.getTurnText()).setColor('#ff0000');
      var tween = this.scene.tweens.add({
        targets: [this.text],
        scaleX: 1.5,
        scaleY: 1.5,
        duration: 400,
        yoyo: true,
        onComplete: function onComplete() {
          _this2.text.setColor('#fff').setScale(1);
        }
      });
    }
  }]);

  return Turn;
}();

/* harmony default export */ __webpack_exports__["default"] = (Turn);

/***/ }),

/***/ "./src/js/game.js":
/*!************************!*\
  !*** ./src/js/game.js ***!
  \************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(__webpack_provided_window_dot_jQuery) {/* harmony import */ var phaser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! phaser */ "./node_modules/phaser/dist/phaser.js");
/* harmony import */ var phaser__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(phaser__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var sweetalert2__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! sweetalert2 */ "./node_modules/sweetalert2/dist/sweetalert2.all.js");
/* harmony import */ var sweetalert2__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(sweetalert2__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./helpers */ "./src/js/helpers.js");
/* harmony import */ var _scenes_LoadScene__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./scenes/LoadScene */ "./src/js/scenes/LoadScene.js");
/* harmony import */ var _scenes_MainScene__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./scenes/MainScene */ "./src/js/scenes/MainScene.js");
/* harmony import */ var _scenes_StartScene__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./scenes/StartScene */ "./src/js/scenes/StartScene.js");
/* harmony import */ var _scenes_SetPlaneScene__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./scenes/SetPlaneScene */ "./src/js/scenes/SetPlaneScene.js");
/* harmony import */ var _scenes_SetOpponentScene__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./scenes/SetOpponentScene */ "./src/js/scenes/SetOpponentScene.js");



window.Swal = sweetalert2__WEBPACK_IMPORTED_MODULE_1___default.a;
__webpack_provided_window_dot_jQuery = window.$ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js"); // window.axios = require('axios');
// window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';






var zoom = _helpers__WEBPACK_IMPORTED_MODULE_2__["default"].getDevicePixelRatio();
var config = {
  type: phaser__WEBPACK_IMPORTED_MODULE_0___default.a.AUTO,
  width: 800 * zoom,
  height: 458 * zoom,
  parent: 'game',
  title: 'The Airplanes with Friends',
  version: '0.1.0',
  url: ''
};
var game = new phaser__WEBPACK_IMPORTED_MODULE_0___default.a.Game(config);
game.zoom = zoom;
game.opts = {
  cellSize: 32 * zoom,
  defaultWidth: 800,
  defaultHeight: 458
};
game.scene.add('LoadScene', new _scenes_LoadScene__WEBPACK_IMPORTED_MODULE_3__["default"]());
game.scene.add('MainScene', new _scenes_MainScene__WEBPACK_IMPORTED_MODULE_4__["default"]());
game.scene.add('StartScene', new _scenes_StartScene__WEBPACK_IMPORTED_MODULE_5__["default"]());
game.scene.add('SetPlaneScene', new _scenes_SetPlaneScene__WEBPACK_IMPORTED_MODULE_6__["default"]());
game.scene.add('SetOpponentScene', new _scenes_SetOpponentScene__WEBPACK_IMPORTED_MODULE_7__["default"]());
game.scene.start('LoadScene');
window.game = game;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js")))

/***/ }),

/***/ "./src/js/helpers.js":
/*!***************************!*\
  !*** ./src/js/helpers.js ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  getDevicePixelRatio: function getDevicePixelRatio() {
    var mediaQuery;
    var is_firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

    if (window.devicePixelRatio !== undefined && !is_firefox) {
      return window.devicePixelRatio;
    } else if (window.matchMedia) {
      mediaQuery = '(-webkit-min-device-pixel-ratio: 1.5),\
              (min--moz-device-pixel-ratio: 1.5),\
              (-o-min-device-pixel-ratio: 3/2),\
              (min-resolution: 1.5dppx)';

      if (window.matchMedia(mediaQuery).matches) {
        return 1.5;
      }

      mediaQuery = '(-webkit-min-device-pixel-ratio: 2),\
              (min--moz-device-pixel-ratio: 2),\
              (-o-min-device-pixel-ratio: 2/1),\
              (min-resolution: 2dppx)';

      if (window.matchMedia(mediaQuery).matches) {
        return 2;
      }

      mediaQuery = '(-webkit-min-device-pixel-ratio: 0.75),\
              (min--moz-device-pixel-ratio: 0.75),\
              (-o-min-device-pixel-ratio: 3/4),\
              (min-resolution: 0.75dppx)';

      if (window.matchMedia(mediaQuery).matches) {
        return 0.7;
      }
    } else {
      return 1;
    }
  }
});

/***/ }),

/***/ "./src/js/scenes/LoadScene.js":
/*!************************************!*\
  !*** ./src/js/scenes/LoadScene.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _GameData__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../GameData */ "./src/js/GameData.js");
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
    key: "init",
    value: function init() {
      game.gameData = new _GameData__WEBPACK_IMPORTED_MODULE_0__["default"]();
    }
  }, {
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
      this.load.image('player', game.gameData.players.player.photo);
      this.load.image('play-btn', 'assets/images/play-btn.png');
      this.load.image('btn-start-game', 'assets/images/btn-start-game.png');
      this.load.image('x', 'assets/images/x.png');
      this.load.image('fire', 'assets/images/fire.png');
      this.load.image('fire-cap', 'assets/images/fire-cap.png');
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
/* harmony import */ var _components_Map__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../components/Map */ "./src/js/components/Map.js");
/* harmony import */ var _components_Players__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../components/Players */ "./src/js/components/Players.js");
/* harmony import */ var _components_Background__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../components/Background */ "./src/js/components/Background.js");
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
      key: 'MainScene'
    });
    _this.cells = {};
    _this.opponentData = {}; // it is set on Socket class when msg is received from opponent

    return _this;
  }

  _createClass(MainScene, [{
    key: "init",
    value: function init(data) {
      this.myPlanesCells = data.planesData.cells;
      this.myPlanes = data.planesData.planes; //console.log(this.myPlanesCells);
      // console.log('heads', this.myPlanesCells[0], this.myPlanesCells[10]);

      this.cameras.main.setBackgroundColor('#fff');
    } //debug
    // drawByCells(cells) {
    //     //console.log(this.cells);
    //     cells.forEach((cl) => {
    //         //   let graphics = this.add.graphics({ fillStyle: { color: 0x0000ff } });
    //         var graphics = this.add.graphics({
    //             lineStyle: { width: 3, color: 0x000000 },
    //         });
    //         graphics.strokeRectShape(this.cells[`o${cl}`].rect);
    //     });
    // }

  }, {
    key: "create",
    value: function create() {
      // console.log('main create');
      var background = new _components_Background__WEBPACK_IMPORTED_MODULE_2__["default"](this);
      this.playersComponent = new _components_Players__WEBPACK_IMPORTED_MODULE_1__["default"](this); //this.game.scene.getScene('SetPlaneScene').players.opponent

      this.socket.send({
        action: 'setOpponentData',
        opponentData: {
          planesCells: this.myPlanesCells
        }
      }); // this.drawPlayerMap(40, 80);
      // this.drawPlayerMap(440, 80, 'opponent');

      var playerMap = new _components_Map__WEBPACK_IMPORTED_MODULE_0__["default"](this, 96 - 32, 98, null, true);
      var opponentMap = new _components_Map__WEBPACK_IMPORTED_MODULE_0__["default"](this, 96 + 32 * 11, 98, 'opponent', true);
      this.drawPlanes();
      this.turn = game.gameData.turn;
      this.turn.setScene(this); //console.log(this.turn);
      //debug
      //window.Socket = Socket;

      window.MainScene = this; // this.drawByCells(this.myPlanesCells);
    }
  }, {
    key: "drawPlanes",
    value: function drawPlanes() {
      var _this2 = this;

      // console.log(this.myPlanes);
      Object.keys(this.myPlanes).forEach(function (planeKey) {
        var playerMapLeftDiff = game.opts.cellSize; // Difference between left margin of maps                                               // on SetPlaneScene and MainScene

        var plane = _this2.myPlanes[planeKey].instance;

        var planeImage = _this2.add.image(plane.x - playerMapLeftDiff, plane.y, plane.texture.key).setAngle(plane.angle).setAlpha(0.9).setScale(game.zoom);
      });
    } // drawPlayerMap(x, y, type = null) {
    //     const sqareWidth = 40;
    //     const cellsNum = 8;
    //     for (let i = 0; i < cellsNum; i++) {
    //         // Go vertical
    //         for (let j = 0; j < cellsNum; j++) {
    //             // Go horizontal
    //             this.drawRect(
    //                 x + j * sqareWidth,
    //                 y + i * sqareWidth,
    //                 sqareWidth,
    //                 i,
    //                 j,
    //                 type
    //             );
    //         }
    //     }
    // }
    // drawRect(x, y, sqareWidth, i, j, type) {
    //     let rect = new Phaser.Geom.Rectangle(x, y, sqareWidth, sqareWidth);
    //     //   let graphics = this.add.graphics({ fillStyle: { color: 0x0000ff } });
    //     var graphics = this.add.graphics({
    //         lineStyle: { width: 1, color: 0x0000aa },
    //     });
    //     graphics.strokeRectShape(rect);
    //     graphics.setInteractive(
    //         new Phaser.Geom.Rectangle(x, y, sqareWidth, sqareWidth),
    //         Phaser.Geom.Rectangle.Contains
    //     );
    //     const owner = type === 'opponent' ? 'p' : 'o';
    //     const id = `${owner}${j + 1}${i + 1}`;
    //     this.cells[id] = { graphics, rect };
    //     // graphics.setData('id', id);
    //     graphics.on('pointerdown', () => {
    //         if (type !== 'opponent') return;
    //         if ($.isEmptyObject(this.opponentData)) {
    //             console.log('opponent not ready yet');
    //             return;
    //         }
    //         if (!this.turn.isMyTurn) {
    //             //console.log('not my turn');
    //             game.gameData.turn.scaleText();
    //             return;
    //         }
    //         this.socket.send({
    //             action: 'attack',
    //             cellClicked: id,
    //         });
    //         const cellNum = `${j + 1}${i + 1}`;
    //         if (this.opponentData.planesCells.includes(cellNum)) {
    //             // Targeted point
    //             graphics = this.add.graphics({
    //                 fillStyle: { color: 0x800000 },
    //             });
    //             graphics.fillRectShape(rect);
    //             const texture =
    //                 this.opponentData.planesCells[0] == cellNum ||
    //                 this.opponentData.planesCells[10] == cellNum
    //                     ? 'fire-cap'
    //                     : 'fire';
    //             this.add
    //                 .image(rect.centerX, rect.centerY, texture)
    //                 .setScale(0.8);
    //         } else {
    //             // Missed point
    //             this.add.image(rect.centerX, rect.centerY, 'x').setScale(0.8);
    //         }
    //         game.gameData.turn.reverse();
    //     });
    // }
    // drawSceneBackground() {
    //     const x = 0;
    //     const y = 0;
    //     const sqareWidth = 40;
    //     const cellsNum = 20;
    //     for (let i = 0; i < cellsNum; i++) {
    //         // Go vertical
    //         for (let j = 0; j < cellsNum; j++) {
    //             // Go horizontal
    //             this.drawBgRect(
    //                 x + j * sqareWidth,
    //                 y + i * sqareWidth,
    //                 sqareWidth,
    //                 i,
    //                 j
    //             );
    //         }
    //     }
    // }
    // drawBgRect(x, y, sqareWidth, i, j) {
    //     let rect = new Phaser.Geom.Rectangle(x, y, sqareWidth, sqareWidth);
    //     //   let graphics = this.add.graphics({ fillStyle: { color: 0x0000ff } });
    //     var graphics = this.add.graphics({
    //         lineStyle: { width: 1, color: 0xeeeeee },
    //     });
    //     graphics.strokeRectShape(rect);
    // }

  }]);

  return MainScene;
}(Phaser.Scene);

/* harmony default export */ __webpack_exports__["default"] = (MainScene);

/***/ }),

/***/ "./src/js/scenes/SetOpponentScene.js":
/*!*******************************************!*\
  !*** ./src/js/scenes/SetOpponentScene.js ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function($) {function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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

var SetOpponentScene = /*#__PURE__*/function (_Phaser$Scene) {
  _inherits(SetOpponentScene, _Phaser$Scene);

  var _super = _createSuper(SetOpponentScene);

  function SetOpponentScene() {
    _classCallCheck(this, SetOpponentScene);

    return _super.call(this, {
      key: 'SetOpponentScene'
    });
  }

  _createClass(SetOpponentScene, [{
    key: "init",
    value: function init(data) {
      this.myRoom = null;
      this.setPlaneScene = data.setPlaneScene;
      this.events.on('shutdown', this.destroy, this);
      this.randSceneId = Math.floor(Math.random() * 100000);
    }
  }, {
    key: "create",
    value: function create() {
      var _this = this;

      var html = "\n            <div class=\"flex items-center rounded animate__animated animate__backInDown\">\n                <div class=\"flex w-full\">\n                    <div class=\"col-create-room flex flex-1 justify-center items-center flex-col\">\n                        <p class=\"text-gray-800 mb-2\">Create a room</p>\n                        <button id=\"createRoom\" class=\"bg-pink-700 px-4 py-2 text-white rounded\">Create</button>\n                    </div> \n                    <div class=\"col-go-to-room flex flex-1 justify-center items-center flex-col\">\n                    <p class=\"text-gray-800 mb-2\">Go to a room</p>\n                        <input id=\"roomId\" class=\"mb-2\" value=\"0000\" type=\"text\" />\n                        <button id=\"goToRoom\" class=\"bg-blue-700 px-4 py-2 text-white rounded\">Go play</button>\n                    </div> \n                </div> \n            </div>\n        ";
      var el = document.createElement('div');
      el.innerHTML = html;
      el.style.width = $('canvas').width() + 'px';
      el.style.height = $('canvas').height() + 'px';
      el.classList = "scene-html scene-html-".concat(this.randSceneId, " absolute t-0 l-0 flex justify-center items-center animate__animated animate__fadeIn");
      $('#game').append(el);
      $('body').one('click', '#createRoom', this.getMyRoom.bind(this));
      $('body').on('click', '#goToRoom', function () {
        var roomToGo = $('#roomId').val();
        var $sceneHtml = $(".scene-html-".concat(_this.randSceneId));
        if ($sceneHtml.find('.room-error').length > 0) return;
        game.gameData.turn.setIsMyTurn(false); //  console.log(roomToGo);

        _this.setPlaneScene.socket.send({
          action: 'goToRoom',
          room: roomToGo
        });
      });
    }
  }, {
    key: "getMyRoom",
    value: function getMyRoom() {
      this.setPlaneScene.socket.send({
        action: 'getMyRoom'
      });
    } // Called from Socket class on message received from server

  }, {
    key: "showMyRoomId",
    value: function showMyRoomId(id) {
      var _this2 = this;

      this.myRoom = id;
      var $sceneHtml = $(".scene-html-".concat(this.randSceneId));
      var $colCreateRoom = $sceneHtml.find('.col-create-room');
      $sceneHtml.find('#createRoom').after("<h4>".concat(id, "</h4>")).remove();
      $colCreateRoom.find('p').text('Your opponent can connect to this room code:');
      $colCreateRoom.find('h4').after("\n                <small class=\"text-green-600 mt-2\">Waiting for opponent to connect...<small>\n                <button class=\"go-back bg-blue-400 block mx-auto mt-4 px-4 py-2 text-white rounded\">Go back</button>\n            ");
      $sceneHtml.find('.col-go-to-room').hide();
      $('body').one('click', '.go-back', function () {
        _this2.scene.restart(); // this.setPlaneScene.scene.launch('SetOpponentScene', {
        //     setPlaneScene: this.setPlaneScene,
        // });

      });
    } // Called from Socket class

  }, {
    key: "printInvalidRoom",
    value: function printInvalidRoom() {
      var $sceneHtml = $(".scene-html-".concat(this.randSceneId));
      $sceneHtml.find('.col-go-to-room').append("\n            <div class=\"room-error hidden text-center mt-2\">\n                <p class=\"text-red-600\">Invalid room code..</p>\n                <p class=\"text-red-600 text-xs\">Try again with another code.</p>\n            </div>\n        ");
      $sceneHtml.find('.room-error').fadeIn();
      setTimeout(function () {
        $sceneHtml.find('.room-error').fadeOut(400, function () {
          $(this).remove();
        });
      }, 2000);
    }
  }, {
    key: "printOpponentConnected",
    value: function printOpponentConnected() {
      var _this3 = this;

      Swal.fire({
        title: "Let's go!",
        text: 'Opponent connected',
        icon: 'success',
        showConfirmButton: false,
        timer: 2000
      }).then(function () {
        console.log('execute then');

        _this3.scene.stop();
      });
    }
  }, {
    key: "startRoom",
    value: function startRoom(id) {
      if (this.myRoom && this.myRoom == id) {
        // This is the room initiator player
        this.printOpponentConnected();
      } else {
        // This is the opponent
        this.scene.stop();
      }
    }
  }, {
    key: "destroy",
    value: function destroy() {
      var $sceneHtml = $(".scene-html-".concat(this.randSceneId));
      $('body').off();
      $sceneHtml.fadeOut(500, function () {
        $sceneHtml.remove();
        console.log('removed');
      });
    }
  }]);

  return SetOpponentScene;
}(Phaser.Scene);

/* harmony default export */ __webpack_exports__["default"] = (SetOpponentScene);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js")))

/***/ }),

/***/ "./src/js/scenes/SetPlaneScene.js":
/*!****************************************!*\
  !*** ./src/js/scenes/SetPlaneScene.js ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _components_Background__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../components/Background */ "./src/js/components/Background.js");
/* harmony import */ var _components_Map__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../components/Map */ "./src/js/components/Map.js");
/* harmony import */ var _components_Players__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../components/Players */ "./src/js/components/Players.js");
/* harmony import */ var _components_Plane__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../components/Plane */ "./src/js/components/Plane.js");
/* harmony import */ var _Socket__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Socket */ "./src/js/Socket.js");
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
    }); //this.cellSize = 40;

    _this.cells = [];
    _this.planes = {};
    _this.planesGameObjects = [];
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
      // this.drawSceneBackground();
      var background = new _components_Background__WEBPACK_IMPORTED_MODULE_0__["default"](this); // // Setup players
      //this.players = new Players(this);
      // const x = 120;
      // const y = 80;
      // this.drawPlayerMap(x, y);

      var map = new _components_Map__WEBPACK_IMPORTED_MODULE_1__["default"](this, 96, 98); //this.plane = new Plane(this);

      var plane1 = new _components_Plane__WEBPACK_IMPORTED_MODULE_3__["default"]({
        scene: this,
        x: game.config.width / game.zoom / 2 + 200,
        y: 140,
        planeNum: 1
      });
      this.planesGameObjects.push(plane1);
      var plane2 = new _components_Plane__WEBPACK_IMPORTED_MODULE_3__["default"]({
        scene: this,
        x: game.config.width / game.zoom / 2 + 300,
        y: 140,
        planeNum: 2
      });
      this.planesGameObjects.push(plane2); // Start game btn

      this.addStartGame();
      var mainScene = game.scene.getScene('MainScene'); // mainScene.players = new Players(mainScene);
      // ---

      this.socket = new _Socket__WEBPACK_IMPORTED_MODULE_4__["default"]();
      mainScene.socket = this.socket; // ---
      // Set opponent screen
      // this.scene.stop();
      //new Players(this);
      // ---

      this.scene.launch('StartScene', {
        setPlaneScene: this
      }).bringToTop('StartScene'); // ---
      //
      //
      ///
      // this.scene.launch('SetOpponentScene', {
      //     setPlaneScene: this,
      // });
      // setTimeout(() => {
      //     this.scene.stop('SetOpponentScene');
      //     this.scene.resume();
      // }, 4000);
      //debug

      window.socket = this.socket;
      window.SetPlaneScene = this; // let cls = localStorage.getItem('lastPlaceCells').split(',');
      // this.drawByCells(cls);
    }
  }, {
    key: "addStartGame",
    value: function addStartGame() {
      var _this2 = this;

      this.add.image(630 * game.zoom, 384 * game.zoom, 'btn-start-game').setScale(game.zoom).setInteractive({
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
        } //console.log(this.planes);


        _this2.scene.stop();

        _this2.scene.start('MainScene', {
          planesData: {
            cells: allPlanesCells,
            planes: _this2.planes
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
    } // drawPlayerMap(x, y) {
    //     const squareWidth = this.cellSize;
    //     const cellsNum = 8;
    //     for (let i = 0; i < cellsNum; i++) {
    //         // Go vertical
    //         for (let j = 0; j < cellsNum; j++) {
    //             // Go horizontal
    //             this.drawRect(
    //                 x + j * squareWidth,
    //                 y + i * squareWidth,
    //                 squareWidth,
    //                 i,
    //                 j
    //             );
    //         }
    //     }
    //     this.drawBorder(x, y, squareWidth, cellsNum);
    // }
    // drawBorder(x, y, squareWidth, cellsNum) {
    //     let width = squareWidth * cellsNum;
    //     let rect = new Phaser.Geom.Rectangle(x, y, width, width);
    //     //   let graphics = this.add.graphics({ fillStyle: { color: 0x0000ff } });
    //     let graphics = this.add.graphics({
    //         lineStyle: { width: 3, color: 0x000000 },
    //     });
    //     graphics.strokeRectShape(rect);
    //     this.dropZoneRect = rect;
    // }
    // drawRect(x, y, squareWidth, i, j, type) {
    //     let rect = new Phaser.Geom.Rectangle(x, y, squareWidth, squareWidth);
    //     //   let graphics = this.add.graphics({ fillStyle: { color: 0x0000ff } });
    //     let graphics = this.add.graphics({
    //         lineStyle: { width: 1, color: 0x000000 },
    //     });
    //     graphics.strokeRectShape(rect);
    //     const id = `${j + 1}${i + 1}`;
    //     this.cells[id] = { id, rect };
    // }
    // drawSceneBackground() {
    //     const x = 0;
    //     const y = 0;
    //     const squareWidth = this.cellSize;
    //     const cellsNum = 20;
    //     for (let i = 0; i < cellsNum; i++) {
    //         // Go vertical
    //         for (let j = 0; j < cellsNum; j++) {
    //             // Go horizontal
    //             this.drawBgRect(
    //                 x + j * squareWidth,
    //                 y + i * squareWidth,
    //                 squareWidth,
    //                 i,
    //                 j
    //             );
    //         }
    //     }
    // }
    // drawBgRect(x, y, squareWidth, i, j) {
    //     let rect = new Phaser.Geom.Rectangle(x, y, squareWidth, squareWidth);
    //     //   let graphics = this.add.graphics({ fillStyle: { color: 0x0000ff } });
    //     var graphics = this.add.graphics({
    //         lineStyle: { width: 1, color: 0xeeeeee },
    //     });
    //     graphics.strokeRectShape(rect);
    // }

  }]);

  return SetPlaneScene;
}(Phaser.Scene);

/* harmony default export */ __webpack_exports__["default"] = (SetPlaneScene);

/***/ }),

/***/ "./src/js/scenes/StartScene.js":
/*!*************************************!*\
  !*** ./src/js/scenes/StartScene.js ***!
  \*************************************/
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

var StartScene = /*#__PURE__*/function (_Phaser$Scene) {
  _inherits(StartScene, _Phaser$Scene);

  var _super = _createSuper(StartScene);

  function StartScene() {
    _classCallCheck(this, StartScene);

    return _super.call(this, {
      key: 'StartScene'
    });
  }

  _createClass(StartScene, [{
    key: "init",
    value: function init(data) {
      this.setPlaneScene = data.setPlaneScene;
    }
  }, {
    key: "create",
    value: function create() {
      var rect = new Phaser.Geom.Rectangle(0, 0, game.config.width, game.config.height);
      var graphics = this.add.graphics();
      graphics.fillStyle(0x000000, 0.8);
      graphics.fillRectShape(rect);
      var playBtn = this.add.image(game.config.width / 2, game.config.height / 2, 'play-btn').setScale(game.zoom * 0.5).setAlpha(0.7).setInteractive({
        useHandCursor: true
      }).on('pointerdown', this.start, this);
      this.tweens.add({
        targets: [playBtn],
        scaleX: 0.6,
        scaleY: 0.6,
        alpha: 1,
        duration: 1000,
        repeat: -1,
        yoyo: true,
        ease: 'Circ.easeIn'
      });
    }
  }, {
    key: "start",
    value: function start() {
      this.scene.stop();
      this.scene.launch('SetOpponentScene', {
        setPlaneScene: this.setPlaneScene
      });
    }
  }]);

  return StartScene;
}(Phaser.Scene);

/* harmony default export */ __webpack_exports__["default"] = (StartScene);

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