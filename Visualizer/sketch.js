//grid visualization variables
let size = 1; 
let num = 10;
let grid = [];
let song;
let fft;
let spectrum = [];
let distFromCenter = [];
let minValue = 150;
let amp;
let viewMouseX = 0;
let viewMouseY = 0;
//size of parent window, important for mouse interpolation
let parentViewportWidth = 0;
let parentViewportHeight = 0;
//canvas position on parent window
let canvasOffsetX = 0;
let canvasOffsetY = 0; 
let isMouseOverCanvas = false;
let rotX = 0;
let rotY = 0;
var volHistory = [];

// UI variables
let isPlaying = false;
let playPauseButton = {
  x: 0,
  y: 0,
  size: 50
};
let skipBackButton = {
  x: 0,
  y: 0,
  size: 40
};
let skipForwardButton = {
  x: 0, 
  y: 0,
  size: 40
};

// scrolling text variables
let titleScrollOffset = 0;
let artistScrollOffset = 0;
let titleScrollSpeed = 1;
let artistScrollSpeed = 1;
let scrollPauseTime = 60; // frames to pause at start/end
let titlePauseCounter = 0;
let artistPauseCounter = 0;
let titleDirection = 1;
let artistDirection = 1;

// playlist variables
let playlist = [];
let currentTrackIndex = 0;
let font;

function preload(){
	playlist = [
		{
			title: "The\u00A0Secluded \u00A0Wilds",
			artist: "WraithGlade",
			file: loadSound("weeb.mp3")
		},
		{
			title: "vice\u00A0magazine\u00A0has\u00A0a\u00A0lot\u00A0to\u00A0Answer\u00A0forzxcz", 
			artist: "shoes\u00A0and\u00A0socks\u00A0off",
			file: loadSound("song.mp3") 
		}
	];
	
	song = playlist[currentTrackIndex].file;
	font = loadFont('https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/SourceCodePro-Bold.otf');
}

function setup() {
	createCanvas(windowWidth, windowHeight, WEBGL);
	// don't auto-play the song
	// song.play();
	fft = new p5.FFT();
	amp = new p5.Amplitude();
	
	for(let i = 0; i<width/2; i++){
		volHistory.push(0);
	}

	// set the loaded font for WEBGL text rendering
	textFont(font);
	
	// set up song ended callback for auto-advance
	song.onended(nextTrack);

	window.addEventListener('message', (event) => {
    // receive mouse position and viewport size from parent
    if (event.data && event.data.type === 'mouseMove') {
        if (!isMouseOverCanvas) {
            viewMouseX = event.data.x;
            viewMouseY = event.data.y;
        }

        const newParentViewportWidth = event.data.viewportWidth;
        const newParentViewportHeight = event.data.viewportHeight;
        if (
            newParentViewportWidth !== parentViewportWidth ||
            newParentViewportHeight !== parentViewportHeight
        ) {
            parentViewportWidth = newParentViewportWidth;
            parentViewportHeight = newParentViewportHeight;
        }
    }
    // receive relative canvas position from parent
    if (event.data && event.data.type === 'canvasOffset') {
        canvasOffsetX = event.data.offsetX;
        canvasOffsetY = event.data.offsetY;
    }
});
	
	// track whether mouse is over canvas
	canvas.addEventListener('mouseenter', () => {
		isMouseOverCanvas = true;
	});
	
	canvas.addEventListener('mouseleave', () => {
		isMouseOverCanvas = false;
	});
	

	canvas.addEventListener('mousemove', (event) => {
		if (isMouseOverCanvas) {
			// convert canvas-relative mouse to parent viewport coordinates
			viewMouseX = canvasOffsetX + event.offsetX;
			viewMouseY = canvasOffsetY + event.offsetY;
		}
	});
	
	initializeGrid();
	updateButtonPositions();
}

function updateButtonPositions() {
	// play button 
	playPauseButton.x = width * 0.75;
	playPauseButton.y = height * 0.25;
	playPauseButton.size = width * 0.12;
	
	// skip back 
	skipBackButton.x = playPauseButton.x - (0.16 * width);
	skipBackButton.y = playPauseButton.y;
	skipBackButton.size = width * 0.08;
	// skip forward
	skipForwardButton.x = playPauseButton.x + (0.16 * width);
	skipForwardButton.y = playPauseButton.y;
	skipForwardButton.size = width * 0.08;
}

