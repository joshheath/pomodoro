var pomodoro = {
  init:function(){
  }
}

window.onload = function(){
  pomodoro.init();
}

var pomodoro = {
  started: false,
  minutes: 0,
  seconds: 0,
  fillerHeight: 0,
  fillerIncrement: 0,
  interval: null,
  minutesDom: null,
  secondsDom: null,
  fillerDom: null,

  init: function(){

  var self = this;

  this.minutesDom = document.querySelector('#minutes');
  this.secondsDom = documents.querySelector('#seconds');
  this.fillerDom = document.querySelector('#filler');

  this.interval = setInterval(function(){
    self.intervalCallback.apply(self);
  }, 1000)

  document.querySelector('#work').onclick=function(){
    self.startWork.apply(self);
  };

  document.querySelector('#shortBreak').onclick = function(){
    self.startShortBreak.apply(self);
  };

  document.querySelector('#longBreak').onclick = function(){
    self.startLongBreak.apply(self);
  };

  document.querySelector('#stop').onclick = function(){
    self.stopTimer.apply(self);
  };
},

resetVariables: function(mins,secs, started) {
  this.minutes = mins;
  this.seconds = secs;
  this.started = started;
  this.fillerIncrement = 200 / (this.minutes*60);
  this.fillerHeight = 0;
},

startWork: function(){
  this.resetVariables(25,0,true)
},

startShortBreak: function(){
  this.resetVariables(5,0,true)
},
