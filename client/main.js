
import Canvas from './canvas';
var divs = document.querySelectorAll(".paintArea");
var cv = [];
for (var i=0; i<divs.length; i++){
     cv[i] = new Canvas(divs[i]);
}
//var app = require('express')();
//var http = require('http').Server(app);
//var io = require('socket.io')(http);


