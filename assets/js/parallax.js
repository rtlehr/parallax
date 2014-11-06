var game = new Phaser.Game(1024, 672, Phaser.CANVAS, 'phaser-example',{ preload: preload, create: create, update: update, render: render });

	function preload() 
    	{
		
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		
		this.scale.minWidth = 480;                                                                                                                      
		this.scale.minHeight = 260;
		this.scale.maxWidth = 1024;
		this.scale.maxHeight = 672;
		
		this.scale.pageAlignHorizontally = true;
		this.scale.pageAlignVertically = true;
		
		this.scale.setScreenSize(true);
		
		this.stage.forcePortrait = false;
		this.stage.backgroundColor = '#111111';
		
		this.input.addPointer();
		
		//Load images
		game.load.image('background', 'assets/images/landscape/background.png');
		game.load.image('level2', 'assets/images/landscape/level2.png');
		game.load.image('level3', 'assets/images/landscape/level3-bench.png');
		game.load.image('level4', 'assets/images/landscape/level4-city.png');
		game.load.image('level5', 'assets/images/landscape/level5-trees.png');
		game.load.image('frame', 'assets/images/landscape/frame.png');

		game.load.image('rocket', 'assets/images/rocketShip.png');
		game.load.image('base', 'assets/images/gamePad/joystick-base.png');
		game.load.image('stick', 'assets/images/gamePad/joystick-stick.png');
		
		//Create an instance of the parallax class
        	this.parallax = new Parallax(this.game);
        }

	function create() 
    	{
	    	//Set the number of times the images well be tiled
	        this.levelLength = 3;
	        
	        //Load images into the parallax class (from back to front)
	        this.parallax.add("background",false);
	        this.parallax.add("level2",false, {tile:this.levelLength});
	        this.parallax.add("level3",true, {tile:this.levelLength});
	        this.parallax.add("level4",false);
	        this.parallax.add("level5",false, {tile:this.levelLength});
	        
	        //Set the game world bounds
	        this.game.world.setBounds(0, 0, (1024*(4*this.levelLength)), 672);
	        
	        //Add physics
	        this.game.physics.startSystem(Phaser.Physics.P2JS);
	        
	        //Add the rocket
	        this.rocket = this.game.add.sprite((this.game.camera.width/2),(this.game.world.height/2)-50,'rocket');
	        this.rocket.anchor.setTo(0.5,0.5);
	        
	        //Add the frame graphic
	        this.frame = this.game.add.sprite(0,0,'frame');
	        this.frame.fixedToCamera = true;
	        
	        //Include the rocket into the physics
	        this.game.physics.p2.enable(this.rocket);
	        this.game.camera.follow(this.rocket);
	                        
	        //Add the game interface
	        this.gameInterface = new GameInterface(this.game,2,true);
	        this.gameInterface.fixedToCamera();
        
	}

	function update() 
    	{
	        this.gameInterface.update();
	        
	        this.rocket.body.setZeroVelocity();
	        
	        this.baseSpeed = 1500;
	        
	        var horzVal = this.gameInterface.getHorzVal();
	        
	        var vertVal = this.gameInterface.getVertVal();
	        
	        this.rocket.body.moveRight(this.baseSpeed * horzVal);
	        
	        this.rocket.body.moveDown(this.baseSpeed * vertVal);
	    
	        this.parallax.update();
				
	}

	function render()
    	{
        	//this.game.debug.cameraInfo(this.game.camera, 32, 32);
        	//this.game.debug.spriteCoords(this.rocket, 32, 200);
    	}

