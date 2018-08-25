import Resources from './resources.js';
import App from './app.js';


/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine makes the canvas' context (ctx) object globally available to make
 * writing app.js a little simpler to work with.
 */

class Engine {
  constructor() {  
    this.game = new App();      
    this.canvas = document.createElement('canvas'),
    this.ctx = this.canvas.getContext('2d'),
    this.lastTime;

    this.canvas.width = 505;
    this.canvas.height = 606;
    document.body.appendChild(this.canvas);
    this.canvas.classList.add('canvas');
    this.loadResources(this)
  }

  loadResources(global) {
    /* Go ahead and load all of the images we know we're going to need to
    * draw our game level. Then set init as the callback method, so that when
    * all of these images are properly loaded our game will start.
    */
    this.resources = new Resources();
    this.resources.load([
      'images/stone-block.png',
      'images/water-block.png',
      'images/grass-block.png',
      'images/enemy-bug.png',
      'images/char-boy.png',
      'images/char-cat-girl.png',
      'images/char-horn-girl.png',
      'images/char-pink-girl.png',
      'images/char-princess-girl.png',
      'images/Gem Blue Sm.png',
      'images/Gem Orange Sm.png',
      'images/Gem Green Sm.png'
    ]);
    this.resources.onReady(function() {
      global.reset();
      global.lastTime = Date.now();
      global.main(global);
    });
  }

  /* This function serves as the kickoff point for the game loop itself
   * and handles properly calling the update and render methods.
   */
  main(global) {
    /* Get our time delta information which is required if your game
     * requires smooth animation. Because everyone's computer processes
     * instructions at different speeds we need a constant value that
     * would be the same for everyone (regardless of how fast their
     * computer is) - hurray time!
     */
    let now = Date.now()
    let dt = (now - this.lastTime) / 1000.0;

    /* Call our update/render functions, pass along the time delta to
     * our update function since it may be used for smooth animation.
     */
    this.update(dt);
    this.render();

    /* Set our lastTime variable which is used to determine the time delta
     * for the next time this function is called.
     */
    this.lastTime = now;

    /* Use the browser's requestAnimationFrame function to call this
     * function again as soon as the browser is able to draw another frame.
     */
    window.requestAnimationFrame(function () {
      global.main(global);
    });
  }

  /* This function is called by main (our game loop) and itself calls all
   * of the functions which may need to update entity's data. Based on how
   * you implement your collision detection (when two entities occupy the
   * same space, for instance when your character should die), you may find
   * the need to add an additional function call here. For now, we've left
   * it commented out - you may or may not want to implement this
   * functionality this way (you could just implement collision detection
   * on the entities themselves within your app.js file).
   */
  update(dt) {
    this.game.updateEntities(dt);
  }

  /* This function initially draws the "game level", it will then call
   * the renderEntities function. Remember, this function is called every
   * game tick (or loop of the game engine) because that's how games work -
   * they are flipbooks creating the illusion of animation but in reality
   * they are just drawing the entire screen over and over.
   */
  render() {
    /* This array holds the relative URL to the image used
     * for that particular row of the game level.
     */
    let rowImages = [
      'images/water-block.png',   // Top row is water
      'images/stone-block.png',   // Row 1 of 3 of stone
      'images/stone-block.png',   // Row 2 of 3 of stone
      'images/stone-block.png',   // Row 3 of 3 of stone
      'images/stone-block.png',   // Row 1 of 2 of grass
      'images/grass-block.png'    // Row 2 of 2 of grass
    ],
    numRows = 6,
    numCols = 5,
    row, col;

    // Before drawing, clear existing canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    /* Loop through the number of rows and columns we've defined above
     * and, using the rowImages array, draw the correct image for that
     * portion of the "grid"
     */
    for (row = 0; row < numRows; row++) {
      for (col = 0; col < numCols; col++) {
        /* The drawImage function of the canvas' context element
         * requires 3 parameters: the image to draw, the x coordinate
         * to start drawing and the y coordinate to start drawing.
         * We're using our Resources helpers to refer to our images
         * so that we get the benefits of caching these images, since
         * we're using them over and over.
         */
        this.ctx.drawImage(this.resources.get(rowImages[row]), col * 101, row * 83);
      }
    }
    this.renderEntities();
  }

  /* This function is called by the render function and is called on each game
   * tick. Its purpose is to then call the render functions you have defined
   * on your enemy and player entities within app.js
   */
  renderEntities() {
    /* Loop through all of the objects within the allEnemies array and call
     * the render function you have defined.
     */
    this.game.gem.render(this.ctx, this.resources);
    for(let k in this.game.allEnemies) { 
      this.game.allEnemies[k].render(this.ctx, this.resources);
    }
    this.game.player.render(this.ctx, this.resources);
  }

  /* This function does nothing but it could have been a good place to
   * handle game reset states - maybe a new game menu or a game over screen
   * those sorts of things. 
   */
  reset() {
    // noop
  }
}

new Engine();