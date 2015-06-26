
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
      this.chokeFrames = [0,1,2,3,4,5,6,7,8];
      this.chokeFrameIndex = Math.floor(this.chokeFrames.length / 2);
    },
    update: function() {
      if (this.isChoking) {
        this.chokeFrameIndex += Math.round(Math.random() * 2 - 1);
        this.chokeFrameIndex = Math.max(1, Math.min(this.chokeFrameIndex, this.chokeFrames.length - 1));
      } else {
        this.chokeFrameIndex = 0;
      }
      this.guy.frame = this.chokeFrames[this.chokeFrameIndex];
    },
    onPressThroat: function() {
      this.isChoking = true;
      this.chokeFrameIndex = Math.floor(this.chokeFrames.length / 2);
    },
    onReleaseThroat: function() {
      this.isChoking = false;
      this.chokeFrameIndex = Math.floor(this.chokeFrames.length / 2);
    }
  };
  
  module.exports = Play;