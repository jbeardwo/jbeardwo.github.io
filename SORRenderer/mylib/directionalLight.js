function myDirectionalLight(direction,color){
	this.direction = direction;
	this.color = color;
	this.vertices = this.buildVerts();
	this.lineColor = [0,1.0,1.0,1.0];
	this.line = new lineCluster(this.vertices,[0,1.0,1.0,1.0],1);

}

myDirectionalLight.prototype.buildVerts = function() {
	var vertices = [];
	vertices.push(0,0,0)
	vertices.push(-3000*this.direction[0],-3000*this.direction[1],3000*this.direction[2]);
	vertices.push(-3000*this.direction[0],-3000*this.direction[1],3000*this.direction[2]-100);
	return vertices;
}

myDirectionalLight.prototype.draw = function(){
	this.line.draw();
}