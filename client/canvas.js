
export default function MyCanvas(input_el) {
    input_el.innerHTML = '<canvas width="300" height="250" class="canvason"></canvas> <input type="color" id="stroke"/> ';
    this.loc = {
        x : 0,
        y : 0
    }
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

MyCanvas.prototype.handlePicker = function() {
    this.strokeStyle = this.el.picker.value;
};
MyCanvas.prototype.handleDown = function(ev) {
    this.penDown = true;
    this.loc.x = ev.x;
    this.loc.y = ev.y;

    this.socket.emit('data', {
        penDown : true,
        x:ev.x, y:ev.y});

    //debug
    //console.log("Down " + this.el.canvas.parentNode.id);
};
MyCanvas.prototype.handleInput = function (data){
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
MyCanvas.prototype.handleMove = function(ev) {
    if (this.penDown) {
        this.handleInput ({x:ev.x, y:ev.y});
        this.socket.emit('data', {
            fromX: this.loc.x, fromY: this.loc.y,
            x:ev.x, y:ev.y,
            penDown : true,
            penUp : false,
            strokeStyle: this.strokeStyle});
        this.loc.x = ev.x;
        this.loc.y = ev.y;

    }
    else{
        //debug
        //console.log("No-Draw");
    }
};
MyCanvas.prototype.handleUp = function(ev) {
    this.penDown = false;
    console.log("Up " +this.el.canvas.parentNode.id);
    this.socket.emit('data', {
        penUp : true,
        penDown : false,
        x:ev.x, y:ev.y});

};

