
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
      //
      this.arm = this.game.add.sprite(this.game.width * 0.5, this.game.height * 0.8, 'arm');
      this.arm.anchor.setTo(0.5, 0.1);
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
        this.game.world.centerX, this.game.height * 0.9,
        'Science has shown physical violence\nto be the key to releasing stress.',
        { font: '16px Arial', fill: '#ffffff', align: 'left'}
      );
      this.instructionText.anchor.setTo(0.5, 0.5);
      this.textIsVisible = true;
    },
    update: function() {
      if (this.textIsVisible) {
        this.updateText();
      }
      this.updateChoking();
      this.updateArm();
      this.updateGuy();
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
        }
        this.isChoking = this.isOverThroat;
      } else {
        this.isChoking = false;
      }
    },
    updateText: function () {
      var pointer = this.game.input.activePointer;
      if (pointer && pointer.withinGame) {
        this.textIsVisible = false;
        console.log('poop')
        var tween = this.game.add.tween(this.instructionText).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true, 100);
        tween.onComplete.add(function () {
          this.instructionText.kill();
        }, this);
        tween = this.game.add.tween(this.titleText).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true, 100);
        tween.onComplete.add(function () {
          this.instructionText.kill();
        }, this);
      }
    }
  };
  
  module.exports = Play;