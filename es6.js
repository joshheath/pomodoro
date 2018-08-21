const pomodoro = {

  init: function(){
    this.domVariables();
    this.timerVariables();
    this.bindEvents();
    this.updateAllDisplays();
    this.requestNotification();
  },

  breakNotification: undefined,
  workNotification: undefined,

  domVariables: function(){
// Timer buttons
    this.toggleTimerBtns = document.getElementsByClassName("toggle-timer");
    this.increaseSession = document.getElementById("increase-session");
    this.decreaseSession = document.getElementById("decrease-session");
    this.increaseBreak = document.getElementById("increase-break");
    this.decreaseBreak = document.getElementById("decrease-break");
// Timer display
    this.sessionLengthDisplay = document.getElementById("session-length");
    this.breakLengthDisplay = document.getElementById("break-length");
// Countdown
    this.countdownDisplay = document.getElementById("countdown");
    this.typeDisplay = document.getElementById("type");
    this.resetCountdownBtn = document.getElementById("reset-session");
    this.stopCountdownBtn = document.getElementById("stop-session");
    this.startCountdownBtn = document.getElementById("start-session");
    this.countdownContainer = document.getElementById("countdown-container")
  },


  timerVariables: function(){
// Default timer lengths
    this.sessionLength = 20;
    this.breakLength = 5;
//Define set interval variable method
    this.timeInterval = false;
    this.workSession = true;
    this.pausedTime = 0;
    this.timePaused = false;
    this.timeStopped = false;
  },

  bindEvents: function(){
// Link session increase / decrease to relevant buttons
    this.increaseSession.onclick = pomodoro.incrSession;
    this.decreaseSession.onclick = pomodoro.decrSession;
    this.increaseBreak.onclick = pomodoro.incrBreak;
    this.decreaseBreak.onclick = pomodoro.decrBreak;

// Link start / stop / reset buttons
    this.countdownDisplay.onclick  = pomodoro.startCountdown;
    this.resetCountdownBtn.onclick = pomodoro.resetCountdown;
    this.stopCountdownBtn.onclick  = pomodoro.stopCountdown;
    this.startCountdownBtn.onclick = pomodoro.startCountdown;

    },

  updateAllDisplays: function (){
// Update html to respond when buttons are clicked
    pomodoro.sessionLengthDisplay.innerHTML = this.sessionLength;
    pomodoro.breakLengthDisplay.innerHTML = this.breakLength;
    pomodoro.countdownDisplay.innerHTML = this.sessionLength +".00";

    pomodoro.resetVariables();
  },

  requestNotification:function(){
    if(!("Notification" in window)){
      return console.log("This browser does not support desktop notification");
    }
  },

  incrSession: function() {
    if ( pomodoro.sessionLength < 59 ) {
      pomodoro.sessionLength += 1;
      pomodoro.updateAllDisplays();
    }
  },

  decrSession: function(){
    if(pomodoro.sessionLength > 1){
      pomodoro.sessionLength -= 1;
      pomodoro.updateAllDisplays();
    }
  },

  incrBreak: function(){
    if(pomodoro.breakLength < 30){
      pomodoro.breakLength += 1;
      pomodoro.updateAllDisplays();
    }
  },

  decrBreak: function(){
    if(pomodoro.breakLength > 1){
      pomodoro.breakLength -= 1;
      pomodoro.updateAllDisplays();
    }
  },

// Reset variables
  resetVariables: function(){
    pomodoro.timeInterval = false;
    pomodoro.workSession = true;
    pomodoro.pausedTime = 0;
    pomodoro.timeStopped = false;
    pomodoro.timePaused = false;
  },

  startCountdown:function(){
    pomodoro.disableButtons();
// Change work / break displays
    pomodoro.displayType();
// Pause if timer is running, start countdown if not
    if(pomodoro.timeInterval !== false){
      pomodoro.pauseCountdown();
    } else {
// Use system time and convert milliseconds to correct format
      pomodoro.startTime = new Date().getTime();
// Check if pomodoro has been unpaused
      if(pomodoro.timePaused === false){
        pomodoro.unPauseCountdown();
      } else {
        pomodoro.endTime = pomodoro.startTime + pomodoro.pausedTime;
        pomodoro.timePaused = flase;
      }
// Update countdown just under 1000ms to avoid log - check against system time
      pomodoro.timeInterval = setInterval(pomodoro.updateCountdown, 990);
    }
  },

  updateCountdown: function() {
    // Get differnce between the current time and the
    // end time in miliseconds. difference = remaining time
    const currTime = new Date().getTime();
    const difference = pomodoro.endTime - currTime;
    // Convert remaining milliseconds into minutes and seconds
    let seconds = Math.floor( ( difference/1000 ) % 60 );
    const minutes = Math.floor( ( difference/1000 ) / 60 % 60 );
    // Add 0 to seconds if less than ten
    if ( seconds < 10 ) { seconds = "0" + seconds; }
    // Display remaining minutes and seconds, unless there is less than 1 second
    // left on timer. Then change to next session.
    if ( difference > 1000 ) {
      pomodoro.countdownDisplay.innerHTML = minutes + ":" + seconds;
    } else {
      pomodoro.changeSessions();
    }

  },

  changeSessions: function(){
// Stop countdown
    clearInterval(pomodoro.timeInterval);
    pomodoro.playSound();
// Toggle active work session or not - determines whether work or break session will be displayed
    if(pomodoro.workSession === true) {
      pomodoro.workSession = false;
    } else {
      pomodoro.workSession = true;
    }
// Stop countdown
    pomodoro.timeInterval = false;
// Restart with work session changed
    pomodoro.startCountdown();
  },

  pauseCountdown: function(){
// Save paused time and restart at right time
    const currTime = new Date().getTime();
    pomodoro.pausedTime = pomodoro.endTime - currTime;
    pomodoro.timePaused = true
// Stop countdown on second click
    clearInterval(pomodoro.timeInterval);
// Reset variable so counter starts again when clicked
    pomodoro.timeInterval = false;
  },

  unPauseCountdown: function(){
    if (pomodoro.workSession === true){
      pomodoro.endTime = pomodoro.startTime + (pomodoro.sessionLength * 600000);
    }
  },

  resetCountdown: function(){
// Stop clock and reset variables
    clearInterval(pomodoro.timeInterval);
    pomodoro.resetVariables();
// Restart variables
    pomodoro.startCountdown();
  },

  stopCountdown: function(){
// Stop timer
    clearInterval(pomodoro.timeInterval);
// Update HTML
    pomodoro.updateAllDisplays();
// Reset variables
    pomodoro.resetVariables();
    pomodoro.unDisableButtons();
  },

  displayType: function() {
    // Check what session is running and change appearance and text above
    // countdown depending on session (break or work)
    if ( pomodoro.workSession === true ) {
      pomodoro.typeDisplay.innerHTML = "Work session";


      pomodoro.countdownContainer.className = pomodoro.countdownContainer.className.replace( "break", "" );
    } else {
      pomodoro.typeDisplay.innerHTML = "Break";
      if ( pomodoro.countdownContainer.className !== "break" ) {
        pomodoro.countdownContainer.className += "break";
      }
    }
  },

  playSound: function(){
    const mp3 = "http://soundbible.com/grab.php?id=1746&type=mp3";
    const audio = new Audio(mp3);
    audio.play();
  },

  disableButtons: function(){
    for(let i = 0; i < pomodoro.toggleTimerBtns.length; i++){
      pomodoro.toggleTimerBtns[i].setAttribute("disabled", "disabled");
      pomodoro.toggleTimerBtns[i].setAttribute("title", "Stop the countdown to change timer length");
    }
  },

  unDisableButtons: function(){
    for(let i = 0; i < pomodoro.toggleTimerBtns.length; i++){
      pomodoro.toggleTimerBtns[i].removeAttribute("disabled");
      pomodoro.toggleTimerBtns[i].removeAttribute("title");
    }
  }
};

pomodoro.init();
