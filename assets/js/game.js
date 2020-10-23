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
  function Socket() {
    _classCallCheck(this, Socket);

    var conn = new WebSocket('ws://localhost:8080/comm');

    conn.onopen = function (e) {
      console.log('Connection established!');
    }; // conn.onmessage = (e) => {
    //     console.log(e.data);
    // };


    this.conn = conn;
  }

  _createClass(Socket, [{
    key: "send",
    value: function send(msg) {
      return this.conn.send(msg);
    }
  }]);

  return Socket;
}();

/* harmony default export */ __webpack_exports__["default"] = (new Socket());

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
/* harmony import */ var _scenes_MainScene__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./scenes/MainScene */ "./src/js/scenes/MainScene.js");
 // import moment, { lang } from 'moment';
// import Swal from 'sweetalert2';
// window.moment = moment;
// window.Swal = Swal;
// //indow.jQuery = window.$ = require('jquery');

window.axios = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
window.SOCKET_URL = 'ws://localhost:8080/play';

var mainScene = new _scenes_MainScene__WEBPACK_IMPORTED_MODULE_1__["default"]();
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
game.scene.add('MainScene', mainScene);
game.scene.start('MainScene');
window.game = game;

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
    key: "create",
    value: function create() {
      var _this2 = this;

      _Socket__WEBPACK_IMPORTED_MODULE_0__["default"].conn.onmessage = function (e) {
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

        graphics.fillRectShape(_this2.cells[cellId].rect);
      };

      var x = 40;
      var y = 80;
      this.drawPlayerMap(x, y); //debug

      window.Socket = _Socket__WEBPACK_IMPORTED_MODULE_0__["default"];
      window.MainScene = this; /// this.drawPlayerMap(440, y);
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
    }
  }, {
    key: "drawRect",
    value: function drawRect(x, y, sqareWidth, i, j) {
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
      var id = "".concat(j + 1).concat(i + 1);
      this.cells[id] = {
        graphics: graphics,
        rect: rect
      }; // graphics.setData('id', id);

      graphics.on('pointerdown', function () {
        _Socket__WEBPACK_IMPORTED_MODULE_0__["default"].send(JSON.stringify({
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
  }]);

  return MainScene;
}(Phaser.Scene);

/* harmony default export */ __webpack_exports__["default"] = (MainScene);

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