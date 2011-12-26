Project Ding
============

**Simple gamification technique gimmick "coin" engine.**  
<http://intenseminimalism.com/>



WHAT IS DING
------------

Ding is a tiny javascript that create the HTML equivalent of the coin box in Super Mario, but instead of hitting it with the head of Mario, you click. When you reach the last click, the action triggers.


USAGE
-----

Ding has a very simple basic usage.

1. Define the .ding-sprite CSS class, specifying the image and effects you'd like to show.

2. Include ding.js in the page.

3. Initialize Ding, passing an hash of ids and the number of clicks required to trigger them:
 
```
       Ding.init({
         "#id": 1,
         "#id2": 5
       });
```

That's all... but of course, you might want to do something more with it. That's why it supports extensions.


EXTENSIONS
----------

A Ding extension will be executed every time a user clicks on a Ding-enabled link.

The syntax is as follows:

```
       Ding.x.extensionName = function(selector, countdown) {
         // do your stuff here
         return 5; // optional
       }
```

The return value is optional. If specified, it replaces the current countdown value for the clicked object.



COMPATIBILITY
-------------

Tested on:

- Chrome 13 - 16 _(should work since Chrome 3)_
- Firefox 3.5 - 7.0
- Safari 5.1 _(should work since Safari 3)_
- Opera 10.10
- _should work in IE9_



TODO
----

- Test properly on multiple browser
- Add some kind of CSS sprite extension hooks
- Fallback compatibility for audio (not only HTML5)




LICENSE
-------

  _Copyright (C) 2011, Davide Casali_  
  _Licensed under **BSD Opensource License** (free for personal and commercial use)_


> _Ding! Ding! Ding! Ding!_

