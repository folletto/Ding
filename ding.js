/*
 * Ding
 * last update: 2011-08-26
 * 
 * Copyright (C) 2011 by Davide S. Casali <folletto AT gmail DOT com>
 * 
 *
 * Usage:
 *   Define the CSS for 'ding-sprite'.
 *   Init with the position of the dripping point:
 *
 *     Ding.init([
 *       "#id",
 *       "#id2"
 *     ]);
 * 
 *   Or:
 *
 *     Ding.init({
 *       "#id": 1,
 *       "#id2": 5
 *     });
 * 
 */



var Ding = function() { this.init.apply(this, arguments); } // Prototype-like Constructor
Ding.prototype = {
  
  sprite: null,
  sound: {},
  loop: null,
  coins: 0,
  
  init: function(param) {
    /****************************************************************************************************
     * Wait for the DOM to be ready and attach to it.
     */
    var self = this;
    document.addEventListener("DOMContentLoaded", function() {
      document.removeEventListener( "DOMContentLoaded", arguments.callee, false);
      
      // ****** Prepare
      self.precache();
      self.makeSprite();
      
      // ****** Attach event listeneres
      if (param instanceof Array) {
        for (i in param) {
          self.makeDingable(self.getElementBySelector(param[i]));
        }
      } else if (param instanceof Object) {
        for (i in param) {
          self.makeDingable(self.getElementBySelector(i), param[i]);
        }
      }
      
    }, false);
  },
  
  precache: function() {
    /****************************************************************************************************
     * Precache assets
     */
    this.sound = {
      'ding': new Audio("coin.wav")
    };
  },
  
  makeSprite: function() {
    /****************************************************************************************************
     * Make the sprite.
     * Call this after document is ready.
     */
    this.sprite = document.createElement('div');
    this.sprite.setAttribute('class', 'ding-sprite');
    this.sprite.style.position = "absolute";
    this.sprite.style.display = "none";
    
    document.body.appendChild(this.sprite);
  },
  
  makeDingable: function(obj, count) {
    /****************************************************************************************************
     * Make a DOM object dingable.
     */
    obj.addEventListener("click", this.listenerFactoryDingable(count), false);
  },
  
  listenerFactoryDingable: function(count) {
    /****************************************************************************************************
     * Make a DOM object dingable.
     */
    var self = this;
    var currentCount = 0;
    
    return function(e) {
      // ****** Position
      var href = e.currentTarget.href;
      self.sprite.style.display = "block";
      self.sprite.style.opacity = 1.0;
      self.positionToCSS(e.currentTarget.offsetTop - self.sprite.offsetHeight, e.currentTarget.offsetLeft, self.sprite);
      
      // Coins
      self.coins++;
      if (typeof console !== 'undefined') console.log("Coins taken up until now: " + self.coins);
      
      // Animate
      //self.dingAnimation(self.sprite, e.currentTarget.offsetTop - 200);
      self.sound.ding.play();
      var roof = e.currentTarget.offsetTop - 250;
      self.animate(function() { return self.dingAnimation(self.sprite, roof); });
      
      // This is separated to avoid locks
      currentCount++;
      if (currentCount >= count) {
        setTimeout(function() { window.location = href; }, 400);
      }
      
      
      // ****** Prevent click until animation ends
      if (e &&e.preventDefault) e.preventDefault();
      else if (window.event && window.event.returnValue) window.eventReturnValue = false;
    }
  },
  
  animate: function(fx) {
    /****************************************************************************************************
     * Animation primer.
     * The function must return False when the animation has to end, true oterwise.
     *
     * https://developer.mozilla.org/en/DOM/window.mozRequestAnimationFrame
     * http://www.goat1000.com/2011/04/07/mozrequestanimationframe-and-webkitrequestanimationframe.html
     */
    var aloop;
    var requestAnimationFrame = window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame;
    
    if (requestAnimationFrame) {
      aloop = function animationFrameCallback() { if (fx()) requestAnimationFrame(aloop); }
    } else {
      aloop = function animationTimedCallback() { if (fx()) setTimeout(aloop, 1000 / 60); }
    }
    
    // Run!
    aloop();
    
    return aloop;
  },
  
  dingAnimation: function(sprite, roof) {
    /****************************************************************************************************
     * Ding! From an object
     */
    var self = this;
    
    if (sprite.offsetTop > roof) {
      // First, move...
      sprite.style.top = (parseInt(sprite.style.top) * 0.850) + "px";
      //this.loop = setTimeout(function() { self.dingAnimation(sprite, roof) }, 1);
    } /*else if (sprite.offsetTop <= roof + 50) {
      // Second, disappear
      sprite.style.top = (parseInt(sprite.style.top) * 1.095) + "px";
      this.loop = setTimeout(function() { self.dingAnimation(sprite, roof, 1) }, 10);
    } */else {
      // Third, remove
      this.loop = setTimeout(function() { sprite.style.display = "none"; }, 200);
      return false;
    }
    
    return true;
  },
  
  // UTILITY FUNCTIONS
  getElementBySelector: function(selector) {
    /****************************************************************************************************
     * Get a DOM object from a specific selector.
     *
     * TODO: fix if jQuery exists, untested probably broken
     */
    var id = "";
    if (typeof jQuery !== 'undefined') {
      return jQuery(id);
    } else if (id = selector.match(/#([^ ]+)/)[1]) { // match if it's an id *only*
      return document.getElementById(id);
    }
    return null;
  },
  positionToCSS: function(x, y, sprite) {
    /****************************************************************************************************
     * Convert x/y coordinates to CSS values, reverting negative values like CSS.
     */
    if (x >= 0) sprite.style.top = x + "px";
    else sprite.style.bottom = -x + "px";
    if (y >= 0) sprite.style.left = y + "px";
    else sprite.style.right = -y + "px";
  }
}
