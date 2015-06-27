(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

//global variables
window.onload = function () {
  var game = new Phaser.Game(320, 460, Phaser.AUTO, 'stressaway');

  // Game States
  game.state.add('boot', require('./states/boot'));
  game.state.add('gameover', require('./states/gameover'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('play', require('./states/play'));
  game.state.add('preload', require('./states/preload'));
  

  game.state.start('boot');
};
},{"./states/boot":2,"./states/gameover":3,"./states/menu":4,"./states/play":5,"./states/preload":6}],2:[function(require,module,exports){

'use strict';

function Boot() {
}

Boot.prototype = {
  preload: function() {
    this.load.image('preloader', 'assets/preloader.gif');
  },
  create: function() {
    this.game.input.maxPointers = 1;
    if (this.game.device.desktop) {
      this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      this.scale.setMinMax(320, 480, 320, 480);
      this.scale.pageAlignHorizontally = true;
      this.scale.pageAlignVertically = true;
    } else {
      this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      this.scale.setMinMax(320, 480, 320, 480);
      this.scale.pageAlignHorizontally = true;
      this.scale.pageAlignVertically = true;
    }
    this.game.state.start('preload');
  }
};

module.exports = Boot;

},{}],3:[function(require,module,exports){

'use strict';
function GameOver() {}

GameOver.prototype = {
  preload: function () {

  },
  create: function () {
    var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};
    this.titleText = this.game.add.text(this.game.world.centerX,100, 'Game Over!', style);
    this.titleText.anchor.setTo(0.5, 0.5);

    this.congratsText = this.game.add.text(this.game.world.centerX, 200, 'You Win!', { font: '32px Arial', fill: '#ffffff', align: 'center'});
    this.congratsText.anchor.setTo(0.5, 0.5);

    this.instructionText = this.game.add.text(this.game.world.centerX, 300, 'Click To Play Again', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    this.instructionText.anchor.setTo(0.5, 0.5);
  },
  update: function () {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};
module.exports = GameOver;

},{}],4:[function(require,module,exports){

'use strict';
function Menu() {}

Menu.prototype = {
  preload: function() {

  },
  create: function() {
    var style = { font: '24px Arial', fill: '#ffffff', align: 'center'};
    
    this.titleText = this.game.add.text(
      this.game.world.centerX, this.game.height * 0.2,
      'Stress Blaster!',
      style
    );
    this.titleText.anchor.setTo(0.5, 0.5);

    this.instructionsText = this.game.add.text(this.game.world.centerX, 400, 'Click anywhere to play "Click The Yeoman Logo"', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    this.instructionsText.anchor.setTo(0.5, 0.5);

  },
  update: function() {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};

module.exports = Menu;

},{}],5:[function(require,module,exports){

  'use strict';
  function Play() {}
  Play.prototype = {
    create: function() {
      //
      this.guy = this.game.add.sprite(this.game.width * 0.5, this.game.height, 'choking_guy');
      this.guy.inputEnabled = true;
      this.guy.hitArea = new Phaser.Rectangle(-20, -150, 90, 70);
      this.guy.anchor.setTo(0.5, 1.0);
      this.isChoking = false;
      this.isOverThroat = false;
      this.guy.events.onInputOver.add(this.onOverThroat, this);
      this.guy.events.onInputOut.add(this.onOutThroat, this);
      this.chokeFrames = [1,2,3,4,5,6,7,8];
      this.chokeFramePos = 0.5;
      this.chokeFrameTarget = 0.5;
      this.chokeDuration = 0.0;
      this.currentFrameDuration = 0.0;
      this.chokeArrivalEpsilon = 0.02;
      this.pain = 0.0;  // TOOD: make more human-like
      //
      if (this.game.device.desktop) {
        this.arm = this.game.add.sprite(this.game.width * 0.5, this.game.height * 0.8, 'arm');
        this.arm.anchor.setTo(0.5, 0.1);
        this.armSwayRadius = 17;
      } else {
        this.arm = null;
      }
      // sfx
      this.chokingSfx = this.game.add.audio('choking');
      this.chokingSfx.allowMultiple = true;
      this.chokingSfx.addMarker('choke0', 0, 0.84);
      this.chokingSfx.addMarker('choke1', 0.88, 0.68);
      this.chokingSfx.addMarker('choke2', 1.56, 1.12);
      //
      this.titleText = this.game.add.text(
        this.game.world.centerX, this.game.height * 0.15,
        'Feeling stressed out?\nChoke this man.',
        { font: '24px Arial', fill: '#ffffff', align: 'center'}
      );
      this.titleText.anchor.setTo(0.5, 0.5);
      this.instructionText = this.game.add.text(
        this.game.world.centerX, this.game.height * 0.15,
        '',
        { font: '16px Arial', fill: '#ffffff', align: 'left'}
      );
      this.instructionText.alpha = 0;
      this.instructionText.anchor.setTo(0.5, 0.5);
      this.textSequenceStarted = false;
      this.instructions = [
        "Science has shown physical violence\nto be the key to releasing stress.",
        "Press on his throat. The longer the better.",
        "It's just a computer program so don't worry.",
        {
          text: "I did give it a pain counter that\ngoes up while being choked.",
          action: function () {
            var tween = this.game.add.tween(this.painText).to(
              {alpha: 1}, 1000, Phaser.Easing.Linear.None, true, 3500
            );
          }.bind(this)
        },
        "But I don't think it's the same as the\npain you, I, or say, a dog would feel.",
        "Breathe deeply and allow all the stress\nto drain out of your body.",
        "Just as the life would be leaving the\nbody of this guy if he were real.",
        "But he's not, so choke away guilt-free!",
        "Studies have shown that people who\nchoked the longest had the best results.",
        "You should try to get the pain meter\nabove 20,000 to ensure effectiveness.",
        "Focus your mind on something that\nhappened today which caused you stress.",
        "Now imagine this prick was behind it.\nLook into his eyes!",
        "CHOKE",
        "CHOKE",
        "Don't stop until you are totally relaxed."
      ];
      this.painText = this.game.add.text(
        this.game.width * 0.1, this.game.height * 0.85,
        '',
        { font: '48px Arial', fill: '#ffffff', align: 'left'}
      );
      this.painText.text = '0';
      this.painText.alpha = 0;
    },
    update: function() {
      if (!this.textSequenceStarted) {
        this.updateText();
      }
      this.updateChoking();
      if (this.arm) {
        this.updateArm();
      }
      this.updateGuy();
      this.updateScore();
    },
    updateArm: function () {
      if (this.isChoking) {
        this.arm.scale.setTo(0.8, 0.8);
      } else {
        this.arm.scale.setTo(1.0, 1.0);
      }
      var pointer = this.game.input.activePointer;
      if (pointer && pointer.withinGame) {
        this.arm.position.setTo(pointer.x, pointer.y);
        // follow the choking a little bit
        if (this.isChoking) {
          var offsetX = this.armSwayRadius * (2 * this.chokeFramePos - 1);
          this.arm.position.x += offsetX; 
        }
      }
    },
    updateGuy: function () {
      if (this.isChoking) {
        var dt = this.game.time.physicsElapsed;
        this.chokingSfx.volume = 1.0;
        this.chokeDuration += dt;
        this.currentFrameDuration += dt;
        if (Math.abs(this.chokeFrameTarget - this.chokeFramePos) < this.chokeArrivalEpsilon) {
          if (this.chokeFrameTarget > 0.5) {
            this.chokeFrameTarget = Math.random() * 0.4;
          } else {
            this.chokeFrameTarget = 0.6 + Math.random() * 0.4;
          }
          if (!this.chokingSfx.isPlaying) {
            var soundNames = Object.keys(this.chokingSfx.markers);
            this.chokingSfx.play(soundNames[Math.floor(Math.random() * soundNames.length)]);
          }
          this.currentFrameDuration = 0.0;
        }
        var dp = this.chokeFrameTarget - this.chokeFramePos;
        this.chokeFramePos += dp * 0.5 * dt * Math.min(32, (this.chokeDuration * 4 + 12));
        var chokeFrameIndex = Math.floor(this.chokeFramePos * this.chokeFrames.length);
        this.guy.frame = this.chokeFrames[chokeFrameIndex];
      } else {
        this.chokingSfx.volume *= 0.3;
        this.guy.frame = 0;
      }
    },
    updateScore: function () {
      if (this.isChoking) {
        this.pain += this.game.time.physicsElapsed * 100;
        this.painText.text = Math.floor(this.pain);
      }
    },
    onOverThroat: function () {
      this.isOverThroat = true;
    },
    onOutThroat: function () {
      this.isOverThroat = false;
    },
    updateChoking: function () {
      var pointer = this.game.input.activePointer;
      if (pointer && pointer.withinGame && pointer.isDown) {
        if (this.isOverThroat && !this.isChoking) {
          this.chokeFramePos = 0.5;
          this.chokeFrameTarget = this.chokeFramePos;
          this.chokeDuration = 0.0;
          this.currentFrameDuration = 0.0;
          ga('send', {
            'hitType': 'event',
            'eventCategory': 'game',
            'eventAction': 'started choking'
          });
        }
        this.isChoking = this.isOverThroat;
      } else {
        if (this.isChoking) {
          ga('send', {
            'hitType': 'event',
            'eventCategory': 'game',
            'eventAction': 'stopped choking',
            'eventValue': this.chokeDuration
          });
        }
        this.isChoking = false;
      }
    },
    updateText: function () {
      var pointer = this.game.input.activePointer;
      if (pointer && pointer.withinGame) {
        this.textSequenceStarted = true;
        var tween = this.game.add.tween(this.titleText).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true, 1000);
        tween.onComplete.add(function () {
          this.nextText();
        }, this);
      }
    },
    nextText: function () {
      var thisMessage = this.instructions.shift();
      if (!thisMessage) {
        this.instructionText.kill();
      }
      if (thisMessage.text) {
        var action = thisMessage.action;
        thisMessage = thisMessage.text;
        action();
      }
      //var thisMessage = this.instructions.pop();
      this.instructionText.text = thisMessage;
      var tween = this.game.add.tween(this.instructionText).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true, 1000);
      tween.onComplete.add(function () {
        var tween = this.game.add.tween(this.instructionText).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true, 1000);
        tween.onComplete.add(function () {
          if (this.instructions.length == 0) {
            this.instructions.push('CHOKE');
          }
          this.nextText();
        }, this);
      }, this);
    }
  };
  
  module.exports = Play;
},{}],6:[function(require,module,exports){
'use strict';
function Preload() {
  this.asset = null;
  this.ready = false;
}

Preload.prototype = {
  preload: function() {
    this.asset = this.add.sprite(this.game.width/2,this.game.height/2, 'preloader');
    this.asset.anchor.setTo(0.5, 0.5);

    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.load.setPreloadSprite(this.asset);
    this.load.spritesheet('choking_guy', 'assets/choking_guy.png', 280, 320, 9);
    this.load.image('arm', 'assets/arm.png');
    this.load.audio('choking', 'assets/choking.mp3');
  },
  create: function() {
    this.asset.cropEnabled = false;
  },
  update: function() {
    if(!!this.ready) {
      this.game.state.start('play');
    }
  },
  onLoadComplete: function() {
    this.ready = true;
  }
};

module.exports = Preload;

},{}]},{},[1]);
