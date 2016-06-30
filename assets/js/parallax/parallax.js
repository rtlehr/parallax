/**
 * Parallx
 *
 * @class Parallax
 * @constructor
 * @game {Phaser Game} Reference to the Phaser game
 */

(function() 
{

 Parallax = function(game) 
 {

  /**
   * Holds the instance of the game
   * 
   * @property game
   * @type {Class}
   */

  this.game = game;

  /**
   * Holds the images to use
   * 
   * @property paraImages
   * @type {Array}
   */

  this.paraImages = [];

  /**
   * Holds the width of the images
   * 
   * @property imageWidth
   * @type {Array}
   */

  this.imageWidth = [];

  /**
   * Holds the width of the image used as the benchmark
   * 
   * @property bench
   * @type {Number}
   */

  this.bench = 0;

 }

 Parallax.prototype = {}
 
  /**
   * Add an image to the parallax
   *
   * @method add
   * @image {sprite} Sprite to move
   * @isBench {bool} Tells function to use this image as the benchmark
   * @pref {Object} Preferences for the Parallax
   */
 
 Parallax.prototype.add = function(image, isBench, pref) 
 {
	 
  //Preferences for the joystic
  this.pref = pref;

  if (this.pref == undefined) 
	{
		
   this.pref = {};
		
  }

  //horizontally tiles the image
  this.tile = (this.pref.hasOwnProperty("tile")) ? this.pref.tile : 1;

  //adjusts the speed of the image
  this.Ypos = ((this.pref.hasOwnProperty("y")) ? this.pref.y : 0);

  //Creates the group to hold the tiled images
  if (this.tile > 1) 
	{
		
   //creates the group
   this.group = game.add.group();

   //put the images in the group
   this.group.createMultiple(this.tile, image, 1, true);

   //layout the images in the group
   for (count = 0; count < this.group.length; count++) 
	 {
		 
    this.group.getAt(count).x = this.group.getAt(0).width * count;
		 
    this.group.getAt(count).y = this.Ypos;
		 
   }

   //put the group in the paraImages array
   this.paraImages[this.paraImages.length] = this.group;
		
   //put the width of the group in the imageWidth array (can remove this when Phaser adds functionality to get the width of a group)
   this.imageWidth.push(this.group.getAt(0).width * this.tile);
		
  } 
	else 
	{
		
   this.paraImages[this.paraImages.length] = this.game.add.sprite(0, this.Ypos, image);
		
   this.imageWidth.push(this.paraImages[this.paraImages.length - 1].width);
		
  }

  this.paraImages[this.paraImages.length - 1].fixedToCamera = true;

  //If this is the benchmark image, put it in the banch
  if (isBench) 
	{
		
   this.benchImage = this.paraImages[this.paraImages.length - 1];
		
   this.bench = this.imageWidth[this.imageWidth.length - 1];
		
  }

 }

 /**
  * Move the images on the X access
  *
  * @method update
  * @speed {int} amount to move the images
  */

 Parallax.prototype.update = function() 
 {

  for (count = 0; count < this.paraImages.length; count++) 
	{

   v = ((this.imageWidth[count] - this.game.camera.width) / (this.bench - this.game.camera.width));

   this.paraImages[count].cameraOffset.x = (-1 * this.game.camera.x) * v;

  }

 }

})();