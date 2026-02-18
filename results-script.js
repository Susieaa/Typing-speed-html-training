const wpm=localStorage.getItem("wpm");
const accuracy=localStorage.getItem("accuracy");
const wpmRecord=localStorage.getItem("wpmRecord");



document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("WPM-results").textContent = wpm;
    document.getElementById("Accuracy").textContent = accuracy+"%";
    document.getElementById("Score").textContent = Math.round((accuracy*wpm)/100);
    document.getElementById("record-WPM").textContent = wpmRecord;
    if(wpm>wpmRecord){
        document.getElementById("image-results").src = "assets/images/icon-new-pb.svg";
    }
});


function restartTest(){
    localStorage.setItem("firstPlay", false);
    location.replace("./game.html") 
}