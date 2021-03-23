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

var mouseDown = false;
var dragging = false;

var pickedObject

var camera = new myCamera(new coord(0, 0, 3000));
var scene = new myScene(camera);

function main() {
	gl.clearColor(1.0, 1.0, 1.0, 0.0);
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
        //=
        if(ev.which==187){
          if(dragging==true){
            var translation = new Matrix4;
            translation.setTranslate(0,0,-25)
            pickedObject.transforms = pickedObject.transforms.multiply(translation);
            pickedObject.normalTransforms = pickedObject.normalTransforms.multiply(translation);
            scene.drawEverything;
          }
        }
        //-
        if(ev.which==189){
          if(dragging==true){
            var translation = new Matrix4;
            translation.setTranslate(0,0,25)
            pickedObject.transforms = pickedObject.transforms.multiply(translation);
            pickedObject.normalTransforms = pickedObject.normalTransforms.multiply(translation);
            scene.drawEverything;
          }
        }

        scene.drawEverything();
    }

    // Register function (event handler) to be called on a mouse press
    canvas.onmousedown = function(ev) {
      mouseDown = true;
    	if(drawMode){
    		drawModeClick(ev, gl, canvas);
    	}else{
        	click(ev, gl, canvas);
        }
    };

    canvas.onmouseup = function(ev) {
      mouseDown = false;
      dragging = false;
    }

    // Register function to be called on mouse movement
    canvas.onmousemove = function(ev) {
        if(drawMode){
    		drawModeMove(ev, gl, canvas);
    	}else{
        	move(ev, gl, canvas);
        }
    }

    canvas.onmousewheel = function(ev) {
      if(dragging==true){
        var scale = new Matrix4;
        if(ev.wheelDeltaY>0){
          scale.setScale(1.25,1.25,1.25)
        }else if(ev.wheelDeltaY<0){
          scale.setScale(.75,.75,.75)
        }

        pickedObject.transforms = pickedObject.transforms.multiply(scale);
        // translation.invert();
        pickedObject.normalTransforms = pickedObject.normalTransforms.multiply(scale);

        scene.drawEverything();
      }
    }
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
        var test = new mySORClass("test",newSORPoints,[0,1,0,1]);

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

function click(ev, gl, canvas) {
  var x = ev.clientX; // x coordinate of a mouse pointer at time of click
  var y = ev.clientY; // y coordinate of a mouse pointer at time of click
  var button = ev.button; // 0 if left click, 2 if right click
  var rect = ev.target.getBoundingClientRect();
  var context = canvas.getContext("webgl", {preserveDrawingBuffer: true});


  x = x-rect.left
  y = 500-(y-rect.top)

 var pixel = new Uint8Array(4);
 gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel)
 var alphaPicked = pixel[3];
 pickedObject = scene.findObject(alphaPicked);
 if(pickedObject&&pickedObject.selectable){
   pickedObject.selected = true;
   dragging = true;
 }
 initialX = ((x - rect.left) - canvas.width / 2) * 2;
 initialY = (canvas.height / 2 - (y - rect.top)) * 2;

 translate = new Matrix4()
 translate.setTranslate(20,0,0)
 scene.drawEverything();
}

function move(ev, gl, canvas) {
  var x = ev.clientX;
  var y = ev.clientY;
  var rect = ev.target.getBoundingClientRect();
  x = ((x - rect.left) - canvas.width / 2) * 2;
  y = (canvas.height / 2 - (y - rect.top)) * 2;
  if(dragging){
    dragObject(ev.movementX,ev.movementY);
  }
  scene.drawEverything()
}

function dragObject(x,y) {
  y = y*-1;
  var translation = new Matrix4;
  var xTranslate = [x*camera.cameraRight[0],x*camera.cameraRight[1],x*camera.cameraRight[2]];
  var yTranslate = [y*camera.cameraUp[0],y*camera.cameraUp[1],y*camera.cameraUp[2]];
  translation.setTranslate(xTranslate[0]+yTranslate[0],xTranslate[1]+yTranslate[1],xTranslate[2]+yTranslate[2])
  pickedObject.transforms = pickedObject.transforms.multiply(translation);
  // translation.invert();
  pickedObject.normalTransforms = pickedObject.normalTransforms.multiply(translation);

}