function initializeGrid() {
	// creates the 3D grid, sorts by their distance from center
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
	updateButtonPositions();
}

function togglePlayPause() {
    if (isPlaying) {
        isPlaying = false;
		// remove callback, this prevents skipping on pause
        song.onended(() => {}); 
        song.pause();
    } else {
        isPlaying = true;
		// restore callback to allow autoplay
        song.onended(nextTrack); 
        song.play();
    }
}

function mousePressed() {
	// Convert mouse coordinates to match WEBGL coordinate system
	let screenX = mouseX - width/2;
	let screenY = mouseY - height/2;
	
	// Check if click is on play/pause button (positioned at width/4, -height/4 in UI)
	let buttonCenterX = width/4;
	let buttonCenterY = -height/4;
	let buttonRadius = playPauseButton.size / 2;
	
	if (dist(screenX, screenY, buttonCenterX, buttonCenterY) < buttonRadius) {
		togglePlayPause();
		return;
	}
	
	// Check if click is on skip back button
	buttonCenterX = skipBackButton.x - width/2;
	buttonCenterY = skipBackButton.y - height/2;
	buttonRadius = skipBackButton.size / 2;
	
	if (dist(screenX, screenY, buttonCenterX, buttonCenterY) < buttonRadius) {
		previousTrack();
		return;
	}
	
	// Check if click is on skip forward button
	buttonCenterX = skipForwardButton.x - width/2;
	buttonCenterY = skipForwardButton.y - height/2;
	buttonRadius = skipForwardButton.size / 2;
	
	if (dist(screenX, screenY, buttonCenterX, buttonCenterY) < buttonRadius) {
		nextTrack();
		return;
	}
}

function nextTrack() {
    let wasPlaying = isPlaying;
    //clear callback on old sound object, prevents infinite skipping
    song.onended(() => {});
    song.stop();
    isPlaying = false;

    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    song = playlist[currentTrackIndex].file;
    resetScrolling();

    // set callback on new sound object
    if (wasPlaying) {
        song.onended(nextTrack);
        song.play();
        isPlaying = true;
    } else {
        song.onended(() => {});
    }
}

function previousTrack() {
    let wasPlaying = isPlaying;
    // clear callback on old sound object, prevents infinite skip
    song.onended(() => {});
    song.stop();
    isPlaying = false;

    currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    song = playlist[currentTrackIndex].file;
    resetScrolling();

    // set callback on new sound object
    if (wasPlaying) {
        song.onended(nextTrack);
        song.play();
        isPlaying = true;
    } else {
        song.onended(() => {});
    }
}

function resetScrolling() {
	titleScrollOffset = 0;
	artistScrollOffset = 0;
	titlePauseCounter = scrollPauseTime;
	artistPauseCounter = scrollPauseTime;
	titleDirection = 1;
	artistDirection = 1;
}

function updateScrolling() {
	// Get text dimensions
	textSize(14);
	let titleWidth = textWidth(playlist[currentTrackIndex].title);
	let maxWidth = width / 2 - 40; // Half canvas width minus some padding
	
	textSize(12);
	let artistWidth = textWidth(playlist[currentTrackIndex].artist);
	
	// Update title scrolling
	if (titleWidth > maxWidth) {
		if (titlePauseCounter > 0) {
			titlePauseCounter--;
		} else {
			titleScrollOffset += titleScrollSpeed * titleDirection;
			
			// Check bounds and reverse direction
			if (titleDirection === 1 && titleScrollOffset >= titleWidth - maxWidth + 20) {
				titleDirection = -1;
				titlePauseCounter = scrollPauseTime;
			} else if (titleDirection === -1 && titleScrollOffset <= 0) {
				titleDirection = 1;
				titlePauseCounter = scrollPauseTime;
				titleScrollOffset = 0;
			}
		}
	}
	
	// Update artist scrolling
	if (artistWidth > maxWidth) {
		if (artistPauseCounter > 0) {
			artistPauseCounter--;
		} else {
			artistScrollOffset += artistScrollSpeed * artistDirection;
			
			// Check bounds and reverse direction
			if (artistDirection === 1 && artistScrollOffset >= artistWidth - maxWidth + 20) {
				artistDirection = -1;
				artistPauseCounter = scrollPauseTime;
			} else if (artistDirection === -1 && artistScrollOffset <= 0) {
				artistDirection = 1;
				artistPauseCounter = scrollPauseTime;
				artistScrollOffset = 0;
			}
		}
	}
}

