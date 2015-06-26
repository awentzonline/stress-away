
  'use strict';
  function Play() {}
  Play.prototype = {
    create: function() {
      this.guy = this.game.add.sprite(this.game.width * 0.5, this.game.height, 'choking_guy');
      this.guy.anchor.setTo(0.5, 1.0);
      this.guy.inputEnabled = true;
      this.isChoking = false;
      this.guy.events.onInputDown.add(this.onPressThroat, this);
      this.guy.events.onInputUp.add(this.onReleaseThroat, this);
      this.chokeFrames = [1,2,3,4,5,6,7,8];
      this.chokeFramePos = 0.5;
      this.chokeFrameTarget = 0.5;
      this.chokeDuration = 0.0;
      this.currentFrameDuration = 0.0;
      this.changeFrameProbability = 1.5;  // per second
    },
    update: function() {
      if (this.isChoking) {
        var dt = this.game.time.physicsElapsed;
        this.chokeDuration += dt;
        this.currentFrameDuration += dt;
        if (Math.random() < this.changeFrameProbability * this.currentFrameDuration * (this.chokeDuration / 3 + 1)) {
          this.currentFrameDuration = 0.0;
          this.chokeFrameTarget = Math.random();
        }
        var dp = this.chokeFrameTarget - this.chokeFramePos;
        this.chokeFramePos += dp * 0.5 * dt * 16;
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