/*
 * Ding
 * last update: 2011-12-25
 * 
 * Copyright (C) 2011 by Davide S. Casali <folletto AT gmail DOT com>
 * 
 *
 * Usage:
 *   1. Define the CSS for 'ding-sprite'.
 *   2. Init with an hash of items (by CSS id or, with jQuery, selector) to be "dingable", 
 *      and the number of dings:
 *
 *       Ding.init({
 *         "#id": 1,
 *         "#id2": 5
 *       });
 * 
 *   You can also specify extension, receiving the clicked selector name and the countdown
 *   as parameters. Each extension is specified in this way:
 *
 *       Ding.x.extensionName = function(selector, countdown) {
 *         // do your stuff here
 *       }
 * 
 */



var Ding = function() { this.init.apply(this, arguments); } // Prototype-like Constructor
Ding.prototype = {
  
  sprite: null,
  sound: {},
  loop: null,
  
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
      if (param instanceof Object) {
        for (i in param) {
          self.getElementBySelector(i).addEventListener("click", self.listenerFactoryDingable(i, param[i]), false);
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
    this.sprite.style.zIndex = "200";
    
    document.body.appendChild(this.sprite);
  },
  
  listenerFactoryDingable: function(selector, count) {
    /****************************************************************************************************
     * Make a DOM object dingable.
     */
    var self = this;
    var countdown = count;
    
    return function clickedDingable(e) {
      // ****** Resets
      clearTimeout(self.loop);
      
      // ****** Extensions
      for (x in Ding.x) {
        Ding.x[x](selector, countdown - 1);
      }
      
      // ****** Animate: initialization
      self.sprite.style.display = "block";
      self.sprite.style.opacity = 1.0;
      self.positionToCSS(e.currentTarget.offsetTop - self.sprite.offsetHeight, e.currentTarget.offsetLeft + (e.currentTarget.offsetWidth / 2) - (self.sprite.offsetWidth / 2), self.sprite);
      
      // ****** Animate: play
      self.sound.ding.play();
      var roof = e.currentTarget.offsetTop - 200;
      self.animate(function(t) { return self.dingAnimation(t, self.sprite, roof); });
      
      // ****** Countdown and trigger href action when zero.
      countdown--;
      if (countdown <= 0) {
        var href = e.currentTarget.href;
        setTimeout(function() { window.location = href; }, 400);
      }
      
      // ****** Prevent click until animation ends
      // * Tested on: Firefox 3.5+, Chrome 16+, Safari 5.0+, Opera 10
      if (e && e.preventDefault) e.preventDefault();
      else if (window.event && window.event.returnValue) window.eventReturnValue = false;
    }
  },
  
  dingAnimation: function(t, sprite, roof) {
    /****************************************************************************************************
     * Ding! From an object
     * 
     */
    
    if (t < 1) {
      // Zero, tiny wait...
      // This is required to force the first showing of the element at the real starting point
      
    } else if (sprite.offsetTop > roof) {
      // First, move...
      sprite.style.top = (sprite.offsetTop - (sprite.offsetTop - roof) / 5) + "px";
      
    } else if (t < 500) {
      // Second, pause...
      
    } else if (sprite.style.opacity > 0) {
      // Third, disappear...
      sprite.style.opacity = sprite.style.opacity - 0.201; // the 0.001 is required to avoid float issues
      
    } else {
      // Fourth, remove...
      this.loop = setTimeout(function() { sprite.style.display = "none"; }, 200);
      return false;
    }
    
    return true;
  },
  
  // UTILITY FUNCTIONS
  animate: function(fx) {
    /****************************************************************************************************
     * Animation primer.
     * The callback function must return false when the animation has to end, true oterwise.
     * The function inject a time variable in milliseconds.
     *
     * https://developer.mozilla.org/en/DOM/window.mozRequestAnimationFrame
     * http://www.goat1000.com/2011/04/07/mozrequestanimationframe-and-webkitrequestanimationframe.html
     */
    var aloop;
    var tstart = +new Date();
    var requestAnimationFrame = window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame;
    
    if (requestAnimationFrame) {
      aloop = function animationFrameCallback() { if (fx((new Date()) - tstart)) requestAnimationFrame(aloop); }
    } else {
      aloop = function animationTimedCallback() { if (fx((new Date()) - tstart)) setTimeout(aloop, 1000 / 60); }
    }
    
    // Run!
    aloop();
    
    return aloop;
  },
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

/****************************************************************************************************
 * Extensions Namespace
 */
Ding.x = {};
