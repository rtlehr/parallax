/**
* Draws the game interface
*
* @class Interface
* @constructor
*/

(function () {
   
GameInterface = function(game, stickSpeed, snapBack)
{
    this.game = game;
    
    this.stickSpeed = stickSpeed;
        
    this.snapBack = snapBack;
    
    this.interface = this.game.add.group();
    
    this.joyStick = null;
    
    this.buttonPad = null;
    
    this.create();
}

GameInterface.prototype = 
{
    create: function()
    {
        this.joyStick = new Joystick(this.game,125,this.game.camera.height - 125, {stickSpeed:this.stickSpeed, snapBack: this.snapBack, adjustRadius:45});
        this.interface.add(this.joyStick.getJoystick());
    },
    hideInterface: function()
    {
        this.interface.alpha = 0;
    },
    showInterface: function()
    {
        this.interface.alpha = 1;
    },
    fixedToCamera: function()
    {
        this.interface.fixedToCamera = true;
    },
    update: function()
    {
        this.joyStick.update();
    },
    render: function()
    {
        this.joyStick.render();
    },
    getHorzVal: function()
    {
        return this.joyStick.getHorzVal();
    },
    getVertVal: function()
    {
        return this.joyStick.getVertVal();
    }
}

})();