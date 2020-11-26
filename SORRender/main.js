var canvas = document.getElementById('webgl');
var gl = WebGLUtils.setupWebGL(canvas, {
    preserveDrawingBuffer: true
});

var drawMode = false;
var newSORPoints = []; // The array for the position of a mouse press
var penDown = 1; // Keeps track of when lines should be drawn
var objects = []; //contains all objects to be drawn
var left = -500
var right = 500
var bottom = -500
var theTop = 500
var near = -500
var far = 500


var camera = new myCamera(new coord(0, 0, 3000));
var scene = new myScene(camera);

function main() {
	gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    // Disable the right click context menu
    canvas.addEventListener('contextmenu', function(e) {
        if (e.button == 2) {
            e.preventDefault();
            return false;
        }
    }, false)
    
    canvas.tabIndex = 1000;

    canvas.onkeydown = function (ev)  {
        //w
        if(ev.which == 87){
            scene.camera.updatePosition('FORWARD');
        }
        //s
        if(ev.which == 83){
        	scene.camera.updatePosition('BACKWARD');
        }
        //a
        if(ev.which == 65){
        	scene.camera.updatePosition('LEFT');
        }
        //d
        if(ev.which == 68){
        	scene.camera.updatePosition('RIGHT');
        }
        //up
        if(ev.which == 38){
            scene.camera.updateAngles(scene.camera.sensitivity,0)
        }
        //down
        if(ev.which == 40){
        	scene.camera.updateAngles(-1*scene.camera.sensitivity,0)
        }
        //left
        if(ev.which == 37){
        	scene.camera.updateAngles(0,-1*scene.camera.sensitivity)
        }
        //right
        if(ev.which == 39){
        	scene.camera.updateAngles(0,scene.camera.sensitivity)
        }
        scene.drawEverything();
    }

    // Register function (event handler) to be called on a mouse press
    canvas.onmousedown = function(ev) {
    	if(drawMode){
    		drawModeClick(ev, gl, canvas);
    	}else{
        	click(ev, gl, canvas);
        }
    };

    // Register function to be called on mouse movement
    canvas.onmousemove = function(ev) {
        if(drawMode){
    		drawModeMove(ev, gl, canvas);
    	}else{
        	move(ev, gl, canvas);
        }
    };
}

function drawNewSOR(){
    drawMode = true;
    penDown = 1;
}

function drawModeClick(ev, gl, canvas) {
    var x = ev.clientX; // x coordinate of a mouse pointer at time of click
    var y = ev.clientY; // y coordinate of a mouse pointer at time of click
    var button = ev.button; // 0 if left click, 2 if right click
    var rect = ev.target.getBoundingClientRect();
    
    x = ((x - rect.left) - canvas.width / 2) * 2;
    y = (canvas.height / 2 - (y - rect.top)) * 2;

    
    // Store the coordinates to newSORPoints array
    newSORPoints.push(x);
    newSORPoints.push(y);
    newSORPoints.push(0);
    
    // If right click
    if (button == 2) {
        penDown = 0;
        drawMode = false;
        var test = new mySORClass("test",newSORPoints,[0,1,0,1.0]);
        console.log(test);
        
        scene.objects.push(test);
        scene.drawEverything();
        newSORPoints = [];
    }
}

function drawModeMove(ev, gl, canvas) {
    if (drawMode && penDown) {
        var x = ev.clientX; // x coordinate of a mouse pointer
        var y = ev.clientY; // y coordinate of a mouse pointer
        var rect = ev.target.getBoundingClientRect();
        //make an array with 2 more elements than newSORPoints (explanation below)
        var vertices = new Float32Array(newSORPoints.length + 3);
        for (var i = 0; i < newSORPoints.length; i++) {
            vertices[i] = newSORPoints[i];
        }

        x = ((x - rect.left) - canvas.width / 2) * 2;
    	y = (canvas.height / 2 - (y - rect.top)) * 2;



        /*
        The elements up to newSORPoints.length are the coordinates of points which have
        already been selected by clicking, in order to have the line rubberband to the
        current mouse position, we must use 2 more elements to hold the current mouse 
        position's coordinates
        */
        vertices[newSORPoints.length] = x;
        vertices[newSORPoints.length + 1] = y;
        vertices[newSORPoints.length + 2] = 0;
        var SORPreview = new lineStrip(vertices, [.5,.5,.5,1.0])
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
        SORPreview.draw();
    }
}

function click(ev, gl, canvas) {}

function move(ev, gl, canvas) {}