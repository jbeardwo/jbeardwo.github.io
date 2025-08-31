function coord(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
}

coord.prototype.toVector3 = function() {
    var vector = [];
    vector.push(this.x,this.y,this.z)
    return vector;
}
