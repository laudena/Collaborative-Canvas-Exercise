/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!************************!*\
  !*** ./client/main.js ***!
  \************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _canvas = __webpack_require__(/*! ./canvas */ 1);
	
	var _canvas2 = _interopRequireDefault(_canvas);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var divs = document.querySelectorAll(".paintArea");
	var cv = [];
	for (var i = 0; i < divs.length; i++) {
	     cv[i] = new _canvas2.default(divs[i]);
	}
	//var app = require('express')();
	//var http = require('http').Server(app);
	//var io = require('socket.io')(http);

/***/ },
/* 1 */
/*!**************************!*\
  !*** ./client/canvas.js ***!
  \**************************/
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = MyCanvas;
	function MyCanvas(input_el) {
	    input_el.innerHTML = '<canvas width="300" height="250" class="canvason"></canvas> <input type="color" id="stroke"/> ';
	    this.loc = {
	        x: 0,
	        y: 0
	    };
	    this.offsetHeight = input_el.offsetTop;
	    this.offsetWidth = input_el.offsetLeft;
	    this.strokeStyle = "#000000";
	
	    this.penDown = false;
	    this.el = {
	        canvas: input_el.querySelector('.canvason'),
	        picker: input_el.querySelector('#stroke')
	    };
	
	    /*TODO: Fix Socket.IO module, and then uncomment*/
	
	    this.socket = io.connect('http://localhost:3000');
	    this.socket.on('data', this.handleInput.bind(this));
	
	    this.el.picker.addEventListener("input", this.handlePicker.bind(this));
	    this.el.canvas.addEventListener('mousedown', this.handleDown.bind(this));
	    this.el.canvas.addEventListener('mousemove', this.handleMove.bind(this));
	    this.el.canvas.addEventListener('mouseup', this.handleUp.bind(this));
	}
	
	MyCanvas.prototype.handlePicker = function () {
	    this.strokeStyle = this.el.picker.value;
	};
	MyCanvas.prototype.handleDown = function (ev) {
	    this.penDown = true;
	    this.loc.x = ev.x;
	    this.loc.y = ev.y;
	
	    this.socket.emit('data', {
	        penDown: true,
	        x: ev.x, y: ev.y });
	
	    //debug
	    //console.log("Down " + this.el.canvas.parentNode.id);
	};
	MyCanvas.prototype.handleInput = function (data) {
	    this.penDown = data.penDown;
	    this.penUp = data.penUp;
	    if (this.penDown) {
	        var ctx = this.el.canvas.getContext("2d");
	        ctx.lineWidth = 2;
	        ctx.strokeStyle = data.strokeStyle;
	        ctx.beginPath();
	        ctx.moveTo(data.fromX - this.offsetWidth, data.fromY - this.offsetHeight);
	        ctx.lineTo(data.x - this.offsetWidth, data.y - this.offsetHeight);
	        ctx.stroke();
	    }
	};
	MyCanvas.prototype.handleMove = function (ev) {
	    if (this.penDown) {
	        this.handleInput({ x: ev.x, y: ev.y });
	        this.socket.emit('data', {
	            fromX: this.loc.x, fromY: this.loc.y,
	            x: ev.x, y: ev.y,
	            penDown: true,
	            penUp: false,
	            strokeStyle: this.strokeStyle });
	        this.loc.x = ev.x;
	        this.loc.y = ev.y;
	    } else {
	        //debug
	        //console.log("No-Draw");
	    }
	};
	MyCanvas.prototype.handleUp = function (ev) {
	    this.penDown = false;
	    console.log("Up " + this.el.canvas.parentNode.id);
	    this.socket.emit('data', {
	        penUp: true,
	        penDown: false,
	        x: ev.x, y: ev.y });
	};

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map