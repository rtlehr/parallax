/**
* Creates a Joystick like input device for your game
*
* @class joyStick
* @constructor
* @game {Phaser Game} Reference to the Phaser game
* @x {Num} x position of the joystick
* @y {num} y location of the joystick
* @pref {Object} Preferences for the joystick
*/

//Push the graphics into the preload array
//Game.preloadItems.push({type:"image",name:"base",path:"assets/images/gamePad/joystick-base.png"});
//Game.preloadItems.push({type:"image",name:"stick",path:"assets/images/gamePad/joystick-stick.png"});

(function () {
    
Joystick = function(game,x,y,pref)
{
    //reference to the game
	this.game = game;
    
    //Position of the joystick
    this.xPos = x;
    this.yPos = y;
    
    //Preferences for the joystic
    this.pref= pref;
    
    if(this.pref == undefined)
    {
        this.pref = {};
    }
    
    //the speed the joystick is moved (used for keyboard input)
    this.stickSpeed = (this.pref.hasOwnProperty("stickSpeed"))?this.pref.stickSpeed:2;
    
    this.desktopMax = (this.pref.hasOwnProperty("desktopMax"))?this.pref.desktopMax:50;
    
    //true = when the joystick is not being used it snaps back to netural position
    this.snapBack = (this.pref.hasOwnProperty("snapBack"))?this.pref.snapBack:true;
    
    //Fine tune the bounds movement of the stick
    this.adjustRadius = (this.pref.hasOwnProperty("adjustRadius"))?this.pref.adjustRadius:0;
    
    //Values being created from the joystick
    this.horzVal;
    this.vertVal;
    
    this.currPointer;
    
    this.joyStick = this.game.add.group();
    
    this.desktopHorz = 0;
    this.desktopVert = 0;
    
    this.create();
        	
};

Joystick.prototype = {
	
    /**
    * Preload images of the joystick 
    *
    * @method preload
    */
    
	preload: function () {},
    
    /**
    * Create the joystick 
    *
    * @method create
    */
    
	create: function () 
	{
        //create the base
		this.base = this.game.add.sprite(this.xPos,this.yPos,'base');
        //Set the base anchor to the middle of the sprite
        this.base.anchor.setTo(0.5,0.5);
        this.joyStick.add(this.base);
        
        //Get the radius of the Base
        this.radius = (this.base.width/2);
        
        //create the stick
		this.stick = this.game.add.sprite(this.xPos,this.yPos,'stick');
        this.stick.anchor.setTo(0.5,0.5);
        this.joyStick.add(this.stick);
        
        //position the stick in the center of the base
        this.stick.x = this.base.x;
        this.stick.y = this.base.y;
                
        //Check to see what type of input is used to move the stick
        if(this.game.device.desktop)
        {
            this.cursors = this.game.input.keyboard.createCursorKeys();
        }
        		
	},
    
    /**
    * Update the joystick 
    *
    * @method update
    */
    render: function()
    {
        this.game.debug.spriteBounds(this.base);
        this.game.debug.spriteBounds(this.stick);
    },
	update: function () {
                
        //Check the input type for the joystick        
        switch (this.game.device.desktop)
        {
            case true:
                                
                if(this.cursors.left.isDown && (this.desktopHorz > (this.desktopMax*-1)))
                {
                    this.desktopHorz -= this.stickSpeed;

                }
                else if(this.cursors.right.isDown && (this.desktopHorz < this.desktopMax))
                {
                    this.desktopHorz += this.stickSpeed;
                }

                if(this.cursors.up.isDown && (this.desktopVert > (this.desktopMax*-1)))
                {
                    this.desktopVert -= this.stickSpeed;
                }
                else if(this.cursors.down.isDown && (this.desktopVert < this.desktopMax))
                {
                    this.desktopVert += this.stickSpeed;
                }
                
                if( !this.cursors.left.isDown &&
                    !this.cursors.right.isDown &&
                    !this.cursors.up.isDown &&
                    !this.cursors.down.isDown)
                {
                    this.desktopHorz = 0;
                    this.desktopVert = 0;
                }
                
                this.horzVal = this.desktopHorz/this.desktopMax;
                this.vertVal = this.desktopVert/this.desktopMax;
                
                break;
            case false:
                this.currPointer = (this.game.input.pointer1.x <= (game.world.width/2))?this.game.input.pointer1:this.game.input.pointer2;                
                this.movable = this.limit(this.base.x,this.base.y,this.currPointer.x,this.currPointer.y,(this.radius-this.adjustRadius));
                this.stickPos = this.inputTouch(this.movable);
                
                //Move the stick to where it needs to be
                this.stick.x = this.stickPos.x;
                this.stick.y = this.stickPos.y;

                //Get the values of the positions
                this.horzVal = this.clamp((Math.floor(100*((this.stick.x - this.base.x)/(this.radius-this.adjustRadius))))/100);
                this.vertVal = this.clamp((Math.floor(100*((this.stick.y - this.base.y)/(this.radius-this.adjustRadius))))/100);
                break;
        }
        
        
            
	},
    
    /**
    * Clamps the values of the horz and vert position between -1 to 1
    *
    * @method clamp
    */
    
    clamp: function(n)
    {
        return Math.min(Math.max(n, -1), 1);
    },
    
    /**
    * Controls the movement of the stick from the touch
    *
    * @method inputTouch
    */
    
    inputTouch: function (movable)
    {
        var xPos = this.stick.x;
        var yPos = this.stick.y;

        if(movable.up && movable.down && movable.left && movable.down && this.currPointer.active)
        {
            xPos = this.currPointer.x;
            yPos = this.currPointer.y;
        }
        
        if(!this.currPointer.active && this.snapBack)
        {
            xPos = this.base.x;
            yPos = this.base.y;
        }

        return {x:xPos,y:yPos};   
    },
    
    /**
    * Controls the movement of the stick from the mouse
    *
    * @method inputMouse
    */
    
    inputMouse: function(movable)
    {
        var xPos = this.stick.x;
        var yPos = this.stick.y;

        if(movable.up && movable.down && movable.left && movable.down && this.game.input.mousePointer.isDown)
        {
            xPos = this.game.input.activePointer.x - (this.stick.width/2);
            yPos = this.game.input.activePointer.y - (this.stick.height/2);
        }
        
        if(!this.game.input.mousePointer.isDown && this.snapBack)
        {
            xPos = this.base.x - (this.stick.width/2);
            yPos = this.base.y - (this.stick.height/2);
        }
        
        return {x:xPos,y:yPos};

    },
	
    /**
    * Limits the position of the stick inside of the base 
    *
    * @method limit
    */
    
    limit: function(x1, y1, x2, y2,radius)
    {
        //the vector between the two points
        var dx = x2 - x1,
            dy = y2 - y1,
            distanceSquared = (dx * dx) + (dy * dy);
                        
            if (distanceSquared <= radius * radius) {
                return { up: true, down: true, right: true, left: true };
            } else {
                var distance = Math.sqrt(distanceSquared),
                    ratio = radius / distance;
                                
                return {
                    up: (dy > 0), 
                    down: (dy < 0), 
                    right: (dx < 0), 
                    left: (dx > 0)
                }
            }
    },
    fixToCamera: function()
    {
        this.joyStick.fixedToCamera = true;
    },
    
    /**
    * returns the horizontal value of the stick
    *
    * @method getHorzVal
    */
    
    getHorzVal: function()
    {
        return this.horzVal;
    },
    
    /**
    * returns the vertical value of the stick
    *
    * @method getVertVal
    */
    
    getVertVal: function()
    {
        return this.vertVal;
    },
    
    /**
    * returns the joystick group
    *
    * @method getJoystick
    */
    
    getJoystick: function()
    {
        return this.joyStick;
    },
    
    /**
    * sets the Joystick group alpha to 1
    *
    * @method showJoystick
    */
    
    showJoystick: function()
    {
        this.joyStick.alpha = 1;
    },
    
    /**
    * sets the Joystick group alpha to 0
    *
    * @method hideJoystick
    */
    
    hideJoystick: function()
    {
        this.joyStick.alpha = 0;
    }
	
};
    
})();