BEAT☆MUSIC☆SEQUENCE
===================

A rhythm game that advances with web technology
-----------------------------------------------

BEAT☆MUSIC☆SEQUENCE is the first open-source web-based rhythm game
built using HTML5 technologies—an evidence that HTML5 is ready for music games.

It is a BMS player; it plays the music encoded in BMS format.

This game relies heavily on cutting-edge HTML5 technologies,
and works only on very modern browsers.



Supported Browsers
------------------

* __Safari__. Tested on Mac OS X 10.9.
  Safari has the lowest audio latency on Mac.
  Keysounds play almost instanteously.
* __MobileSafari__. Tested on
    * iPad with Retina Display, running iOS 6.1.3.
    * iPad Air, running iOS 7.
* __Google Chrome__. Tested on Windows 7 and Mac OS X 10.9 with Chrome 31.
  Chrome has _very slight_ audio latency,
  but most rhythm games I played also have this much latency.




Design and Development Philosophies
-----------------------------------

* Extremely tiny core with small plugins building on top of another,
  following the footsteps of [Bespoke.js](http://markdalgleish.com/presentations/bespoke.js/).
* Unit tests with coverage report using [Karma](http://karma-runner.github.io/).
* Rely on cutting-edge technology, don't care about older browsers.
  More things will become possible as the web technology allows.




Currently-Used Web Technologies
-------------------------------

* [__HTML5 Canvas__](http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html).
  Uses [Pixi.js](https://github.com/GoodBoyDigital/pixi.js/) as a rendering engine
  because it allows usage of WebGL on browsers that support them,
  making the game extremely smooth.
  It's also very fast on browsers that supports hardware-accelerated canvas,
  such as MobileSafari.
* [__Web Audio API__](http://www.w3.org/TR/webaudio/)
  now allows the web to play audio in realtime.
  Even tens of keysounds can be played in realtime without delay.
  Uses [SoundJS](http://www.createjs.com/#!/SoundJS) because it makes things so simple.
* [__XMLHttpRequest 2__](http://www.w3.org/TR/XMLHttpRequest2/) and [__CORS__](http://www.w3.org/TR/cors/)
  allow loading music files from other servers,
  allowing anyone to host their own music collection,
  even allow playing on localhost.
  Uses [PreloadJS](http://www.createjs.com/#!/PreloadJS) to handle asset loading.
* [__Touch Events__](http://www.w3.org/TR/touch-events/)
  lets people on iPad play this game as well.




Web Technologies in the Future
------------------------------

* The [__Gamepad__](http://www.w3.org/TR/gamepad/) API
  will let user plug in their home controllers and play this game.
  I tried plugging my beatmaniaIIDX Home Controller,
  but Firefox and Chrome was unable to detect it.
* [ECMAScript 6](https://wiki.mozilla.org/ES6_plans)
  will help make the code cleaner.
  As of March 2014, I have tried the traceur compiler,
  but it did not work well with the test harness,
  the build infrastructure, and the code coverage tool.
  So it's not ready for prime time, yet.

















