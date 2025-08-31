function myScene(camera){
	this.camera = camera;
	this.objects = [];
	this.directionalLight = new myDirectionalLight([-1,-1,1],[1.0,1.0,1.0]);
	this.objects.push(this.directionalLight);
	this.dirStrength = .8;
	this.dirActive = true;
	this.ambientStrength = .1;
	this.ambientActive = true;
	this.specularStrength = 0.0000000000000000000000000000001;
	this.specularActive = true;
}

myScene.prototype.drawEverything = function() {
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	for(var i = 0;i<this.objects.length;i++){
		this.objects[i].color[3] = .996-.004*i;

		this.objects[i].draw();
	}
	// this.directionalLight.draw();
}

myScene.prototype.findObject = function(alphaPicked) {
	var target;
	var convertedAlpha = Math.trunc((alphaPicked/255)*1000)/1000;
	for(var i=0; i<this.objects.length; i++){
		this.objects[i].selected = false;
		if(this.objects[i].color[3]==convertedAlpha){
			target = this.objects[i];
		}
	}
	return target;
}

myScene.prototype.toggleAllFlat = function() {
	for(var i = 0;i<this.objects.length;i++){
		if(this.objects[i].drawFlat!=null){
			this.objects[i].drawFlat = !this.objects[i].drawFlat;
		}
	}
	this.drawEverything();
}

myScene.prototype.toggleDirLight = function() {
	this.dirActive = !this.dirActive;
		if(this.dirActive){
			this.dirStrength = .8;
		}else{
			this.dirStrength = 0;
		}
		this.drawEverything();
	}
myScene.prototype.toggleAmbient = function(){
	this.ambientActive = !this.ambientActive;
	if(this.ambientActive){
		this.ambientStrength = .1;
	}else{
		this.ambientStrength = 0;
	}
	this.drawEverything();
}
myScene.prototype.toggleSpecular = function(){
	this.specularActive = !this.specularActive;
	if(this.specularActive){
		this.specularStrength = 0.0000000000000000000000000000001;
	}else{
		this.specularStrength = 0;
	}
	this.drawEverything();
}