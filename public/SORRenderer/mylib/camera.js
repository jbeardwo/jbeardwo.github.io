function myCamera(position, worldUp){
	this.position = position.toVector3();
	this.cameraFront = [0.0,0.0,-1.0]
	this.worldUp = [0.0,1.0,0.0];
	this.cameraUp = [];
	this.cameraRight = [];
	this.pitch = 0;
	this.yaw = -90;
	this.velocity = 50;
	this.sensitivity = 2;
	this.updateVectors();
	this.orthoView = false;
}

myCamera.prototype.toggleOrtho = function() {
	this.orthoView = !this.orthoView;
	scene.drawEverything();
}

myCamera.prototype.getViewMatrix = function() {
	var mvpMatrix = new Matrix4()
	if(this.orthoView){
		mvpMatrix.setOrtho(-1*canvas.width,canvas.width,-1*canvas.height,canvas.height,1,10000);
	}else{
		mvpMatrix.setPerspective(30, canvas.width / canvas.height, 1, 10000);
	}
	var lookAt = addVectors(this.position,this.cameraFront)
	mvpMatrix.lookAt(this.position[0], this.position[1], this.position[2],
    				 lookAt[0], lookAt[1], lookAt[2],
    				 this.cameraUp[0], this.cameraUp[1], this.cameraUp[2]);
	return mvpMatrix;
}

myCamera.prototype.updatePosition = function(direction){
	if(direction == 'FORWARD'){
		for(var i = 0;i<3;i++){
            	this.position[i] += this.velocity * this.cameraFront[i];
            }
	}
	if(direction == 'BACKWARD'){
		for(var i = 0;i<3;i++){
            	this.position[i] -= this.velocity * this.cameraFront[i];
            }
	}
	if(direction == 'LEFT'){
		for(var i = 0;i<3;i++){
            	this.position[i] -= this.velocity * this.cameraRight[i];
            }
	}
	if(direction == 'RIGHT'){
		for(var i = 0;i<3;i++){
            	this.position[i] += this.velocity * this.cameraRight[i];
            }
	}
	this.updateVectors();

}

myCamera.prototype.updateAngles = function(pitch, yaw){
	this.pitch += pitch;
	this.yaw += yaw;
	this.updateVectors();
}

myCamera.prototype.updateVectors = function(){
	this.cameraFront[0] = Math.cos(degreesToRadians(this.pitch)) * Math.cos(degreesToRadians(this.yaw));
	this.cameraFront[1] = Math.sin(degreesToRadians(this.pitch));
	this.cameraFront[2] = Math.cos(degreesToRadians(this.pitch)) * Math.sin(degreesToRadians(this.yaw));
	this.cameraFront = normalize(this.cameraFront);
	this.cameraRight = vectorCalcNormal(this.cameraFront,this.worldUp);
	this.cameraUp = vectorCalcNormal(this.cameraRight,this.cameraFront);
}

myCamera.prototype.snapTo = function(newPos, lookAt){
	for(var i = 0;i<3;i++){
		this.position[i] = newPos[i];
		this.cameraFront[i] = lookAt[i];
		this.updateVectors();
	}
}