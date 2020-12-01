var nowPlaying = [];
var keyMap = {
    'KeyZ' : 'c3',
    'KeyS' : 'db3',
    'KeyX' : 'd3',
    'KeyD' : 'eb3',
    'KeyC' : 'e3',
    'KeyV' : 'f3',
    'KeyG' : 'gb3',
    'KeyB' : 'g3',
    'KeyH' : 'ab3',
    'KeyN' : 'a3',
    'KeyJ' : 'bb3',
    'KeyM' : 'b3',
    'KeyQ' : 'c4',
    'Digit2' : 'db4',
    'KeyW' : 'd4',
    'Digit3' : 'eb4',
    'KeyE' : 'e4',
    'KeyR' : 'f4',
    'Digit5' : 'gb4',
    'KeyT' : 'g4',
    'Digit6' : 'ab4',
    'KeyY' : 'a5',
    'Digit7' : 'bb4',
    'KeyU' : 'b4',
    'KeyI' : 'c5',
    'Digit9' : 'db5',
    'KeyO' : 'd5',
    'Digit0' : 'eb5',
    'KeyP' : 'e5'
}

function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("window").style.marginLeft = "250px";
    document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
}

/* Set the width of the side navigation to 0 and the left margin of the page content to 0, and the background color of body to white */
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("window").style.marginLeft = "0";
    document.body.style.backgroundColor = "white";
}

document.addEventListener('keydown',hardwareKeyDown);
document.addEventListener('keyup', hardwareKeyUp);

function pianoKeyClick(note){
    pianoKeyDown(note);
    setTimeout(function(){
      pianoKeyUp(note);
    }, 2000);
}

function pianoKeyDown(note) {
    highlightKey(note);
    note = teoria.note(note);
    playNote(note);
}

function playNote(note){
	var delay = 0; // play one note every quarter second
	var midiNote = note.midi(); // the MIDI note
	var velocity = 127; // how hard the note hits
	// play the note
	MIDI.setVolume(0, 127);
	MIDI.noteOn(midiNote, velocity);

}

function stopNote(note){
  console.log('noteoff')
  MIDI.noteOff(0, note, 0);
}

function pianoKeyUp(note) {
    revertKey(note);
    note = teoria.note(note);
    stopNote(note);
}

function loadMIDI() {
  MIDI.loadPlugin({
		soundfontUrl: "../js/soundfont/",
		instrument: "acoustic_grand_piano",
		onprogress: function(state, progress) {
			console.log(state, progress);
		},
		onsuccess: function() {
			console.log('MIDI loaded')
		}
	});
}

function highlightKey(note) {
    var divID = note + "Key";
    if(document.getElementById(divID).className.includes("lStraightKey")) {
        document.getElementById(divID).className = "highlightKey lStraightKey";
    } else if(document.getElementById(divID).className.includes("cutKey")) {
        document.getElementById(divID).className = "highlightKey cutKey";
    } else if(document.getElementById(divID).className.includes("rStraightKey")) {
        document.getElementById(divID).className = "highlightKey rStraightKey";
    } else if(document.getElementById(divID).className.includes("blackKey")) {
        document.getElementById(divID).className = "key highlightBlackKey";
    }
}

function selectKey(note){
    var divID = note + "Key";
    if(document.getElementById(divID).className.includes("lStraightKey")) {
        document.getElementById(divID).className = "selectKey lStraightKey";
    } else if(document.getElementById(divID).className.includes("cutKey")) {
        document.getElementById(divID).className = "selectKey cutKey";
    } else if(document.getElementById(divID).className.includes("rStraightKey")) {
        document.getElementById(divID).className = "selectKey rStraightKey";
    } else if(document.getElementById(divID).className.includes("blackKey")) {
        document.getElementById(divID).className = "key selectBlackKey";
    }
}

function revertKey(note){
    var divID = note + "Key";
    if(document.getElementById(divID).className.includes("lStraightKey")) {
        document.getElementById(divID).className = "key lStraightKey";
    } else if(document.getElementById(divID).className.includes("cutKey")) {
        document.getElementById(divID).className = "key cutKey";
    } else if(document.getElementById(divID).className.includes("rStraightKey")) {
        document.getElementById(divID).className = "key rStraightKey";
    } else if(document.getElementById(divID).className.includes("BlackKey")) {
        document.getElementById(divID).className = "key blackKey";
    }
}

function hardwareKeyDown(e){
    var keyPressed = e.code;
    if(keyMap[keyPressed]){
      pianoKeyDown(keyMap[keyPressed]);
    }
}

function hardwareKeyUp(e){
  var keyPressed = e.code;
  if(keyMap[keyPressed]){
    pianoKeyUp(keyMap[keyPressed]);
  }
}
