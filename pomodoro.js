var pomodoro = {
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


    
  }
}
