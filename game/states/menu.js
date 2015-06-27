
'use strict';
function Menu() {}

Menu.prototype = {
  preload: function() {

  },
  create: function() {
    var logo = this.game.add.sprite(this.game.world.centerX, this.game.height * 0.3, 'logo');
    logo.anchor.setTo(0.5, 0.5);
    var style = { font: '18px Arial', fill: '#ffffff', align: 'right'};
    
    this.titleText = this.game.add.text(
      this.game.world.centerX, this.game.height * 0.6,
      'A simulation-based approach\nto personal stress reduction.\n\nClick to begin',
      style
    );
    this.titleText.anchor.setTo(0.5, 0.5);

    if (this.game.device.desktop) {
      this.arm = this.game.add.sprite(this.game.width * 0.5, this.game.height * 0.8, 'arm');
      this.arm.anchor.setTo(0.5, 0.1);
      this.armSwayRadius = 17;
    } else {
      this.arm = null;
    }

    var music = this.game.add.audio('background_music');
    music.play();
  },
  update: function() {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
    if (this.arm) {
      this.updateArm();
    }
  },
  updateArm: function () {
      var pointer = this.game.input.activePointer;
      if (pointer && pointer.withinGame) {
        this.arm.position.setTo(pointer.x, pointer.y);
      }
    },
};

module.exports = Menu;
