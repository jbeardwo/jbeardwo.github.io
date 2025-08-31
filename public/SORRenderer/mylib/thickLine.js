function thickLine(vertices,color,thickness){
	this.thickness = thickness;
	this.vertices = this.buildVerts(vertices);
	this.color = color;
	//this.cube = new myCube(vertices,this.color);
}

thickLine.prototype.draw = function(){
	this.cube.draw();
}