let size = 10;
let num = 10;
let grid = [];
let song;
let fft;
let spectrum = [];
let distFromCenter = [];
let min = 150;
let amp;

let viewMouseX = 0;
let viewMouseY = 0;

let parentViewportWidth = 0;
let parentViewportHeight = 0;

function preload(){
	song = loadSound("weeb.mp3")
}

function setup() {
	createCanvas(windowWidth, windowHeight, WEBGL);

	song.play();
	fft = new p5.FFT();
	
	window.addEventListener('message', (event) => {

		if (event.data && event.data.type === 'mouseMove') {
			viewMouseX = event.data.x;
			viewMouseY = event.data.y;
			const newParentViewportWidth = event.data.viewportWidth;
			const newParentViewportHeight = event.data.viewportHeight;

			if (newParentViewportWidth !== parentViewportWidth || newParentViewportHeight !== parentViewportHeight) {
				parentViewportWidth = newParentViewportWidth;
				parentViewportHeight = newParentViewportHeight;
				
				size = Math.max(5, parentViewportHeight / 40);
				initializeGrid();
			}
		}
	});
	
	initializeGrid();
}

function initializeGrid() {
	grid = [];
	distFromCenter = [];

	for (let i=0;i<num; i++) {
		grid[i] = [];
		for (let j=0;j<num; j++) {
			grid[i][j] = []
			for (let k=0;k<num; k++) {
				grid[i][j][k] = random([0,1]);
				let offset = size/2 - num/2 * size;
				let x = i * size + offset;
				let y = j * size + offset;
				let z = k * size + offset;
				let distance = dist(x, y, z, 0, 0, 0);
				distFromCenter.push ({i,j,k, distance});
				
			}
		}
	}
	
	distFromCenter.sort(compareDistances);
}

function compareDistances(a, b){
	return a.distance - b.distance;
}

function windowResized() {
		resizeCanvas(windowWidth, windowHeight);
}

function draw() {
	
	clear();
	// orbitControl();
	
	let rotY = 0;
	let rotX = 0;

	if (parentViewportWidth > 0 && parentViewportHeight > 0) {
		rotY = map(viewMouseX, 0, parentViewportWidth, 0.25*-PI, 0.25*PI);
		rotX = map(viewMouseY, 0, parentViewportHeight, 0.25*PI, 0.25*-PI);
	}

	rotateX(rotX);
	rotateY(rotY);
	
	spectrum = fft.analyze();
	let vol = fft.getEnergy(20, 140);
	if (vol> 240) {
		stroke(255,255,0,20);
	}else{
		stroke(0,20);
	}
	
	let offset = size/2 - num/2 * size;
	translate(offset, offset, offset);
	
	let totalCubes = num * num * num;
	for(let i =0; i<totalCubes; i++){
		let pos = distFromCenter[i];
		let c = map(spectrum[i],0 , 255, min, 255);
		grid[pos.i][pos.j][pos.k] = c;
		let thisVol = fft.getEnergy(1+i*21.53,1+(i+1)*21.53);
		push();
		if(i<4){
			fill(grid[pos.i][pos.j][pos.k]);
		}else{
			fill(0,grid[pos.i][pos.j][pos.k],i);
		}
		translate(pos.i*size, pos.j*size, pos.k*size);
		box(map(thisVol,0,256,0,size));
		noFill();
		box(size - size/4);
		pop();
		
		
	}
}