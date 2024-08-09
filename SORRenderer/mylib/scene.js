function myScene(camera){
	this.camera = camera;
	this.objects = [];
	this.directionalLight = new myDirectionalLight([-1,-1,1],[0,191,255]);
}

myScene.prototype.drawEverything = function() {
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	for(var i = 0;i<this.objects.length;i++){
		this.objects[i].color[3] = .996-.004*i;

		this.objects[i].draw();
	}
	this.directionalLight.draw();
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