


const alphabet = "abcdefghijklmnopqrstuvwxyz";
const alphabetMaj ="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const ponctu =".,!:;? Backspace";
var type_passage="";
var start_time=0;
var end_time=0;
var firstKey=0;
var wpm=0;
var accuracy=0;
var test_possible=false;
var test_active=false;
var timed=true;




document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#button-difficulty .button-parameters[data-difficulty="easy"]').classList.add('active');
    document.querySelector('#button-mode .button-parameters[data-mode="timed"]').classList.add('active');

    if(localStorage.getItem("firstPlay")==null){
      firstPlay=true;
    }
    else{
      removeStartScene();
      document.getElementById("record-WPM").textContent = localStorage.getItem("wpmRecord");
      firstPlay=false;

      
    }
    
});

setInterval(updateAccuracy, 1000);
setInterval(updateWPM,1000);
setInterval(updateTimer,1000);

function updateTimer(){
  if(test_active==true && timed==true){
    let timer=Math.round(((Date.now()-start_time)/1000));
    console.log(timer);
    if(timer<10){
      document.getElementById("Time").innerHTML = "0:0"+timer;
    }
    else if(timer<60 && timer>=10){
      document.getElementById("Time").innerHTML = "0:"+timer;
    }
    else{
      document.getElementById("Time").innerHTML = "1:00";
      showResults();

    }
    
  }

}

async function updateAccuracy() {
  try {
    const originalText = document.getElementById("passage-text").textContent;
    let originalTextTrim=originalText.slice(0,type_passage.length);
    var sameLetters=0;
    for (i=0; i<type_passage.length;i++){
      if(originalTextTrim[i]==type_passage[i]){
        sameLetters++;
      }
    }
    accuracy=Math.round((sameLetters/type_passage.length)*100);
    if(type_passage.length==0){
      accuracy=0;
    }

    document.getElementById("Accuracy").textContent = accuracy+"%";
  }catch (error) {
    if(test_active){
      console.error('Error loading the text:', error);
    }
  }

}
function updateWPM() {
  if(end_time==0){
    wpm=Math.round((type_passage.length/5)/(((Date.now()-start_time)/1000)/60));//5 char = 1 word
  }

  document.getElementById("WPM").innerHTML = wpm;
  
  
}


function removeStartScene(){
  document.getElementById("start-scene").style.display = "none";
  document.querySelector(".passage-container").style.filter = "none";  
  loadRandomText("easy");
  test_possible=true;

}


async function loadRandomText(difficulty) {
  try {
    const response = await fetch('data.json'); // Path to your JSON file
    const data = await response.json();

    // Get a random text from the specified difficulty
    const texts = data[difficulty];
    const randomIndex = Math.floor(Math.random() * texts.length);
    const randomText = texts[randomIndex].text;

    // Insert the text into the passage container
    const passageTextElement = document.getElementById('passage-text');
    passageTextElement.textContent = randomText;

    // Wrap each letter in a span for styling
    wrapLettersInSpans();
  } catch (error) {
    if(test_active){
      console.error('Error loading the text:', error);
    }
  }
}

//To load the text and be able to change the color of each letter
function wrapLettersInSpans() {
  const passageTextElement = document.getElementById("passage-text");
  const text = passageTextElement.textContent;
  passageTextElement.innerHTML = text
    .split('')
    .map(letter => `<span>${letter}</span>`)
    .join('');
}

document.addEventListener('keydown', function(event) {
  
  if(test_possible==true){
    if(alphabet.includes(event.key) || alphabetMaj.includes(event.key)|| ponctu.includes(event.key)){
      firstKey++;
      if(firstKey==1){
        test_active=true;
        console.log("update start");
        start_time=Date.now();
      }
      updatePassage(event.key);
    }
  }
});


function updatePassage(char){
    if(char=="Backspace" ){
      if(type_passage.length>=1){
        type_passage=type_passage.substring(0, type_passage.length - 1);
      }
    }
    else{
      type_passage+=char;
    }
    updateLetterColors();
    if(type_passage.length==document.getElementById("passage-text").textContent.length){
      showResults();
    }  
    
}
function showResults(){
    test_active=false;
    end_time=Date.now();
    console.log("wpm=",wpm);    
    if(firstPlay){
      localStorage.setItem("wpmRecord",Math.round((accuracy*wpm)/100))
    }
    else{
      if(wpm>localStorage.getItem("wpmRecord")){
        localStorage.setItem("wpmRecord",Math.round((accuracy*wpm)/100))
      }
    }
    localStorage.setItem("wpm", wpm);
    localStorage.setItem("accuracy", accuracy);
    location.replace("./results.html") 
}


function updateLetterColors() {
  const originalText = document.getElementById("passage-text").textContent;
  const letterSpans = document.querySelectorAll('#passage-text span');

  for (let i = 0; i < letterSpans.length; i++) {
    if (i < type_passage.length) {
      if (type_passage[i] === originalText[i]) {
        letterSpans[i].style.color = "hsl(140, 63%, 57%)"; // Correct
      } else {
        letterSpans[i].style.color = "hsl(354, 63%, 57%)"; // Incorrect
        letterSpans[i].style.textDecoration = "underline"; // Incorrect

      }
    } 
    else {
      letterSpans[i].style.color = ""; // Reset to default color
      letterSpans[i].style.textDecoration = "none";
    }
  }
}

//show dropdown buttons
document.querySelectorAll('.dropbtn').forEach(button => {
  button.addEventListener('click', () => {
    const dropdownContent = button.nextElementSibling;
    dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
  });
});
  

document.addEventListener('DOMContentLoaded', function() {
    // Difficulty buttons
    const difficultyButtons = document.querySelectorAll('#button-difficulty .button-parameters');
    difficultyButtons.forEach(button => {
        button.addEventListener('click', function() {
          if(!test_active){
            const difficulty = this.getAttribute('data-difficulty');
            loadRandomText(difficulty);
            difficultyButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
          }
          
        });
    });

    // Mode buttons
    const modeButtons = document.querySelectorAll('#button-mode .button-parameters');
    modeButtons.forEach(button => {
        button.addEventListener('click', function() {
           if(!test_active){
              const mode = this.getAttribute('data-mode');
              if (mode=="timed"){
                timed=true;
              }
              else{
                timed=false;
              }
              modeButtons.forEach(btn => btn.classList.remove('active'));
              this.classList.add('active');
            }
        });
    });
});

