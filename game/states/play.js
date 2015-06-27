
  'use strict';
  function Play() {}
  Play.prototype = {
    create: function() {
      this.guy = this.game.add.sprite(this.game.width * 0.5, this.game.height, 'choking_guy');
      this.guy.inputEnabled = true;
      this.guy.hitArea = new Phaser.Rectangle(-20, -150, 90, 70);//95, 172, 90, 40);
      this.guy.anchor.setTo(0.5, 1.0);
      this.isChoking = false;
      this.guy.events.onInputDown.add(this.onPressThroat, this);
      this.guy.events.onInputUp.add(this.onReleaseThroat, this);
      this.chokeFrames = [1,2,3,4,5,6,7,8];
      this.chokeFramePos = 0.5;
      this.chokeFrameTarget = 0.5;
      this.chokeDuration = 0.0;
      this.currentFrameDuration = 0.0;
      this.chokeArrivalEpsilon = 0.02;
      //
      this.arm = this.game.add.sprite(this.game.width * 0.5, this.game.height, 'arm');
      this.arm.anchor.setTo(0.5, 0.1);
      // sfx
      this.chokingSfx = this.game.add.audio('choking');
      this.chokingSfx.allowMultiple = true;
      this.chokingSfx.addMarker('choke0', 0, 0.88);
      this.chokingSfx.addMarker('choke1', 0.88, 0.68);
      this.chokingSfx.addMarker('choke2', 1.56, 1.12);
    },
    update: function() {
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
    onPressThroat: function() {
      this.isChoking = true;
      this.chokeFramePos = 0.5;
      this.chokeFrameTarget = this.chokeFramePos;
      this.chokeDuration = 0.0;
      this.currentFrameDuration = 0.0;
    },
    onReleaseThroat: function() {
      this.isChoking = false;
    }
  };
  
  module.exports = Play;