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
  function Socket(players) {
    _classCallCheck(this, Socket);

    var url = "ws://192.168.0.105:8080/comm?playerId=".concat(players.player.id, "&opponentId=").concat(players.opponent.id);
    var conn = new WebSocket(url);

    conn.onopen = function (e) {
      console.log("Connection established to ".concat(url));
    }; // conn.onmessage = (e) => {
    //     console.log(e.data);
    // };


    this.conn = conn;
  }

  _createClass(Socket, [{
    key: "send",
    value: function send(msg) {
      if (this.conn.readyState === WebSocket.CLOSED) return;
      return this.conn.send(msg);
    }
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

    _this = _super.call(this, config.scene, config.x, config.y, 'plane-1');
    config.scene.add.existing(_assertThisInitialized(_this));
    _this.scene = config.scene;

    _this.setScale(0.4).setInteractive().setData('initialPos', {
      x: _this.x,
      y: _this.y
    });

    _this.scene.input.on('pointerdown', _this.startDrag, _assertThisInitialized(_this)); // Other variables


    _this.isInDropZone = false;
    return _this;
  }

  _createClass(Plane, [{
    key: "startDrag",
    value: function startDrag(pointer, targets) {
      this.scene.input.off('pointerdown', this.startDrag, this);
      this.dragObj = targets[0];
      this.scene.input.on('pointermove', this.doDrag, this);
      this.scene.input.on('pointerup', this.stopDrag, this);
    }
  }, {
    key: "doDrag",
    value: function doDrag(pointer) {
      if (typeof this.dragObj !== 'undefined') {
        // Move
        this.dragObj.x = pointer.x;
        this.dragObj.y = pointer.y;
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
    value: function stopDrag() {
      this.scene.input.on('pointerdown', this.startDrag, this);
      this.scene.input.off('pointermove', this.doDrag, this);
      this.scene.input.off('pointerup', this.stopDrag, this);
      if (typeof this.dragObj == 'undefined') return; // Check if in drop zone

      var dragX = this.dragObj.x;
      var dragY = this.dragObj.y;
      var dropZone = this.getDropZone();

      if (dragX > dropZone.x && dragX < dropZone.x + dropZone.width && dragY > dropZone.y && dragY < dropZone.y + dropZone.height) {
        // Inside drop zone
        this.dragObj.setScale(1); // this.dragObj.x = dropZone.x + this.dragObj.width / 2;
        // this.dragObj.y = dropZone.y + this.dragObj.height / 2;
        // this.scene.cells.forEach((cell) => {
        //     console.log(cell);
        // });

        this.repositionToClosest('x');
        this.repositionToClosest('y');
        this.setPlanePositionInCells();
        this.isInDropZone = true; //this.dragObj.x =
      } else {
        // Outside drop zone / Go back to initial position
        this.scene.tweens.add({
          targets: [this.dragObj],
          x: this.dragObj.getData('initialPos').x,
          y: this.dragObj.getData('initialPos').y,
          scaleX: 0.4,
          scaleY: 0.4,
          duration: 500
        });
        this.isInDropZone = false;
      }
    }
  }, {
    key: "repositionToClosest",
    value: function repositionToClosest(axis) {
      var dropZone = this.getDropZone();
      var cellsNum = 8;

      for (var i = 0; i < cellsNum; i++) {
        if (i < 2) continue;
        var closest = i * 40;
        var relativeDistance = this.dragObj[axis] - dropZone[axis];

        if (axis === 'y') {
          relativeDistance = relativeDistance + 20;
        }

        if (relativeDistance - closest < 39) {
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
    key: "setPlanePositionInCells",
    value: function setPlanePositionInCells() {
      // let schema = [
      //     [0, 0, 1, 0, 0],
      //     [1, 1, 1, 1, 1],
      //     [0, 0, 1, 0, 0],
      //     [0, 1, 1, 1, 0],
      // ];
      console.log(this);
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
      this.load.image('plane-1', 'assets/images/planes/plane-1.png');
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
/* harmony import */ var _Socket__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Socket */ "./src/js/Socket.js");
/* harmony import */ var _components_Players__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../components/Players */ "./src/js/components/Players.js");
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
    return _this;
  }

  _createClass(MainScene, [{
    key: "init",
    value: function init() {
      this.cameras.main.setBackgroundColor('#fff');
    }
  }, {
    key: "create",
    value: function create() {
      var _this2 = this;

      this.drawSceneBackground(); // Setup players

      this.players = new _components_Players__WEBPACK_IMPORTED_MODULE_1__["default"]();
      this.socket = new _Socket__WEBPACK_IMPORTED_MODULE_0__["default"](this.players);

      this.socket.conn.onmessage = function (e) {
        console.log(e.data);
        var msg = JSON.parse(e.data);

        if (msg.opponentDisconnected) {
          console.log('opponent disconnected');

          _this2.scene.restart();
        }

        var cellId = msg.cellClicked;
        if (!cellId) return;

        var graphics = _this2.add.graphics({
          fillStyle: {
            color: 0x0000ff
          }
        });

        graphics.fillRectShape(_this2.cells[cellId.replace('p', 'o')].rect);
      };

      var x = 40;
      var y = 80;
      this.drawPlayerMap(x, y);
      this.drawPlayerMap(440, y, 'opponent'); //debug

      window.Socket = _Socket__WEBPACK_IMPORTED_MODULE_0__["default"];
      window.MainScene = this;
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

        _this3.socket.send(JSON.stringify({
          cellClicked: id
        })); // console.log(graphics.getData('id'));


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
    _this.cells = [];
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

      this.players = new _components_Players__WEBPACK_IMPORTED_MODULE_0__["default"](); // this.socket = new Socket(this.players);

      var x = 120;
      var y = 80;
      this.drawPlayerMap(x, y); //this.plane = new Plane(this);

      var plane = new _components_Plane__WEBPACK_IMPORTED_MODULE_1__["default"]({
        scene: this,
        x: game.config.width / 2 + 200,
        y: 140
      }); //debug
      // window.Socket = Socket;

      window.SetPlaneScene = this;
    }
  }, {
    key: "drawPlayerMap",
    value: function drawPlayerMap(x, y) {
      var sqareWidth = 40;
      var cellsNum = 8;

      for (var i = 0; i < cellsNum; i++) {
        // Go vertical
        for (var j = 0; j < cellsNum; j++) {
          // Go horizontal
          this.drawRect(x + j * sqareWidth, y + i * sqareWidth, sqareWidth, i, j);
        }
      }

      this.drawBorder(x, y, sqareWidth, cellsNum);
    }
  }, {
    key: "drawBorder",
    value: function drawBorder(x, y, sqareWidth, cellsNum) {
      var width = sqareWidth * cellsNum;
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
    value: function drawRect(x, y, sqareWidth, i, j, type) {
      var rect = new Phaser.Geom.Rectangle(x, y, sqareWidth, sqareWidth); //   let graphics = this.add.graphics({ fillStyle: { color: 0x0000ff } });

      var graphics = this.add.graphics({
        lineStyle: {
          width: 1,
          color: 0x000000
        }
      });
      graphics.strokeRectShape(rect);
      var id = "".concat(j + 1).concat(i + 1);
      this.cells[id] = {
        graphics: graphics,
        rect: rect
      };
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