function drawScrollingText(textStr, x, y, z, scrollOffset, maxWidth, textSizeVal) {
	push();
	translate(x, y, z);
	
	// Set up clipping area for text overflow
	textSize(textSizeVal);
	let textWidthVal = textWidth(textStr);
	
	if (textWidthVal <= maxWidth) {
		// Text fits, just draw it normally
		textAlign(CENTER, CENTER);
		text(textStr, 0, 0);
	} else {
		// Text needs scrolling with clipping
		textAlign(LEFT, CENTER);
		
		// Calculate the starting position for the text
		let textStartX = -scrollOffset - maxWidth/2;
		
		// Calculate visible portion of text
		let leftBound = -maxWidth/2;
		let rightBound = maxWidth/2;
		
		// Only draw text if it's within visible bounds
		if (textStartX + textWidthVal > leftBound && textStartX < rightBound) {
			
			// Calculate which part of the string should be visible
			let visibleText = textStr;
			let drawX = textStartX;
			
			// If text starts before left bound, we need to trim the beginning
			if (textStartX < leftBound) {
				// Calculate how many characters to skip from the beginning
				let hiddenWidth = leftBound - textStartX;
				let charCount = 0;
				let accumulatedWidth = 0;
				
				// Find where to start drawing
				for (let i = 0; i < textStr.length && accumulatedWidth < hiddenWidth; i++) {
					accumulatedWidth += textWidth(textStr[i]);
					charCount = i + 1;
				}
				
				visibleText = textStr.substring(charCount);
				drawX = leftBound;
			}
			
			// If text extends past right bound, trim the end
			if (drawX + textWidth(visibleText) > rightBound) {
				let availableWidth = rightBound - drawX;
				let charCount = 0;
				let accumulatedWidth = 0;
				
				// Find where to stop drawing
				for (let i = 0; i < visibleText.length && accumulatedWidth + textWidth(visibleText[i]) <= availableWidth; i++) {
					accumulatedWidth += textWidth(visibleText[i]);
					charCount = i + 1;
				}
				
				visibleText = visibleText.substring(0, charCount);
			}
			
			// Draw only the visible portion
			if (visibleText.length > 0) {
				text(visibleText, drawX, 0);
			}
		}
	}
	
	pop();
}

