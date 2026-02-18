const wpm=localStorage.getItem("wpm");
const accuracy=localStorage.getItem("accuracy");
const wpmRecord=localStorage.getItem("wpmRecord");
const score = Math.round((accuracy*wpm)/100);



document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("WPM-results").textContent = wpm;
    document.getElementById("Accuracy").textContent = accuracy+"%";
    document.getElementById("Score").textContent = score;
    document.getElementById("record-WPM").textContent = wpmRecord;
    if(score>wpmRecord){
        document.getElementById("image-results").src = "assets/images/icon-new-pb.svg";
    }
});


function restartTest(){
    localStorage.setItem("firstPlay", false);
    location.replace("./index.html") 
}
