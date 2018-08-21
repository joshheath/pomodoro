const pomodoro = {
  init() {

    this.domVariables();
    this.timerVariables();
    this.bindEvents();
    this.updateAllDisplays();
    this.requestNotification();
  },
  // Define notifications to be used by Pomodoro
  breakNotification: undefined,
  workNotification: undefined,
  domVariables() {

    // Toggle timer buttons
    this.toggleTimerBtns = document.getElementsByClassName( "toggle-timer" );
    this.increaseSession = document.getElementById( "increase-session" );
    this.decreaseSession = document.getElementById( "decrease-session" );
    this.increaseBreak   = document.getElementById( "increase-break" );
    this.decreaseBreak   = document.getElementById( "decrease-break" );

    // Timer display
    this.sessionLengthDisplay = document.getElementById( "session-length" );
    this.breakLengthDisplay   = document.getElementById( "break-length" );

    // Countdown
    this.countdownDisplay   = document.getElementById( "countdown" );
    this.typeDisplay        = document.getElementById( "type" );
    this.resetCountdownBtn  = document.getElementById( "reset-session" );
    this.stopCountdownBtn   = document.getElementById( "stop-session" );
    this.startCountdownBtn  = document.getElementById( "start-session" );
    this.countdownContainer = document.getElementById( "countdown-container" );
  },
  timerVariables() {

    // Initial Length values
    this.sessionLength =  20;
    this.breakLength   =  5;

    // Define the variable that includes the setinterval method
    // If the clock is counting down, the value will be true, and
    // the counter will be stopped on click.
    this.timeInterval = false;
    this.workSession = true;
    this.pausedTime = 0;
    this.timePaused = false;
    this.timeStopped = false;
    // Request permission
  },
  bindEvents() {

    // Bind increase/ decrease session length to buttons
    this.increaseSession.onclick = pomodoro.incrSession;
    this.decreaseSession.onclick = pomodoro.decrSession;
    this.increaseBreak.onclick = pomodoro.incrBreak;
    this.decreaseBreak.onclick = pomodoro.decrBreak;

    // Bind start date to #countdown and countdown buttons
    this.countdownDisplay.onclick  = pomodoro.startCountdown;
    this.resetCountdownBtn.onclick = pomodoro.resetCountdown;
    this.stopCountdownBtn.onclick  = pomodoro.stopCountdown;
    this.startCountdownBtn.onclick = pomodoro.startCountdown;

  },
  updateAllDisplays() {

    // Change HTML of displays to reflect current values
    pomodoro.sessionLengthDisplay.innerHTML = this.sessionLength;
    pomodoro.breakLengthDisplay.innerHTML   = this.breakLength;
    pomodoro.countdownDisplay.innerHTML     = `${this.sessionLength}:00`;

    pomodoro.resetVariables();

  },
  requestNotification() {

    if (!("Notification" in window)) {
      return console.log("This browser does not support desktop notification");
    }



  },
  incrSession() {

    if ( pomodoro.sessionLength < 59 ) {
      pomodoro.sessionLength += 1;
      pomodoro.updateAllDisplays();
    }

  },
  decrSession() {

    if (  pomodoro.sessionLength > 1 ) {
      pomodoro.sessionLength -= 1;
      pomodoro.updateAllDisplays();
    }

  },
  incrBreak() {

    if (  pomodoro.breakLength < 30 ) {
      pomodoro.breakLength += 1;
      pomodoro.updateAllDisplays();
    }

  },
  decrBreak() {

    if ( pomodoro.breakLength > 1 ) {
      pomodoro.breakLength -= 1;
      pomodoro.updateAllDisplays();
    }

  },
  // Reset variables to initial values
  resetVariables() {

    pomodoro.timeInterval = false;
    pomodoro.workSession = true;
    pomodoro.pausedTime = 0;
    pomodoro.timeStopped = false;
    pomodoro.timePaused = false;

  },
  startCountdown() {

    pomodoro.disableButtons();

    // Toggle typeDisplay and background color between work and break

    pomodoro.displayType();

    // Pause pomodoro if countdown is currently running, otherwise start
    // countdown

    if ( pomodoro.timeInterval !== false ) {
      pomodoro.pauseCountdown();
    } else {
      // Set start and end time with system time and convert to
      // miliseconds to correctly meassure time ellapsed

      pomodoro.startTime = new Date().getTime();

      // Check if pomodoro has just been unpaused
      if ( pomodoro.timePaused === false ) {
        pomodoro.unPauseCountdown();
      } else {
        pomodoro.endTime = pomodoro.startTime + pomodoro.pausedTime;
        pomodoro.timePaused = false;
      }

      // Run updateCountdown every 990ms to avoid lag with 1000ms,
      // Update countdown checks time against system time and updates
      // #countdown display
      pomodoro.timeInterval = setInterval(pomodoro.updateCountdown,990);
    }

  },
  updateCountdown() {

    // Get differnce between the current time and the
    // end time in miliseconds. difference = remaining time
    const currTime = new Date().getTime();
    const difference = pomodoro.endTime - currTime;

    // Convert remaining milliseconds into minutes and seconds
    let seconds = Math.floor( ( difference/1000 ) % 60 );
    const minutes = Math.floor( ( difference/1000 ) / 60 % 60 );

    // Add 0 to seconds if less than ten
    if ( seconds < 10 ) { seconds = `0${seconds}`; }

    // Display remaining minutes and seconds, unless there is less than 1 second
    // left on timer. Then change to next session.
    if ( difference > 1000 ) {
      pomodoro.countdownDisplay.innerHTML = `${minutes}:${seconds}`;
    } else {
      pomodoro.changeSessions();
    }

  },



  changeSessions() {

    // Stop countdown
    clearInterval( pomodoro.timeInterval );

    pomodoro.playSound();

    // Toggle between workSession being active or not
    // This determines if break session or work session is displayed
    if ( pomodoro.workSession === true ) {
      pomodoro.workSession = false;
    } else {
      pomodoro.workSession = true;
    }

    // Stop countdown
    pomodoro.timeInterval = false;
    // Restart, with workSession changed
    pomodoro.startCountdown();

  },
  pauseCountdown() {

        // Save paused time to restart clock at correct time
        const currTime = new Date().getTime();
        pomodoro.pausedTime = pomodoro.endTime - currTime;
        pomodoro.timePaused = true;

        // Stop the countdown on second click
        clearInterval( pomodoro.timeInterval );


        // Reset variable so that counter will start again on click
        pomodoro.timeInterval = false;
  },
  unPauseCountdown() {
    if ( pomodoro.workSession === true ) {
      pomodoro.endTime = pomodoro.startTime + ( pomodoro.sessionLength * 60000 );
    } else {
      pomodoro.endTime = pomodoro.startTime + ( pomodoro.breakLength * 60000 );
    }
  },
  resetCountdown() {

    // Stop clock and reset variables
    clearInterval( pomodoro.timeInterval );
    pomodoro.resetVariables();

    // Restart variables
    pomodoro.startCountdown();

  },
  stopCountdown() {

    // Stop timer
    clearInterval( pomodoro.timeInterval );

    // Change HTML
    pomodoro.updateAllDisplays();

    // Reset Variables
    pomodoro.resetVariables();

    pomodoro.unDisableButtons();

  },


  displayType() {
    // Check what session is running and change appearance and text above
    // countdown depending on session (break or work)
    if ( pomodoro.workSession === true ) {
      pomodoro.typeDisplay.innerHTML = "Time remaining for this work session";


      pomodoro.countdownContainer.className = pomodoro.countdownContainer.className.replace( "break", "" );
    } else {
      pomodoro.typeDisplay.innerHTML = "Break";
      if ( pomodoro.countdownContainer.className !== "break" ) {
        pomodoro.countdownContainer.className += "break";
      }
    }

  },
  playSound() {

    const mp3 = "http://soundbible.com/grab.php?id=1746&type=mp3";
    const audio = new Audio(mp3);
    audio.play();

  },
  disableButtons() {

    for (let i = 0; i < pomodoro.toggleTimerBtns.length; i++) {
      pomodoro.toggleTimerBtns[i].setAttribute("disabled", "disabled");
      pomodoro.toggleTimerBtns[i].setAttribute("title", "Stop the countdown to change timer length");
    }

  },
  unDisableButtons() {

    for (let i = 0; i < pomodoro.toggleTimerBtns.length; i++) {
      pomodoro.toggleTimerBtns[i].removeAttribute("disabled");
      pomodoro.toggleTimerBtns[i].removeAttribute("title");
    }

  }
};

// Initialise on page load
pomodoro.init();
