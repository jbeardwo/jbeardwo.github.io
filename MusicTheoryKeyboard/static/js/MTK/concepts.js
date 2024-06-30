var nowPlaying = [];
var quizActive = false;
var questionNumber = 0;
var score = 0;
var solution = '';
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
    'KeyY' : 'a4',
    'Digit7' : 'bb4',
    'KeyU' : 'b4',
    'KeyI' : 'c5',
    'Digit9' : 'db5',
    'KeyO' : 'd5',
    'Digit0' : 'eb5',
    'KeyP' : 'e5'
};
var numToNote = {
    1:'c3',
    2:'db3',
    3:'d3',
    4:'eb3',
    5:'e3',
    6:'f3',
    7:'gb3',
    8:'g3',
    9:'ab3',
    10: 'a3',
    11: 'bb3',
    12: 'b3',
    13: 'c4',
    14: 'db4',
    15: 'd4',
    16: 'eb4',
    17: 'e4',
    18: 'f4',
    19: 'gb4',
    20: 'g4',
    21: 'ab4',
    22: 'a4',
    23: 'bb4',
    24: 'b4',
    25: 'c5',
    26: 'db5',
    27: 'd5',
    28: 'eb5',
    29: 'e5'
};

var noteToNum = {
    'c3': 1,
    'db3': 2,
    'd3': 3,
    'eb3': 4,
    'e3': 5,
    'f3': 6,
    'gb3': 7,
    'g3': 8,
    'ab3': 9,
    'a3': 10,
    'bb3': 11,
    'b3': 12,
    'c4': 13,
    'db4': 14,
    'd4': 15,
    'eb4': 16,
    'e4': 17,
    'f4': 18,
    'gb4': 19,
    'g4': 20,
    'ab4': 21,
    'a4': 22,
    'bb4': 23,
    'b4': 24,
    'c5': 25,
    'db5': 26,
    'd5': 27,
    'eb5': 28,
    'e5': 29        
};
var majorScale = [
    0,  // root
    2,  // whole
    4,  // whole
    5,  // half
    7,  // whole
    9,  // whole
    11, // whole
    12  // half                 
];
var minorScale = [
    0,  // root
    2,  // whole
    3,  // half
    5,  // whole
    7,  // whole
    8,  // half
    10, // whole
    12  // whole
];
var noteNameArray = ['a','bb','b','c','db','d','eb','e','f','gb','g'];
var availableKeys = ['c3','db3','d3','eb3','e3','f3','gb3','g3','ab3','a3','bb3','b3','c4','db4','d4','eb4','e4','f4','gb4','g4','ab4','a4','bb4','b4','c5','db5','d5','eb5','e5']

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

function pianoKeyDown(noteName) {
    
    highlightKey(noteName);
    answerSelect(noteName);
    note = teoria.note(noteName);
    playNote(note);
}

function playNote(note){
	var delay = 0; // play one note every quarter second
	var midiNote = note.midi(); // the MIDI note
	var velocity = 127; // how hard the note hits
  var noteName = note.name() + note.accidental() + note.octave();
	// play the note
	MIDI.setVolume(0, 127);
  if(!nowPlaying.includes(noteName)){
  	MIDI.noteOn(0, midiNote, velocity, delay);
    nowPlaying.push(noteName);
  }

}

function stopNote(note){
  var midiNote = note.midi();
  var noteName = note.name() + note.accidental() + note.octave();
  MIDI.noteOff(0, midiNote, 0);
  if(nowPlaying.includes(noteName)){
    nowPlaying.splice(nowPlaying.indexOf(noteName), 1);
  }
}

function pianoKeyUp(note) {
    var keyDiv = document.getElementById(note + "Key");
    if(!(keyDiv.className.includes("selectKey")||keyDiv.className.includes("selectBlackKey"))){
        revertKey(note);
    }
    note = teoria.note(note);
    stopNote(note);
}

function loadMIDI() {
  MIDI.loadPlugin({
		soundfontUrl: "../js/soundfont/",
		instrument: "acoustic_grand_piano",
		onprogress: function(state, progress) {
		},
		onsuccess: function() {
		}
	});
}