function drawUI() {
	// Save the current 3D transformation state
	push();
	
	// Reset all transformations but keep WEBGL context
	resetMatrix();
	
	// Set up orthographic projection for UI without affecting 3D camera
	let currentCamera = this._renderer._curCamera;
	camera(0, 0, 1, 0, 0, 0, 0, 1, 0);
	ortho(-width/2, width/2, -height/2, height/2, -100, 100);

	// draw the volume visualizer line	
	var vol = amp.getLevel();
	volHistory.push(vol);
	stroke(0);
	noFill();
	beginShape();
	for(var i=0; i< volHistory.length; i++){
		var y = map(volHistory[i], 0, 1, height/2, 0);
		vertex(i,y);
	}
	endShape();
	// handle resizing of the window by chopping the difference between length and width/2
	if(volHistory.length > width/2 - 10){
		volHistory.splice (0, (volHistory.length-(width/2-10)));
	}
	
		
	// Draw play/pause button (centered in top right quarter)
	push();
	translate(width/4, -height/4, 0);
	
	// Button background
	fill(50, 180);
	stroke(220);
	strokeWeight(2);
	ellipse(0, 0, playPauseButton.size);
	
	// Button icon (scaled with button size)
	fill(220);
	noStroke();
	let iconScale = playPauseButton.size / 50; // Scale relative to original size
	if (isPlaying) {
		// Pause icon (two rectangles)
		rect(-6 * iconScale, -10 * iconScale, 4 * iconScale, 20 * iconScale);
		rect(2 * iconScale, -10 * iconScale, 4 * iconScale, 20 * iconScale);
	} else {
		// Play icon (triangle)
		triangle(-4 * iconScale, -8 * iconScale, -4 * iconScale, 8 * iconScale, 6 * iconScale, 0);
	}


	pop();
	
	// Draw skip back button
	push();
	translate(-width/2 + skipBackButton.x, -height/2 + skipBackButton.y, 0);
	
	// Button background
	fill(40, 150);
	stroke(180);
	strokeWeight(2);
	ellipse(0, 0, skipBackButton.size);
	
	// Skip back icon (triangle pointing left with line) - scaled
	fill(180);
	noStroke();
	let backIconScale = skipBackButton.size / 40; // Scale relative to original size
	rect(-10 * backIconScale, -6 * backIconScale, 2 * backIconScale, 12 * backIconScale); // Left line
	triangle(-6 * backIconScale, 0, 2 * backIconScale, -6 * backIconScale, 2 * backIconScale, 6 * backIconScale); // Triangle pointing left
	pop();
	

	// Draw skip forward button
	push();
	translate(-width/2 + skipForwardButton.x, -height/2 + skipForwardButton.y, 0);
	
	// Button background - make it more visible
	fill(40, 150);
	stroke(180);
	strokeWeight(2);
	ellipse(0, 0, skipForwardButton.size);
	
	// Skip forward icon (triangle pointing right with line) - scaled
	fill(180);
	noStroke();
	let forwardIconScale = skipForwardButton.size / 40; // Scale relative to original size
	triangle(-2 * forwardIconScale, -6 * forwardIconScale, -2 * forwardIconScale, 6 * forwardIconScale, 6 * forwardIconScale, 0); // Triangle pointing right
	rect(7 * forwardIconScale, -6 * forwardIconScale, 2 * forwardIconScale, 12 * forwardIconScale); // Right line
	pop();
	

	// Update scrolling animation
	updateScrolling();
	
	// Display current track info with scrolling (positioned near the buttons)
	fill(0);
	let maxTextWidth = width / 2 - 40; // Half canvas width minus padding
	
	// Draw scrolling title
	drawScrollingText(
		playlist[currentTrackIndex].title, 
		-width/2 + playPauseButton.x, 
		-height/2 + playPauseButton.y + height * .25, 
		0, 
		titleScrollOffset, 
		maxTextWidth, 
		14
	);
	
	// Draw scrolling artist
	drawScrollingText(
		playlist[currentTrackIndex].artist, 
		-width/2 + playPauseButton.x, 
		-height/2 + playPauseButton.y + 70, 
		0, 
		artistScrollOffset, 
		maxTextWidth, 
		12
	);
	
	// Restore the 3D transformation state
	pop();
}

function draw() {
	size = min(width / 18, height / 18);
	clear();
	
	translate(-width/4, 0, 0);

	// 3D visualization - use default WEBGL perspective
	
	let targetRotY, targetRotX;
	if (parentViewportWidth > 0 && parentViewportHeight > 0) {
		targetRotY = map(viewMouseX, 0, parentViewportWidth, 0.75 * -PI, 0.75 * PI);
		targetRotX = map(viewMouseY, 0, parentViewportHeight, 0.75 * PI, 0.75 * -PI);
	} else {
		targetRotY = 0;
		targetRotX = 0;
	}
		
	// Smooth interpolation to target rotation
	rotY = lerp(rotY, targetRotY, 0.1);
	rotX = lerp(rotX, targetRotX, 0.1);
	
	rotateX(rotX);
	rotateY(rotY);
	
	spectrum = fft.analyze();
	let bassVol = fft.getEnergy(20, 140);
	if (bassVol> 240) {
		stroke(255,255,0,20);
	}else{
		stroke(0,20);
	}
	
	let offset = size/2 - num/2 * size;
	translate(offset, offset, offset);
	
	let totalCubes = num * num * num;
	for(let i =0; i<totalCubes; i++){
		let pos = distFromCenter[i];
		let c = map(spectrum[i],0 , 255, minValue, 255);
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
	
	// Draw 2D UI overlay
	drawUI();
}