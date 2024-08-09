function lineStrip(vertices, color) {
    this.vertices = vertices;
    this.color = color;
    this.indices = this.stripIndices();
    this.selectable = false;
}

lineStrip.prototype.stripIndices = function() {
    var indices = [];
    for (var i = 0; i < this.vertices.length / 3; i++) {
        indices.push(i)
    }
    return indices
}

lineStrip.prototype.draw = function() {
    gl.lineWidth(50.0);
    var drawVerts = Float32Array.from(this.vertices)
    var drawIndices = Uint16Array.from(this.indices)
        // Initialize shaders
    program = createProgramFromScripts(gl, "lineShader-vs", "lineShader-fs")
    gl.useProgram(program)
    initArrayBuffer(gl, drawVerts, 3, gl.FLOAT, 'a_Position', program)

    var indexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, drawIndices, gl.STATIC_DRAW)

    gl.enable(gl.DEPTH_TEST)

    var u_MvpMatrix = gl.getUniformLocation(program, 'u_MvpMatrix')
    var u_Transforms = gl.getUniformLocation(program, 'u_Transforms')

    gl.uniformMatrix4fv(u_Transforms, false, new Matrix4().setIdentity().elements)
    var u_Color = gl.getUniformLocation(program, 'u_Color')
    gl.uniform4f(u_Color, 0.5, 0.5, 0.5, this.color[3])

    var mvpMatrix = new Matrix4()
    mvpMatrix.setOrtho(left, right,bottom , theTop, near, far)
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements)
    gl.drawElements(gl.LINE_STRIP, this.indices.length, gl.UNSIGNED_SHORT, 0)
    gl.lineWidth(1);
}