function highlightKey(note) {
    var divID = note + "Key";
    if(!document.getElementById(divID).className.includes("selectKey")){
        if(document.getelementbyid(divid).classname.includes("lstraightkey") ) {
            document.getelementbyid(divid).classname = "highlightkey lstraightkey";
        } else if(document.getelementbyid(divid).classname.includes("cutkey")) {
            document.getelementbyid(divid).classname = "highlightkey cutkey";
            
        } else if(document.getelementbyid(divid).classname.includes("rstraightkey")) {
            document.getelementbyid(divid).classname = "highlightkey rstraightkey";
        } else if(document.getelementbyid(divid).classname.includes("blackkey")) {
            document.getelementbyid(divid).classname = "key highlightblackkey";
        }
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
    } else if(document.getElementById(divID).className.includes("blackKey")||document.getElementById(divID).className.includes("highlightBlackKey")) {
        document.getElementById(divID).className = "key selectBlackKey";
    }
}

function selectRandomKey(){
    var randomKey = availableKeys[Math.floor(Math.random()*availableKeys.length)];
    selectKey(randomKey);
    return randomKey;
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

function unhighlightAll(){
    document.querySelectorAll('.highlightBlackKey,.highlightKey').forEach(function(i){
        let noteName = i.id.slice(0,-3);
        revertKey(noteName);
    })
}

function unSelectAll(){
    document.querySelectorAll('.selectBlackKey,.selectKey').forEach(function(i){
        let noteName = i.id.slice(0,-3);
        revertKey(noteName);
    })
}

function highlightWhiteKeys(){
    unhighlightAll();
    document.querySelectorAll('.cutKey, .lStraightKey, .rStraightKey').forEach(function(i){
        let noteName = i.id.slice(0,-3);
        highlightKey(noteName);
    })
}

function highlightBlackKeys(){
    unhighlightAll();
    document.querySelectorAll('.blackKey').forEach(function(i){
        let noteName = i.id.slice(0,-3);
        highlightKey(noteName);
    })
}

function highlightMajorScale(rootNote){
    highlightKey(rootNote);
    var rootNum = noteToNum[rootNote];
    for(var i=0;i<majorScale.length;i++){
        let nextNote = rootNum + majorScale[i];
        highlightKey(numToNote[nextNote]);
    }
}


function highlightMinorScale(rootNote){
    highlightKey(rootNote);
    var rootNum = noteToNum[rootNote];
    for(var i=0;i<minorScale.length;i++){
        let nextNote = rootNum + minorScale[i];
        highlightKey(numToNote[nextNote]);
    }
}

function selectMajorScale(rootNote){
    selectKey(rootNote);
    var rootNum = noteToNum[rootNote];
    for(var i=0;i<majorScale.length;i++){
        let nextNote = rootNum + majorScale[i];
        selectKey(numToNote[nextNote]);
    }
}


function selectMinorScale(rootNote){
    selectKey(rootNote);
    var rootNum = noteToNum[rootNote];
    for(var i=0;i<minorScale.length;i++){
        let nextNote = rootNum + minorScale[i];
        selectKey(numToNote[nextNote]);
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

//Key label Visibility

function toggleVisibility(inClass){
    let classRef = '.' + inClass;
    document.querySelectorAll(classRef).forEach(function(i){
        if(i.style.display != 'none'){
            i.style.display = 'none';
        }else if(i.style.display=='none'){
            i.style.display = 'block';
        }
    });
    
}


//Lesson Navigation

var currentPage = 1;
document.getElementById('page1').style.display = 'block';
var numPages = document.querySelectorAll('.content').length;

function showNext() {
    document.querySelectorAll('.content').forEach(function(i) {
        i.style.display = 'none';
    });

    if(currentPage<numPages){
        currentPage++;
    }
    document.getElementById('page'+currentPage).style.display = 'block';

    if(currentPage>1){
        document.querySelector('.previous').style.display = 'inline';
    }
    if(currentPage==numPages){
        document.querySelector('.next').style.display = 'none';
    }
}

function showPrevious() {
    document.querySelectorAll('.content').forEach(function(i) {
        i.style.display = 'none';
    });

    if(currentPage>1){
        currentPage--;
    }
    document.getElementById('page'+currentPage).style.display = 'block';

    if(currentPage>1){
        document.querySelector('.previous').style.display = 'inline';
    }

    if(currentPage==1){
        document.querySelector('.previous').style.display = 'none';
    }

    if(currentPage<numPages){
        document.querySelector('.next').style.display = 'inline';
    }
}

function answerSelect(note){
    if(quizActive){
        if(document.title.includes("Quiz: Notes")){
            if(note.slice(0,-1)==solution){
                score++;
                document.querySelector(".score").innerHTML = score;
            }
            if(questionNumber == 10){
                quizActive = false;
                document.querySelector(".question").innerHTML = "Final Score:";
                document.querySelector(".quizStart").disabled = false;
            }
            if(questionNumber<10){
                noteQuizQuestion();
            }
        }else if(document.title.includes("Quiz: Steps")){
            solution = numToNote[solution];
            unSelectAll();
            if(note==solution){
                score++;
                document.querySelector(".score").innerHTML = score;
            }
            if(questionNumber == 10){
                quizActive = false;
                document.querySelector(".question").innerHTML = "Final Score:";
                document.querySelector(".quizStart").disabled = false;
            }
            if(questionNumber<10){
                stepQuizQuestion();
            }
        }
    }
}

function startQuiz(){
    if(!quizActive){
        questionNumber = 0;
        score = 0;
        document.querySelector(".score").innerHTML = score;
        if(document.title.includes("Quiz: Notes") ){
            noteQuizQuestion();
        }else if(document.title.includes("Quiz: Steps") ){
            stepQuizQuestion();
        }else if(document.title.includes("Quiz: Scale Identification")){
            scaleIDQuizQuestion();
            document.querySelectorAll(".IDQuizButton").forEach(function (i){
                i.disabled = false;
            });
            document.querySelector(".question").innerHTML = "Identify the quality of the highlighted scale."
        }
        document.querySelector(".quizStart").disabled = true;
        quizActive = true;
    }
}

function noteQuizQuestion(){
    solution = noteNameArray[Math.floor(Math.random()*noteNameArray.length)];
    var questionDiv = document.querySelector(".question");
    questionDiv.innerHTML = solution;
    questionNumber++;
}


function stepQuizQuestion(){
    var baseNote = selectRandomKey();
    var baseNoteNum = noteToNum[baseNote];
    var qStep = Math.floor(Math.random()*2+1);
    var direction;
    var questionDiv = document.querySelector(".question");
    if(Math.random()<.5){
        direction = 'up';
        solution = baseNoteNum + qStep;
        if(solution>29){
            solution = baseNoteNum - qStep;
            direction = 'down';
        }
    }else{
        direction = 'down';
        solution = baseNoteNum - qStep;
        if(solution<1){
            solution = baseNoteNum + qStep;
            direction = 'up';
        }
    }
    if(qStep == 1){
        questionDiv.innerHTML = 'A Half-Step ' + direction + ' from the highlighted Key.';
    }else if (qStep == 2){
        questionDiv.innerHTML = 'A Whole-step ' + direction + ' from the highlighted Key.';
    }   
        questionNumber++;
}

function scaleIDQuizQuestion(){
    var randomKey = availableKeys[Math.floor(Math.random()*(availableKeys.length-12))];
    if(Math.random()<.5){
        selectMajorScale(randomKey);
        solution = 'major';
    }else{
        selectMinorScale(randomKey);
        solution = 'minor';
    }
}

function scaleIDQuizAnswer(ans){
    unSelectAll();
    if(ans==solution){
        score++;
        document.querySelector(".score").innerHTML = score;
    }
    questionNumber++;
    if(questionNumber == 10){
        quizActive = false;
        document.querySelector(".question").innerHTML = "Final Score:";
        document.querySelector(".quizStart").disabled = false;
        document.querySelectorAll(".IDQuizButton").forEach(function (i){
            i.disabled = true;
        });
    }else{
        scaleIDQuizQuestion();
    }
}

//SPLIT SCALE QUIZZES INTO IDENTIFICATION AND PLAYING THEM INSTEAD OF MAJOR AND MINOR