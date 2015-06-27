
  'use strict';
  function Play() {}
  Play.prototype = {
    create: function() {
      //
      this.guy = this.game.add.sprite(this.game.width * 0.5, this.game.height, 'choking_guy');
      this.guy.inputEnabled = true;
      this.guy.hitArea = new Phaser.Rectangle(-20, -150, 90, 70);//95, 172, 90, 40);
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
        "I did give it a pain counter that\ngoes up while being choked.",
        "But I don't think it's the same as the\npain you, I, or say, a dog would feel.",
        "Breath deeply and allow all the stress\nto drain out of your body",
        "Just as the life would be leaving the\nbody of this guy if he were real.",
        "But he's not and you're not crushing\nthe larynx of anything that's alive.",
        "Studies have shown that people who\nchoked the longest had the best results.",
        "Of course, the pain counter will\ncontinue to increment.",
        "If that matters to you at all.\nI'm not worried about it, really.",
        "Focus your mind on something that\nhappened today which caused you stress.",
        "This is the prick that did that!\nLook into his eyes!",
        "CHOKE",
        "CHOKE",
        "CHOKE",
        "CHOKE",
        "CHOKE",
        "CHOKE",
        "CHOKE",
        "Ok ok take a break.\nFeeling a little better?",
        "Do this every night before bed!",
        "Stick around if you're not\ndone choking!",
        "Otherwise, see you next time!",
        "CHOKE",
        "CHOKE",
        "CHOKE",
        "CHOKE",
        "CHOKE",
        "CHOKE",
        "CHOKE",
        "CHOKE",
        "CHOKE",
        "CHOKE",
        "CHOKE",
        "CHOKE",
        "CHOKE",
        "CHOKE",
        "CHOKE",
        "CHOKE",
        "CHOKE",
        "CHOKE",
        "CHOKE",
        "CHOKE",
        "CHOKE"
      ];
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
      }
    },
    updateGuy: function () {
      if (this.isChoking) {
        var dt = this.game.time.physicsElapsed;
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
        this.guy.frame = 0;
      }
    },
    updateScore: function () {
      if (this.isChoking) {
        this.pain += this.game.time.physicsElapsed * 10;
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
            'eventAction': 'started choking'
          });
        }
        this.isChoking = this.isOverThroat;
      } else {
        if (this.isChoking) {
          ga('send', {
            'hitType': 'event',
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
      //var thisMessage = this.instructions.pop();
      this.instructionText.text = thisMessage;
      var tween = this.game.add.tween(this.instructionText).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true, 1000);
      tween.onComplete.add(function () {
        var tween = this.game.add.tween(this.instructionText).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true, 1000);
        tween.onComplete.add(function () {
          if (this.instructions.length > 0) {
            this.nextText();  
          } else {
            this.instructionText.kill();
          }
        }, this);
      }, this);
    }
  };
  
  module.exports = Play;