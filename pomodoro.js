var pomodoro =

  init:function(){
    this.domVariables();
    this.timerVariables();
    this.bind Events();
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
  this.coundownDisplay.onclick = pomodoro.startCountdown;
  this.resetCountdownBtn.onclick = pomodoro.resetCountdown;
  this.stopCountdownBtn.onclick = pomodoro.stopCountdown;
  this.startCountdownBtn.onclick = pomodoro.startCountdown;
},




























}
