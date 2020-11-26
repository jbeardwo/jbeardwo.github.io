function myScene(camera){
	this.camera = camera;
	this.objects = [];
}

myScene.prototype.drawEverything = function() {
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	for(var i = 0;i<this.objects.length;i++){
		this.objects[i].draw();
	}
}