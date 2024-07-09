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
var SORPreview = null;
let throttleActive = false;

var mouseDown = false;
var dragging = false;
var ctrlDown = false;


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
      scene.drawEverything();
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
            var translate = new Matrix4;
            translate.setTranslate(0,0,-25)
            pickedObject.transforms = pickedObject.transforms.multiply(translate);
            pickedObject.translation = pickedObject.translation.multiply(translate);
            scene.drawEverything();
          }
        }
        //-
        if(ev.which==189){
          if(dragging==true){
            var translate = new Matrix4;
            translate.setTranslate(0,0,25)
            pickedObject.transforms = pickedObject.transforms.multiply(translate);
            pickedObject.translation = pickedObject.translation.multiply(translate);
            scene.drawEverything();
          }
        }
        // console.log(ev.which)
        //ctrl
        if(ev.which==17){
          ctrlDown = true;
        }

    }

    canvas.onkeyup = function (ev)  {
      //ctrl
      if(ev.which==17){
        ctrlDown = false;
      }
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

      if(!throttleActive){
        if(drawMode){
    		  drawModeMove(ev, gl, canvas);
        }else{
        	move(ev, gl, canvas);
        }
        setTimeout(function() {
            throttleActive = false;
        }, 16);
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
        pickedObject.scale = pickedObject.scale.multiply(scale);
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

let requestId = null;

function move(ev, gl, canvas) {
    var x = ev.clientX;
    var y = ev.clientY;
    var rect = ev.target.getBoundingClientRect();
    x = ((x - rect.left) - canvas.width / 2) * 2;
    y = (canvas.height / 2 - (y - rect.top)) * 2;
  
    if (dragging && ctrlDown) {
    var cameraPosition = new Vector3([scene.camera.position[0],scene.camera.position[1],scene.camera.position[2]]);
    var objectPosition = new Vector3([
        pickedObject.translation.elements[12],
        pickedObject.translation.elements[13],
        pickedObject.translation.elements[14]
    ]); 
//     console.log("pickedObject.translation.elements:", pickedObject.translation.elements);
// console.log("objectPosition.elements:", objectPosition.elements);
// console.log("cameraPosition: ", cameraPosition);
    var rotationAxis = objectPosition; // Example axis calculation
    rotationAxis.subtract(cameraPosition);
    // Apply rotation using the dynamically determined axis
    // rotateObjectRelativeToCamera(ev.movementX, ev.movementY);
        rotateObject(ev.movementX, ev.movementY);
        if (!requestId) {
            requestId = requestAnimationFrame(() => {
                scene.drawEverything();
                requestId = null; // Reset request ID after drawing
            });
        }
        
    } else if (dragging) {
        dragObject(ev.movementX, ev.movementY);
        // Request a new animation frame only if it's not already scheduled
        if (!requestId) {
            requestId = requestAnimationFrame(() => {
                scene.drawEverything();
                requestId = null; // Reset request ID after drawing
            });
        }
    }
}

function dragObject(x,y) {
  y = y*-1;
  x*= 2;
  y*= 2;
  var translate = new Matrix4;
  var xTranslate = [x*camera.cameraRight[0],x*camera.cameraRight[1],x*camera.cameraRight[2]];
  var yTranslate = [y*camera.cameraUp[0],y*camera.cameraUp[1],y*camera.cameraUp[2]];
  translate.setTranslate(xTranslate[0]+yTranslate[0],xTranslate[1]+yTranslate[1],xTranslate[2]+yTranslate[2])
  pickedObject.translation = pickedObject.translation.multiply(translate)

}

function rotateObject(x,y){
  var rotationX = new Matrix4;
  var rotationY = new Matrix4;
  // console.log(rotationAxis);
  // rotationX.setRotate(x,0,1,0);
  // rotationY.setRotate(y,1,0,0);
  // var xTranslate = [x*rotationAxis.elements[0],x*rotationAxis.elements[1],x*rotationAxis.elements];
  // var yTranslate = [y*rotationAxis.elements[0],y*rotationAxis.elements[1],y*rotationAxis.elements[2]];

  rotationX.setRotate(x,camera.cameraUp[0],camera.cameraUp[1],camera.cameraUp[2]);
  rotationY.setRotate(y,camera.cameraRight[0],camera.cameraRight[1],camera.cameraRight[2]);


  pickedObject.rotation = pickedObject.rotation.multiply(rotationX).multiply(rotationY);
  // pickedObject.rotation = pickedObject.rotation.multiply(rotationY);
}

function rotateObjectRelativeToCamera(mouseMovementX, mouseMovementY) {

    // Step 1: Get camera and object positions
    var cameraPosition = new Vector3([scene.camera.position[0], scene.camera.position[1], scene.camera.position[2]]);
    var objectPosition = new Vector3([
        pickedObject.translation.elements[12],
        pickedObject.translation.elements[13],
        pickedObject.translation.elements[14]
    ]);

    // Step 2: Calculate direction vector from camera to object
    var directionVector = objectPosition;
    directionVector.subtract(cameraPosition);
    directionVector.normalize();


//RIGHT HERE YOU NEED TO MODIFY THE EXISTING CODE SO ITS CLEAR WHICH AXIS
    //THEN REPLICATE FOR OTHER AXIS
    //HOPEFULLY THIS GETS THE SCREENSPACE ROTATIONWE'RE LOOKING FOR


    // Step 3: Determine rotation axis (perpendicular to direction and camera's up vector)
    var cameraUp = new Vector3([scene.camera.cameraUp[0],scene.camera.cameraUp[1],scene.camera.cameraUp[2]]);
    var rotationAxis = directionVector;
    cameraUp.elements = [0,1,0];
    rotationAxis.elements = [0,0,-1];
    rotationAxis.cross(cameraUp);

    rotationAxis.normalize();

    // Step 4: Determine rotation angle (based on mouse movement or another parameter)
    var rotationAngle = mouseMovementY;  // Adjust the sign and scale as needed

    // Step 5: Create rotation matrix and apply to object
    var rotationMatrix = new Matrix4();
    rotationMatrix.setRotate(rotationAngle, rotationAxis.elements[0], rotationAxis.elements[1], rotationAxis.elements[2]);

    // Apply the rotation to the object's transformation matrix
    pickedObject.rotation = pickedObject.rotation.multiply(rotationMatrix);

    // Step 6: Redraw the scene
    scene.drawEverything();
}

function drawLoop(){
  
  if (drawMode && penDown && newSORPoints.length>0) {
    SORPreview.draw();
  }else{
    
    scene.drawEverything();
  }
  requestAnimationFrame(drawLoop);
}