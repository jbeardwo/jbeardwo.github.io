function myDirectionalLight(direction,color){
	this.direction = direction;
	this.color = color;
	this.vertices = this.buildVerts();
	this.line = new lineCluster(this.vertices,[0,1.0,1.0,1.0],1);
	//this.line = new thickLine(this.vertices,[0,1.0,1.0,1.0],20);
}

myDirectionalLight.prototype.buildVerts = function() {
	var vertices = [];
	vertices.push(0,0,0)
	vertices.push(-3000*this.direction[0],-3000*this.direction[1],3000*this.direction[2]);
	return vertices;
}

myDirectionalLight.prototype.draw = function(){
	this.line.draw();
}